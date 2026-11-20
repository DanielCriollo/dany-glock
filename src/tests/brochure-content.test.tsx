import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import config from '@/payload.config';
import { getPayload, type Payload } from 'payload';
import type { Booking, CareerHighlight, Media } from '@/payload-types';
import {
  getBookingData,
  getPressKitData,
  getPublishedCareerHighlights,
  getShowGallery,
} from '@/lib/cms-queries';
import BiografiaPage from '@/app/(public)/biografia/page';
import BookingPage from '@/app/(public)/booking/page';
import EpkPage from '@/app/(public)/epk/page';
import { CareerHighlights } from '@/components/career/CareerHighlights';
import { ShowBooking } from '@/components/booking/ShowBooking';
import { ShowGallery } from '@/components/gallery/ShowGallery';

/**
 * Misión 006-B.2 — Migración del brochure oficial.
 * Requiere la BD sembrada con `seed-artist-data.ts` y `seed-brochure-content.ts`.
 */

let payload: Payload;

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterEach(() => {
  cleanup();
});

describe('Misión 006-B.2 — Brochure: datos, privacidad y vistas públicas', () => {
  describe('1. Trayectoria (career-highlights)', () => {
    it('solo devuelve hitos publicados: colaboraciones verificadas sí, afirmaciones del brochure no', async () => {
      const highlights = await getPublishedCareerHighlights();
      const slugs = highlights.map((h) => h.slug);

      expect(slugs).toContain('debut-sig-sauer');
      expect(slugs).toContain('colaboracion-sig-sauer-remix');
      expect(slugs).toContain('colaboracion-cicatrices');
      expect(slugs).not.toContain('artista-del-ano-premios-kiwid-line');
      expect(slugs).not.toContain('escenarios-compartidos');
      expect(slugs).not.toContain('show-inpec-pasto');
      expect(slugs).not.toContain('colaboracion-pistolon');
      expect(highlights.every((h) => h._status === 'published')).toBe(true);
    });

    it('un visitante anónimo no puede leer borradores ni con draft: true', async () => {
      const res = await payload.find({
        collection: 'career-highlights',
        where: { slug: { equals: 'artista-del-ano-premios-kiwid-line' } },
        draft: true,
        overrideAccess: false,
      });
      expect(res.totalDocs).toBe(0);
    });

    it('las afirmaciones del brochure existen como borrador pendiente de confirmación', async () => {
      const res = await payload.find({
        collection: 'career-highlights',
        where: { sourceType: { equals: 'artist_brochure' } },
        draft: true,
      });
      expect(res.totalDocs).toBeGreaterThanOrEqual(4);
      for (const doc of res.docs) {
        expect(doc.verification?.status).toBe('to_confirm');
      }
    });
  });

  describe('2. Shows & Booking: privacidad del contacto de management', () => {
    let original: Booking['management'];

    beforeAll(async () => {
      const current = await payload.findGlobal({ slug: 'booking' });
      original = current.management;
    });

    afterAll(async () => {
      await payload.updateGlobal({ slug: 'booking', data: { management: original ?? {} } });
    });

    it('no expone nombre, correo ni WhatsApp mientras publishContact = false', async () => {
      await payload.updateGlobal({
        slug: 'booking',
        data: {
          management: {
            publishContact: false,
            name: 'Contacto de Prueba',
            role: 'Manager',
            email: 'prueba@example.com',
            whatsapp: '+57 000 000 0000',
          },
        },
      });
      const publicBooking = await getBookingData();
      expect(publicBooking?.management?.name).toBeUndefined();
      expect(publicBooking?.management?.email).toBeUndefined();
      expect(publicBooking?.management?.whatsapp).toBeUndefined();
      expect(publicBooking?.management?.sourceNote).toBeUndefined();
    });

    it('expone el contacto solo cuando management autoriza su publicación', async () => {
      await payload.updateGlobal({
        slug: 'booking',
        data: { management: { publishContact: true, name: 'Contacto de Prueba', email: 'prueba@example.com' } },
      });
      const publicBooking = await getBookingData();
      expect(publicBooking?.management?.name).toBe('Contacto de Prueba');
      expect(publicBooking?.management?.email).toBe('prueba@example.com');
      // Las notas internas nunca son públicas
      expect(publicBooking?.management?.sourceNote).toBeUndefined();
    });

    it('las especificaciones del show se marcan como declaradas', async () => {
      const booking = await getBookingData();
      expect(booking?.specsStatus).toBe('declared');
      expect(booking?.specs?.duration).toBe('30–45 minutos');
      expect(booking?.specs?.format).toBe('DJ set + performance en vivo');
      expect(booking?.eventTypes?.map((t) => t.title)).toEqual([
        'Discotecas',
        'Festivales urbanos',
        'Eventos corporativos',
      ]);
    });
  });

  describe('3. Archivo visual (galería de shows)', () => {
    let testMediaId: number | null = null;

    beforeAll(async () => {
      const res = await payload.find({
        collection: 'media',
        where: { category: { equals: 'event_flyer' } },
        limit: 1,
      });
      testMediaId = res.docs[0] ? Number(res.docs[0].id) : null;
    });

    afterAll(async () => {
      if (testMediaId) {
        await payload.update({
          collection: 'media',
          id: testMediaId,
          data: { gallery: { visible: false, rightsStatus: 'pending' } },
        });
      }
    });

    it('no publica flyers visibles cuyos derechos siguen pendientes', async () => {
      if (!testMediaId) return;
      await payload.update({
        collection: 'media',
        id: testMediaId,
        data: { gallery: { visible: true, rightsStatus: 'pending' } },
      });
      const gallery = await getShowGallery();
      expect(gallery.map((m) => m.id)).not.toContain(testMediaId);
    });

    it('publica el flyer cuando está visible y con derechos aprobados', async () => {
      if (!testMediaId) return;
      await payload.update({
        collection: 'media',
        id: testMediaId,
        data: { gallery: { visible: true, rightsStatus: 'approved' } },
      });
      const gallery = await getShowGallery();
      expect(gallery.map((m) => m.id)).toContain(testMediaId);
    });
  });

  describe('4. Componentes', () => {
    const base = {
      updatedAt: '2026-10-23T00:00:00.000Z',
      createdAt: '2026-10-23T00:00:00.000Z',
      _status: 'published' as const,
    };

    it('CareerHighlights separa colaboraciones de escenarios compartidos y rotula la fuente', () => {
      const items: CareerHighlight[] = [
        { ...base, id: 1, title: 'Colaboración verificada', slug: 'a', category: 'collaboration', sourceType: 'platform', verification: { status: 'verified' } },
        { ...base, id: 2, title: 'Cartel compartido', slug: 'b', category: 'shared_stage', sourceType: 'artist_brochure', people: [{ name: 'Artista X', origin: 'Ecuador' }], verification: { status: 'to_confirm' } },
      ];
      render(<CareerHighlights highlights={items} />);
      expect(screen.getByText('Colaboraciones musicales')).toBeDefined();
      expect(screen.getByText('Escenarios compartidos')).toBeDefined();
      expect(screen.getByText(/no implica una colaboración musical/i)).toBeDefined();
      expect(screen.getByText('Declarado por el equipo del artista')).toBeDefined();
      expect(screen.queryAllByText('Fuente: plataforma oficial')).toHaveLength(0);
    });

    it('CareerHighlights no renderiza nada sin hitos', () => {
      const { container } = render(<CareerHighlights highlights={[]} />);
      expect(container.innerHTML).toBe('');
    });

    it('ShowBooking oculta management sin autorización y advierte especificaciones declaradas', () => {
      const booking = {
        id: 1,
        showTitle: 'Dany Glock en vivo',
        showDescription: 'Show de prueba',
        specsStatus: 'declared',
        specs: { duration: '30–45 minutos', includesDancers: true },
        management: { publishContact: false, name: 'Oculto' },
      } as Booking;
      const { container } = render(<ShowBooking booking={booking} />);
      expect(screen.getByText('30–45 minutos')).toBeDefined();
      expect(screen.getByText(/sujetas a confirmación/i)).toBeDefined();
      expect(container.innerHTML).not.toContain('Oculto');
    });

    it('ShowGallery muestra los datos transcritos del flyer', () => {
      const item = {
        id: 9,
        alt: 'Flyer de prueba',
        url: '/api/media/file/flyer.jpg',
        category: 'event_flyer',
        gallery: { eventLabel: 'Evento X', dateLabel: '22.NOV.24', venueLabel: 'Plaza Norte' },
        updatedAt: base.updatedAt,
        createdAt: base.createdAt,
      } as Media;
      render(<ShowGallery items={[item]} />);
      expect(screen.getByText('Evento X · 22.NOV.24 · Plaza Norte')).toBeDefined();
      expect(screen.getByAltText('Flyer de prueba')).toBeDefined();
    });
  });

  describe('5. Páginas públicas', () => {
    it('/biografia incorpora trayectoria verificada sin afirmaciones pendientes', async () => {
      const { container } = render(await BiografiaPage());
      const html = container.innerHTML;
      expect(html).toContain('Trayectoria y Colaboraciones');
      expect(html).toContain('Colaboraciones musicales');
      expect(html).toContain('Brak Johnz');
      expect(html).not.toContain('Kiwid');
      expect(html).not.toContain('Pistolón');
      expect(html).not.toContain('Ryan Castro');
      expect(html).not.toContain('INPEC');
    });

    it('/booking presenta el show, tipos de evento y cotización sin datos privados', async () => {
      const { container } = render(await BookingPage());
      const html = container.innerHTML;
      expect(screen.getByRole('heading', { level: 1, name: /Shows & Booking/i })).toBeDefined();
      expect(html).toContain('30–45 minutos');
      expect(html).toContain('Eventos corporativos');
      expect(html).toContain('Solicitud de cotización');
      expect(html).not.toContain('@gmail.com');
      expect(html).not.toMatch(/tarifa\s*:/i);
    });

    it('/epk permanece oculto (404) mientras el EPK no sea público', async () => {
      const pressKit = await getPressKitData();
      expect(pressKit?.isPublic).toBe(false);
      await expect(EpkPage()).rejects.toThrow();
    });
  });
});
