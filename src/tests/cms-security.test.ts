import { describe, it, expect, beforeAll } from 'vitest';
import config from '@/payload.config';
import { getPayload, type Payload } from 'payload';
import { resetRateLimits } from '@/lib/rate-limiter';
import type { User } from '@/payload-types';

describe('CMS Security Hardening & Regression Tests', () => {
  let payload: Payload;

  beforeAll(async () => {
    payload = await getPayload({ config });
    resetRateLimits();
  });

  describe('1. Protección y Privacidad de Contactos', () => {
    it('debe rechazar la lectura anónima de contactos (overrideAccess: false, user: undefined)', async () => {
      // Un visitante anónimo NUNCA debe poder consultar la lista de mensajes de contacto
      await expect(
        payload.find({
          collection: 'contacts',
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow();
    });

    it('debe permitir la creación anónima de contactos válidos desde el sitio web', async () => {
      resetRateLimits();
      const contact = await payload.create({
        collection: 'contacts',
        draft: false,
        data: {
          fullName: 'Fan Legítimo',
          email: 'fan@correo.com',
          subjectType: 'other',
          message: 'Mensaje de felicitación por el último lanzamiento.',
        },
        overrideAccess: false,
        user: undefined,
      });

      expect(contact).toBeDefined();
      expect(contact.id).toBeDefined();

      // Para el usuario anónimo, el campo 'status' no es devuelto (read protegido)
      expect(contact.status).toBeUndefined();

      // En la base de datos (contexto admin), el status interno debe ser 'new'
      const dbDoc = await payload.findByID({
        collection: 'contacts',
        id: contact.id,
        overrideAccess: true,
      });
      expect(dbDoc.status).toBe('new');
    });

    it('debe rechazar contactos que intenten inyectar status directamente sin autenticación', async () => {
      resetRateLimits();
      // Un usuario anónimo intenta marcar un mensaje como 'archived'
      const contact = await payload.create({
        collection: 'contacts',
        draft: false,
        data: {
          fullName: 'Atacante Status',
          email: 'hacker@correo.com',
          subjectType: 'other',
          message: 'Intentando alterar el estado interno a archivado.',
          status: 'archived',
        },
        overrideAccess: false,
        user: undefined,
      });

      // El campo status tiene create: ({ user }) => Boolean(user)
      // Por tanto, la inyección es ignorada y en base de datos debe ser 'new'
      const dbDoc = await payload.findByID({
        collection: 'contacts',
        id: contact.id,
        overrideAccess: true,
      });
      expect(dbDoc.status).toBe('new');
    });

    it('debe rechazar envíos con el campo Honeypot completado (Detección Anti-Spam)', async () => {
      resetRateLimits();
      await expect(
        payload.create({
          collection: 'contacts',
          draft: false,
          data: {
            fullName: 'Bot Automatizado',
            email: 'bot@spam.com',
            subjectType: 'other',
            message: 'Texto de spam con enlaces maliciosos.',
            websiteHoneypot: 'http://spam-link.com',
          },
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow(/actividad sospechosa/i);
    });

    it('debe rechazar envíos que violen los límites de longitud mínima y máxima', async () => {
      resetRateLimits();
      // Mensaje demasiado corto (< 10 caracteres)
      await expect(
        payload.create({
          collection: 'contacts',
          draft: false,
          data: {
            fullName: 'A', // nombre < 2 caracteres
            email: 'test@correo.com',
            subjectType: 'other',
            message: 'Hola', // < 10 caracteres
          },
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow();
    });

    it('debe activar el limitador de tasa (Rate Limiting) tras envíos repetidos excesivos', async () => {
      resetRateLimits();
      const floodEmail = 'flooder@correo.com';

      // 5 envíos permitidos
      for (let i = 0; i < 5; i++) {
        await payload.create({
          collection: 'contacts',
          draft: false,
          data: {
            fullName: `Envío Número ${i + 1}`,
            email: floodEmail,
            subjectType: 'other',
            message: `Mensaje válido de prueba número ${i + 1}.`,
          },
          overrideAccess: false,
          user: undefined,
        });
      }

      // El 6to envío consecutivo debe ser bloqueado por Rate Limiting
      await expect(
        payload.create({
          collection: 'contacts',
          draft: false,
          data: {
            fullName: 'Envío Bloqueado 6',
            email: floodEmail,
            subjectType: 'other',
            message: 'Este mensaje debe ser rechazado por exceso de tasa.',
          },
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow(/Demasiadas solicitudes/i);
    });
  });

  describe('2. Aislamiento Estricto de Borradores (Drafts)', () => {
    it('los usuarios anónimos solo deben ver documentos con _status: "published" en releases', async () => {
      const releases = await payload.find({
        collection: 'releases',
        overrideAccess: false,
        user: undefined,
      });

      expect(releases.docs.length).toBeGreaterThan(0);
      for (const rel of releases.docs) {
        expect(rel._status).toBe('published');
      }
    });

    it('los usuarios anónimos no deben poder consultar un borrador confidencial', async () => {
      // Buscamos el ID del borrador creado en seed usando contexto de admin
      const allReleases = await payload.find({
        collection: 'releases',
        draft: true,
        where: {
          _status: {
            equals: 'draft',
          },
        },
      });

      if (allReleases.totalDocs > 0) {
        const draftId = allReleases.docs[0].id;

        // Intentar leer ese borrador sin autenticación debe fallar
        await expect(
          payload.findByID({
            collection: 'releases',
            id: draftId,
            overrideAccess: false,
            user: undefined,
          })
        ).rejects.toThrow();
      }
    });
  });

  describe('3. Protección de Escritura no Autorizada', () => {
    it('debe impedir que usuarios anónimos creen o modifiquen lanzamientos (Releases)', async () => {
      await expect(
        payload.create({
          collection: 'releases',
          draft: false,
          data: {
            title: 'Lanzamiento No Autorizado',
            slug: 'lanzamiento-no-autorizado',
            type: 'single',
            releaseDate: new Date().toISOString(),
            coverImage: 1,
          },
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow();
    });

    it('debe impedir que usuarios anónimos creen o modifiquen artículos (Articles)', async () => {
      await expect(
        payload.create({
          collection: 'articles',
          draft: false,
          data: {
            title: 'Artículo No Autorizado',
            slug: 'articulo-no-autorizado',
            category: 'news',
            excerpt: 'Intento no autorizado de publicar noticias falsas.',
            content: {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                children: [],
                direction: null,
              },
            },
            heroImage: 1,
          },
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow();
    });
  });

  describe('4. Protección de Globals (ArtistProfile & SiteSettings)', () => {
    it('debe permitir la lectura pública del perfil del artista', async () => {
      const profile = await payload.findGlobal({
        slug: 'artist-profile',
        overrideAccess: false,
        user: undefined,
      });

      expect(profile).toBeDefined();
      expect(profile.stageName).toBe('Dany Glock');
    });

    it('debe rechazar modificaciones anónimas en los Globals', async () => {
      await expect(
        payload.updateGlobal({
          slug: 'artist-profile',
          data: {
            stageName: 'Nombre Adulterado',
          },
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow();
    });
  });

  describe('5. Gestión de Usuarios y Prevención de Escalación de Privilegios', () => {
    it('debe impedir que usuarios anónimos listen o consulten usuarios', async () => {
      await expect(
        payload.find({
          collection: 'users',
          overrideAccess: false,
          user: undefined,
        })
      ).rejects.toThrow();
    });

    it('debe impedir que un usuario no administrador cree nuevos usuarios administradores', async () => {
      const mockEditorUser: User = {
        id: 999,
        email: 'editor@danyglock.com',
        role: 'editor',
        name: 'Editor Mock',
        collection: 'users',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await expect(
        payload.create({
          collection: 'users',
          data: {
            name: 'Nuevo Admin Creado por Editor',
            email: 'malicious-admin@danyglock.com',
            password: 'SecurePassword123!',
            role: 'admin',
          },
          overrideAccess: false,
          user: mockEditorUser,
        })
      ).rejects.toThrow();
    });
  });
});
