import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import {
  getArtistProfile,
  getSiteSettings,
  getPublishedReleases,
  getPublishedVideos,
  getPublishedEvents,
  getPublishedArticles,
} from '@/lib/cms-queries';
import HomePage from '@/app/(public)/page';
import BiografiaPage from '@/app/(public)/biografia/page';
import { VideoGallery } from '@/components/video/VideoGallery';
import { ContactForm } from '@/components/contact/ContactForm';
import { SiteFooter } from '@/components/layout/SiteFooter';

// Mock dialog HTML5 methods in JSDOM
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
  });
});

afterEach(() => {
  cleanup();
});

describe('Misión 006-B.1 — Public Cinematic Experience & CMS Integration Tests', () => {
  describe('1. Capa de Consultas Públicas del CMS (cms-queries.ts)', () => {
    it('obtiene el perfil real del artista desde ArtistProfile (Pasto, Colombia)', async () => {
      const profile = await getArtistProfile();
      expect(profile).not.toBeNull();
      expect(profile?.stageName).toBe('Dany Glock');
      expect(profile?.origin?.city).toBe('Pasto');
      expect(profile?.origin?.country).toBe('Colombia');
      expect(profile?.bioStatus).toBe('editorial_draft');
    });

    it('obtiene las configuraciones oficiales de SiteSettings sin correos inventados', async () => {
      const settings = await getSiteSettings();
      expect(settings).not.toBeNull();
      expect(settings?.socialLinks?.instagram).toContain('instagram.com/danyglock_');
      expect(settings?.socialLinks?.youtube).toContain('youtube.com/@danyglock');
      expect(settings?.socialLinks?.appleMusic).toContain('music.apple.com');
      // No debe haber correos inventados tipo booking@danyglock.com
      expect(settings?.contactEmails?.booking).toBeFalsy();
      expect(settings?.contactEmails?.press).toBeFalsy();
    });

    it('obtiene exclusivamente los lanzamientos publicados y excluye borradores', async () => {
      const releases = await getPublishedReleases();
      const slugs = releases.map((r) => r.slug);

      // Debe incluir los 4 lanzamientos publicados
      expect(slugs).toContain('sig-sauer');
      expect(slugs).toContain('so-fresh-so-clean');
      expect(slugs).toContain('cicatrices');
      expect(slugs).toContain('exceso');

      // Prohibido incluir el remix en borrador
      expect(slugs).not.toContain('sig-sauer-remix');

      // Verificar que EXCESO tiene rol 'featured'
      const exceso = releases.find((r) => r.slug === 'exceso');
      expect(exceso?.artistRole).toBe('featured');
    });

    it('obtiene la videografía oficial completa (6 videos publicados con youtubeId)', async () => {
      const videos = await getPublishedVideos();
      expect(videos.length).toBe(6);

      const youtubeIds = videos.map((v) => v.youtubeId);
      expect(youtubeIds).toContain('kcac_CIFJ7k'); // SIG Sauer
      expect(youtubeIds).toContain('SKgil-Dd1_M'); // SO FRESH, SO CLEAN
      expect(youtubeIds).toContain('N3REsYJtfn4'); // Cicatrices
      expect(youtubeIds).toContain('4BzpqeraFjc'); // EXCESO
      expect(youtubeIds).toContain('hvoy-jQNUnc'); // Los Mismos de Siempre
      expect(youtubeIds).toContain('DuU5yoDscxs'); // Mía

      // Todos deben tener duración formateada
      videos.forEach((v) => {
        expect(v.duration).toBeDefined();
        expect(typeof v.duration).toBe('string');
      });
    });

    it('retorna 0 eventos publicados respetando el estado de borrador del evento semilla', async () => {
      const events = await getPublishedEvents();
      expect(events.length).toBe(0);
    });

    it('retorna 0 artículos publicados evitando noticias o notas de prensa inventadas', async () => {
      const articles = await getPublishedArticles();
      expect(articles.length).toBe(0);
    });
  });

  describe('2. Renderizado de la Home Rediseñada (HomePage Server Component)', () => {
    let renderedHtml: string = '';

    beforeEach(async () => {
      const PageComponent = await HomePage();
      const { container } = render(PageComponent);
      renderedHtml = container.innerHTML;
    });

    it('renderiza la identidad oficial del artista DANY GLOCK y su origen en Pasto, Colombia', () => {
      expect(screen.getByRole('heading', { level: 1, name: /DANY GLOCK/i })).toBeDefined();
      expect(screen.getAllByText(/Pasto, Colombia/i).length).toBeGreaterThan(0);
    });

    it('NO contiene términos prohibidos ni nombres técnicos de desarrollo', () => {
      expect(renderedHtml).not.toContain('Artist Digital Experience');
      expect(renderedHtml).not.toContain('Dark Cinematic Editorial');
      expect(renderedHtml).not.toContain('Arte Oficial en Sincronización');
      expect(renderedHtml).not.toContain('Fase 005');
      expect(renderedHtml).not.toContain('Misión');
      expect(renderedHtml).not.toContain('Scaffold');
    });

    it('NO contiene referencias a Guatemala ni ciudades inventadas de Centroamérica', () => {
      expect(renderedHtml).not.toContain('Guatemala');
      expect(renderedHtml).not.toContain('Quetzaltenango');
      expect(renderedHtml).not.toContain('Centroamérica');
    });

    it('NO contiene correos electrónicos inventados de booking o prensa', () => {
      expect(renderedHtml).not.toContain('booking@danyglock.com');
      expect(renderedHtml).not.toContain('press@danyglock.com');
      expect(renderedHtml).not.toContain('mgmt@danyglock.com');
    });

    it('renderiza la sección Último Lanzamiento (Single Spotlight) con Cicatrices', () => {
      expect(screen.getByText(/Último Lanzamiento/i)).toBeDefined();
      expect(screen.getAllByRole('heading', { name: /Cicatrices/i }).length).toBeGreaterThan(0);
    });

    it('renderiza el catálogo oficial con distinción de artista principal e invitado', () => {
      expect(screen.getAllByText('SIG Sauer').length).toBeGreaterThan(0);
      expect(screen.getAllByText('SO FRESH, SO CLEAN').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/EXCESO/i).length).toBeGreaterThan(0);

      // Distinción de artista invitado en EXCESO
      expect(screen.getByText('Artista Invitado')).toBeDefined();

      // Exclusión estricta de remix en borrador
      expect(screen.queryByText('SIG Sauer (Remix)')).toBeNull();
    });

    it('renderiza la sección editorial El Artista — Biografía con enlace a /biografia', () => {
      expect(screen.getAllByText(/El Artista/i).length).toBeGreaterThan(0);
      const bioLink = screen.getByRole('link', { name: /Leer Biografía Completa/i });
      expect(bioLink).toBeDefined();
      expect(bioLink.getAttribute('href')).toBe('/biografia');
    });

    it('muestra el estado vacío editorial de Shows sin inventar fechas ni giras', () => {
      expect(screen.getByText(/Nuevas presentaciones en vivo por anunciar/i)).toBeDefined();
      expect(screen.queryByText('Guatemala City')).toBeNull();
      expect(screen.queryByText('Teatro Bellas Artes')).toBeNull();
    });
  });

  describe('3. Renderizado de la Ruta Editorial /biografia', () => {
    it('renderiza la página de biografía con narrativa verificada sin inventar hitos', async () => {
      const PageComponent = await BiografiaPage();
      const { container } = render(PageComponent);
      const html = container.innerHTML;

      expect(screen.getByRole('heading', { level: 1, name: /Dany Glock/i })).toBeDefined();
      expect(html).toContain('Pasto, Nariño, Colombia');
      expect(html).toContain('Dany Glock');
      // No debe contener premios inventados
      expect(html).not.toContain('Grammy');
      expect(html).not.toContain('Billboard');
      expect(html).not.toContain('Gira Internacional');
      // Debe tener enlace de retorno al inicio
      expect(screen.getByRole('link', { name: /Volver a la Página Principal/i })).toBeDefined();
    });
  });

  describe('4. Componentes Interactivos Públicos', () => {
    it('VideoGallery renderiza las tarjetas de video con badges actualizados', () => {
      const mockVideos = [
        {
          id: 1,
          title: 'SIG Sauer (Official Video)',
          slug: 'sig-sauer-video-oficial',
          type: 'official_music_video' as const,
          youtubeUrl: 'https://www.youtube.com/watch?v=kcac_CIFJ7k',
          youtubeId: 'kcac_CIFJ7k',
          duration: '3:12',
          featured: true,
          updatedAt: '2026-10-23T00:00:00Z',
          createdAt: '2026-10-23T00:00:00Z',
        },
      ];

      render(<VideoGallery videos={mockVideos} />);
      expect(screen.getByText('SIG Sauer (Official Video)')).toBeDefined();
      expect(screen.getByText('3:12')).toBeDefined();
      expect(screen.getByText('Videoclip Oficial')).toBeDefined();
      expect(screen.getByRole('button', { name: /Reproducir video: SIG Sauer/i })).toBeDefined();
    });

    it('ContactForm renderiza campos requeridos y el campo honeypot oculto contra spam', () => {
      const { container } = render(<ContactForm />);

      expect(screen.getByLabelText(/Nombre Completo/i)).toBeDefined();
      expect(screen.getByLabelText(/Correo Electrónico/i)).toBeDefined();
      expect(screen.getByLabelText(/Motivo del Contacto/i)).toBeDefined();
      expect(screen.getByLabelText(/Detalle de la Solicitud/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Enviar Solicitud Directa/i })).toBeDefined();

      // Campo honeypot anti-spam
      const honeypotInput = container.querySelector('input[name="websiteHoneypot"]');
      expect(honeypotInput).not.toBeNull();
    });

    it('SiteFooter simplificado no expone /admin públicamente ni correos inventados', async () => {
      const FooterComponent = await SiteFooter();
      const { container } = render(FooterComponent);
      const footerHtml = container.innerHTML;

      expect(footerHtml).not.toContain('href="/admin"');
      expect(footerHtml).not.toContain('Panel Administrativo');
      expect(footerHtml).not.toContain('booking@danyglock.com');
      expect(footerHtml).not.toContain('press@danyglock.com');
      expect(footerHtml).not.toContain('Guatemala');
    });
  });
});
