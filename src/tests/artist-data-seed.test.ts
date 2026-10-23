import { describe, it, expect, beforeAll } from 'vitest';
import config from '@/payload.config';
import { getPayload, type Payload } from 'payload';
import type { Release, Track, Video, Event } from '@/payload-types';

describe('Artist Data Seed, Idempotency & Public Access Tests (Misión 006-A.1)', () => {
  let payload: Payload;

  beforeAll(async () => {
    payload = await getPayload({ config });
  });

  describe('1. Verificación de Lanzamientos (Releases)', () => {
    it('debe contener los 4 lanzamientos verificados como publicados', async () => {
      const published = await payload.find({
        collection: 'releases',
        where: {
          _status: { equals: 'published' },
        },
      });

      const slugs = published.docs.map((r) => r.slug);
      expect(slugs).toContain('sig-sauer');
      expect(slugs).toContain('so-fresh-so-clean');
      expect(slugs).toContain('cicatrices');
      expect(slugs).toContain('exceso');

      // Verificar rol de artista invitado en EXCESO
      const exceso = published.docs.find((r) => r.slug === 'exceso') as Release;
      expect(exceso).toBeDefined();
      expect(exceso.artistRole).toBe('featured');
      expect(exceso.verification?.status).toBe('verified');

      // Verificar rol de artista principal en SIG Sauer
      const sigSauer = published.docs.find((r) => r.slug === 'sig-sauer') as Release;
      expect(sigSauer).toBeDefined();
      expect(sigSauer.artistRole).toBe('main');
      expect(sigSauer.verification?.status).toBe('verified');
    });

    it('debe mantener SIG Sauer (Remix) estrictamente en borrador', async () => {
      // Buscar con draft: true
      const allReleases = await payload.find({
        collection: 'releases',
        where: {
          slug: { equals: 'sig-sauer-remix' },
        },
        draft: true,
      });

      expect(allReleases.totalDocs).toBe(1);
      const remix = allReleases.docs[0] as Release;
      expect(remix._status).toBe('draft');
      expect(remix.verification?.status).toBe('to_confirm');

      // Consulta pública anónima (draft: false) NO debe devolver el remix
      const publicQuery = await payload.find({
        collection: 'releases',
        where: {
          slug: { equals: 'sig-sauer-remix' },
        },
        overrideAccess: false,
        user: undefined,
      });

      expect(publicQuery.totalDocs).toBe(0);
    });
  });

  describe('2. Verificación de Pistas (Tracks) y Relaciones', () => {
    it('debe contener las 5 pistas sembradas con metadata y relación válida al lanzamiento', async () => {
      const tracks = await payload.find({
        collection: 'tracks',
        limit: 10,
      });

      expect(tracks.totalDocs).toBeGreaterThanOrEqual(5);

      const titles = tracks.docs.map((t) => t.title);
      expect(titles).toContain('SIG Sauer');
      expect(titles).toContain('SO FRESH, SO CLEAN');
      expect(titles).toContain('Cicatrices (feat. Maick Records)');
      expect(titles).toContain('EXCESO');
      expect(titles).toContain('SIG Sauer (Remix)');

      // Validar relación de cada track con su release
      for (const track of tracks.docs as Track[]) {
        if (['SIG Sauer', 'SO FRESH, SO CLEAN', 'Cicatrices (feat. Maick Records)', 'EXCESO'].includes(track.title)) {
          expect(track.release).toBeDefined();
          expect(track.verification?.status).toBe('verified');
        }
      }
    });
  });

  describe('3. Verificación de Videos Oficiales y Formatos', () => {
    it('debe contener los 6 videos de YouTube sembrados con su ID de 11 caracteres', async () => {
      const videos = await payload.find({
        collection: 'videos',
        limit: 10,
      });

      expect(videos.totalDocs).toBeGreaterThanOrEqual(6);

      const ids = videos.docs.map((v) => v.youtubeId);
      expect(ids).toContain('kcac_CIFJ7k'); // SIG Sauer Video Oficial
      expect(ids).toContain('SKgil-Dd1_M'); // SIG Sauer Trailer
      expect(ids).toContain('N3REsYJtfn4'); // SIG Sauer Remix Trailer
      expect(ids).toContain('4BzpqeraFjc'); // SIG Sauer Remix
      expect(ids).toContain('hvoy-jQNUnc'); // SO FRESH, SO CLEAN
      expect(ids).toContain('DuU5yoDscxs'); // CICATRICES

      // Verificar tipos de video
      const trailer = videos.docs.find((v) => v.youtubeId === 'SKgil-Dd1_M') as Video;
      expect(trailer.type).toBe('trailer');

      const officialMv = videos.docs.find((v) => v.youtubeId === 'kcac_CIFJ7k') as Video;
      expect(officialMv.type).toBe('official_music_video');
      expect(officialMv.verification?.status).toBe('verified');
    });
  });

  describe('4. Verificación de Globals: ArtistProfile y SiteSettings', () => {
    it('debe configurar ArtistProfile con origen Pasto/Colombia y biografía editorial en borrador', async () => {
      const profile = await payload.findGlobal({
        slug: 'artist-profile',
      });

      expect(profile.stageName).toBe('Dany Glock');
      expect(profile.origin?.city).toBe('Pasto');
      expect(profile.origin?.country).toBe('Colombia');
      expect(profile.bioStatus).toBe('editorial_draft');
      expect(profile.verification?.status).toBe('editorial_proposal');
      expect(profile.translations?.en?.status).toBe('draft_pending_review');
    });

    it('debe configurar SiteSettings con canales oficiales verificados y sin correos inventados', async () => {
      const settings = await payload.findGlobal({
        slug: 'site-settings',
      });

      expect(settings.socialLinks?.instagram).toBe('https://www.instagram.com/danyglock_/');
      expect(settings.socialLinks?.youtube).toBe('https://www.youtube.com/@danyglock');
      expect(settings.socialLinks?.youtubeChannelId).toBe('UCf-4AJMV8QZz1jj4OVBzaxg');
      expect(settings.socialLinks?.appleMusic).toBe('https://music.apple.com/us/artist/dany-glock/1739565666');

      // No se inventa Spotify ni contactos de booking
      expect(settings.socialLinks?.spotify || '').toBe('');
      expect(settings.contactEmails?.booking || '').toBe('');
      expect(settings.verification?.status).toBe('verified');
    });
  });

  describe('5. Verificación de Shows: Pasto Vive Flow (Borrador)', () => {
    it('debe mantener Pasto Vive Flow en estado de borrador no visible para público', async () => {
      const allEvents = await payload.find({
        collection: 'events',
        where: {
          slug: { equals: 'pasto-vive-flow-2026' },
        },
        draft: true,
      });

      expect(allEvents.totalDocs).toBe(1);
      const event = allEvents.docs[0] as Event;
      expect(event._status).toBe('draft');
      expect(event.verification?.status).toBe('to_confirm');
      expect(event.city).toBe('Pasto');
      expect(event.country).toBe('Colombia');

      // Consulta pública anónima NO debe devolver el evento en borrador
      const publicEvents = await payload.find({
        collection: 'events',
        where: {
          slug: { equals: 'pasto-vive-flow-2026' },
        },
        overrideAccess: false,
        user: undefined,
      });

      expect(publicEvents.totalDocs).toBe(0);
    });
  });
});
