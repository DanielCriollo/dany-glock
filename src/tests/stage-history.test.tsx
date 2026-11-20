import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import config from '@/payload.config';
import { getPayload, type Payload } from 'payload';
import type { Event, Media } from '@/payload-types';
import { STAGE_HISTORY } from '@/data/stage-history';
import { FLYERS_DIR, importStageHistory, resolveFlyersDir } from '@/scripts/import-stage-history';
import { repairStageHistoryDrafts } from '@/scripts/repair-stage-history-drafts';
import { artistRoleLabel, eventDateLabel, publicFlyer, toStageHistoryItem } from '@/lib/stage-history';
import { getPublishedEvents, getStageHistory } from '@/lib/cms-queries';
import { CONTENT_DEPENDENCIES, PUBLIC_PATHS } from '@/lib/revalidate';
import { getMenuItems } from '@/components/layout/EditorialMenu';
import { StageHistoryGallery } from '@/components/stage/StageHistoryGallery';
import EscenariosPage from '@/app/(public)/escenarios/page';

/**
 * Misión 006-C — Trayectoria en escenarios (archivo de flyers).
 * Requiere la BD local con la migración 20261120_010900 y `import-stage-history.ts` ejecutado.
 */

const PHONE = /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/;

let payload: Payload;

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterEach(() => cleanup());

describe('Misión 006-C — Trayectoria en escenarios', () => {
  describe('1. Inventario de flyers y privacidad en Git', () => {
    it('tiene 18 eventos con slugs y nombres de archivo seguros (y verifica disco si la carpeta privada existe)', () => {
      expect(STAGE_HISTORY).toHaveLength(18);
      expect(new Set(STAGE_HISTORY.map((e) => e.slug)).size).toBe(18);
      expect(new Set(STAGE_HISTORY.map((e) => e.file)).size).toBe(18);
      for (const e of STAGE_HISTORY) {
        expect(e.file).toMatch(/^[a-z0-9-]+\.jpg$/);
      }
      if (fs.existsSync(FLYERS_DIR)) {
        for (const e of STAGE_HISTORY) {
          expect(fs.existsSync(path.resolve(FLYERS_DIR, e.file)), e.file).toBe(true);
        }
      }
    });

    it('excluye los flyers originales y copias privadas del versionado Git (.gitignore)', () => {
      const gitignore = fs.readFileSync(path.resolve('.gitignore'), 'utf8');
      expect(gitignore).toMatch(/^\/flyers\/$/m);
      expect(gitignore).toMatch(/^storage\/flyers\/$/m);
    });

    it('el importador soporta ruta privada externa y funciona sin depender de archivos en Git', async () => {
      expect(resolveFlyersDir(['node', 'script', '--dir', './custom-flyers'], {})).toBe(
        path.resolve('./custom-flyers'),
      );
      expect(resolveFlyersDir(['node', 'script', '--dir=./inline-flyers'], {})).toBe(
        path.resolve('./inline-flyers'),
      );
      expect(resolveFlyersDir(['node', 'script'], { STAGE_FLYERS_DIR: './env-flyers' })).toBe(
        path.resolve('./env-flyers'),
      );

      const missingDir = path.join(os.tmpdir(), 'dany-glock-nonexistent-flyers-dir');
      const res = await importStageHistory({ flyersDir: missingDir, dryRun: true });
      expect(res.missingDir).toBe(true);
      expect(res.created).toBe(0);
      expect(res.missing).toBe(18);
    });

    it('no publica teléfonos ni datos de contacto en los campos públicos', () => {
      for (const e of STAGE_HISTORY) {
        const publicText = [e.eventName, e.summary, e.venue, e.city, e.dateLabel, e.alt, e.credit].join(' ');
        expect(publicText, e.slug).not.toMatch(PHONE);
        expect(publicText.toLowerCase(), e.slug).not.toMatch(/whatsapp|nequi|cra\.?\s|calle\s\d/);
      }
    });

    it('solo guarda fecha exacta cuando el año aparece en el flyer', () => {
      for (const e of STAGE_HISTORY.filter((x) => x.date)) {
        const year = new Date(e.date!).getUTCFullYear();
        expect(e.dateLabel, e.slug).toContain(String(year));
      }
    });
  });

  describe('2. Utilidades', () => {
    const base = {
      id: 1,
      slug: 'x',
      eventName: 'Evento',
      country: 'Colombia',
      updatedAt: '',
      createdAt: '',
    } as unknown as Event;
    const media = { id: 9, url: '/api/media/file/f.jpg', alt: 'Flyer', width: 900, height: 1600 } as Media;

    it('oculta el flyer mientras los derechos no estén aprobados', () => {
      expect(publicFlyer({ posterImage: media, usageRights: { status: 'pending' } })).toBeNull();
      expect(publicFlyer({ posterImage: media, usageRights: { status: 'third_party_consent' } })).toBeNull();
      expect(publicFlyer({ posterImage: media, usageRights: { status: 'approved' } })).toMatchObject({ width: 900 });
    });

    it('prefiere la fecha transcrita y no inventa años', () => {
      expect(eventDateLabel({ dateLabel: 'Sábado 15 de junio', date: null })).toBe('Sábado 15 de junio');
      expect(eventDateLabel({ dateLabel: null, date: null })).toBeNull();
      expect(eventDateLabel({ dateLabel: null, date: '2024-11-22T17:00:00.000Z' })).toContain('2024');
    });

    it('la vista pública no incluye notas internas ni fuente', () => {
      const item = toStageHistoryItem({
        ...base,
        artistRole: 'opening_act',
        verification: { status: 'verified', notes: 'secreto' },
        usageRights: { status: 'pending', source: 'WhatsApp', credit: 'Diseño X' },
        posterImage: media,
      });
      expect(JSON.stringify(item)).not.toMatch(/secreto|WhatsApp/);
      expect(item.flyer).toBeNull();
      expect(item.credit).toBeNull();
      expect(item.role).toBe('Telonero oficial');
      expect(artistRoleLabel('unspecified')).toBeNull();
    });
  });

  describe('3. Datos locales: todo en borrador', () => {
    it('los 18 eventos importados existen en borrador en tabla principal e historial, sin duplicados', async () => {
      const res = await payload.find({
        collection: 'events',
        where: { slug: { in: STAGE_HISTORY.map((e) => e.slug) } },
        limit: 100,
        depth: 0,
      });
      expect(res.totalDocs).toBe(18);
      expect(res.docs.every((d) => d._status === 'draft')).toBe(true);
      expect(res.docs.every((d) => d.listing === 'archive')).toBe(true);
      expect(res.docs.every((d) => d.posterImage)).toBe(true);

      const mainTable = await payload.db.drizzle.execute(
        `SELECT count(*)::int AS published_count FROM events WHERE listing = 'archive' AND _status = 'published';`,
      );
      expect((mainTable.rows[0] as { published_count: number }).published_count).toBe(0);

      const latestVersions = await payload.db.drizzle.execute(
        `SELECT count(*)::int AS published_latest FROM _events_v WHERE version_listing = 'archive' AND latest = true AND version__status = 'published';`,
      );
      expect((latestVersions.rows[0] as { published_latest: number }).published_latest).toBe(0);
    });

    it('un visitante anónimo no ve eventos del archivo ni sus flyers', async () => {
      expect(await getStageHistory()).toEqual([]);
      const anonEvents = await payload.find({ collection: 'events', overrideAccess: false, draft: true, limit: 100 });
      expect(anonEvents.docs.filter((d) => d.listing === 'archive')).toHaveLength(0);
      const anonMedia = await payload.find({
        collection: 'media',
        where: { filename: { like: 'escenario-' } },
        overrideAccess: false,
        limit: 100,
      });
      expect(anonMedia.totalDocs).toBe(0);
    });

    it('/escenarios responde 404 mientras no haya eventos publicados', async () => {
      await expect(EscenariosPage()).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
    });

    it('la agenda de próximos conciertos excluye el archivo', async () => {
      const upcoming = await getPublishedEvents();
      expect(upcoming.every((e) => e.listing !== 'archive')).toBe(true);
    });
  });

  describe('4. Publicación y autorización del flyer', () => {
    let original: Event;
    let mediaId: number;

    beforeAll(async () => {
      const res = await payload.find({ collection: 'events', where: { slug: { equals: 'dany-glock-club-xilon' } }, depth: 0 });
      original = res.docs[0] as Event;
      mediaId = original.posterImage as number;
    });

    afterAll(async () => {
      await payload.update({
        collection: 'events',
        id: original.id,
        data: {
          _status: 'draft',
          verification: original.verification,
          usageRights: original.usageRights,
        },
      });
      const media = (await payload.findByID({ collection: 'media', id: mediaId, depth: 0 })) as Media;
      expect(media.gallery?.rightsStatus).toBe('pending');
    });

    it('aprobar derechos en un evento en borrador NO expone el flyer a visitantes anónimos', async () => {
      await payload.update({
        collection: 'events',
        id: original.id,
        data: { _status: 'draft', usageRights: { ...original.usageRights, status: 'approved' } },
      });
      const anonMedia = await payload.find({
        collection: 'media',
        where: { id: { equals: mediaId } },
        overrideAccess: false,
      });
      expect(anonMedia.totalDocs).toBe(0);
      await payload.update({
        collection: 'events',
        id: original.id,
        data: { _status: 'draft', usageRights: { ...original.usageRights, status: 'pending' } },
      });
    });

    it('un evento publicado y verificado aparece sin flyer si los derechos siguen pendientes y oculta campos internos', async () => {
      await payload.update({
        collection: 'events',
        id: original.id,
        data: {
          _status: 'published',
          verification: { ...original.verification, status: 'verified' },
          usageRights: { ...original.usageRights, status: 'pending', approvalNote: 'Nota interna privada' },
        },
      });
      const items = await getStageHistory();
      const item = items.find((i) => i.slug === 'dany-glock-club-xilon');
      expect(item).toBeDefined();
      expect(item?.flyer).toBeNull();
      expect(item?.dateLabel).toBe('Sábado 15 de junio');

      const anonEvent = await payload.find({
        collection: 'events',
        where: { id: { equals: original.id } },
        overrideAccess: false,
        depth: 1,
      });
      expect(anonEvent.totalDocs).toBe(1);
      expect(anonEvent.docs[0].usageRights?.source).toBeUndefined();
      expect(anonEvent.docs[0].usageRights?.approvalNote).toBeUndefined();
      expect(anonEvent.docs[0].verification?.notes).toBeUndefined();
    });

    it('al aprobar los derechos en un evento publicado se muestra el flyer y el archivo pasa a ser legible', async () => {
      await payload.update({
        collection: 'events',
        id: original.id,
        data: { _status: 'published', usageRights: { ...original.usageRights, status: 'approved' } },
      });
      const item = (await getStageHistory()).find((i) => i.slug === 'dany-glock-club-xilon');
      expect(item?.flyer?.url).toContain('escenario-club-xilon');
      const anonMedia = await payload.find({
        collection: 'media',
        where: { id: { equals: mediaId } },
        overrideAccess: false,
      });
      expect(anonMedia.totalDocs).toBe(1);
    });

    it('despublicar un evento con derechos aprobados vuelve a bloquear el flyer inmediatamente', async () => {
      await payload.update({
        collection: 'events',
        id: original.id,
        data: { _status: 'draft' },
      });
      const anonMedia = await payload.find({
        collection: 'media',
        where: { id: { equals: mediaId } },
        overrideAccess: false,
      });
      expect(anonMedia.totalDocs).toBe(0);
    });

    it('retirar la aprobación vuelve a bloquear el archivo', async () => {
      await payload.update({
        collection: 'events',
        id: original.id,
        data: { _status: 'published', usageRights: { ...original.usageRights, status: 'approved' } },
      });
      await payload.update({
        collection: 'events',
        id: original.id,
        data: { _status: 'published', usageRights: { ...original.usageRights, status: 'rejected' } },
      });
      const anonMedia = await payload.find({
        collection: 'media',
        where: { id: { equals: mediaId } },
        overrideAccess: false,
      });
      expect(anonMedia.totalDocs).toBe(0);
    });
  });

  describe('5. Navegación, revalidación y componentes', () => {
    it('el menú solo enlaza la trayectoria cuando hay eventos publicados', () => {
      expect(getMenuItems(false).map((i) => i.href)).not.toContain('/escenarios');
      const withArchive = getMenuItems(true);
      expect(withArchive.find((i) => i.href === '/escenarios')?.index).toBe('05');
      expect(withArchive.map((i) => i.index)).toEqual(['01', '02', '03', '04', '05', '06', '07']);
    });

    it('publicar o retirar eventos revalida todo el sitio (agenda, archivo y menú)', () => {
      expect(CONTENT_DEPENDENCIES.events).toBe('*');
      expect(PUBLIC_PATHS).toContain('/escenarios');
    });

    it('la galería muestra fichas tipográficas sin flyer y botones de ampliación con flyer', () => {
      render(
        <StageHistoryGallery
          items={[
            { id: 1, slug: 'a', title: 'Con flyer', dateLabel: '25 de abril', place: 'Centro de Eventos Andino', role: 'Telonero oficial', summary: null, credit: null, flyer: { url: '/api/media/file/a.jpg', alt: 'Flyer A', width: 900, height: 1600 } },
            { id: 2, slug: 'b', title: 'Sin flyer', dateLabel: null, place: null, role: null, summary: null, credit: null, flyer: null },
          ]}
        />,
      );
      expect(screen.getByRole('button', { name: /Ampliar flyer: Con flyer/ })).toBeTruthy();
      expect(screen.getByText('Telonero oficial')).toBeTruthy();
      expect(screen.queryByRole('button', { name: /Sin flyer/ })).toBeNull();
      expect(screen.getAllByText('Sin flyer').length).toBeGreaterThan(0);
    });
  });

  describe('6. Reparación de estados editoriales (M006-C.4)', () => {
    let archiveEvents: Event[] = [];
    let protectedEv: Event;
    let protectedBeforeUpdatedAt: string;

    beforeAll(async () => {
      const res = await payload.find({
        collection: 'events',
        where: { listing: { equals: 'archive' } },
        limit: 100,
        pagination: false,
        depth: 0,
      });
      archiveEvents = (res.docs as Event[]).filter((d) => d.slug !== 'pasto-vive-flow-2026');
      const pastoRes = await payload.find({
        collection: 'events',
        where: { slug: { equals: 'pasto-vive-flow-2026' } },
        depth: 0,
      });
      protectedEv = pastoRes.docs[0] as Event;
      protectedBeforeUpdatedAt = protectedEv.updatedAt;
    });

    afterAll(async () => {
      for (const ev of archiveEvents) {
        await payload.update({
          collection: 'events',
          id: ev.id,
          data: {
            _status: 'draft',
            verification: ev.verification,
            usageRights: ev.usageRights,
          },
          context: { disableRevalidate: true },
        });
      }
    });

    it('aborta sin realizar escrituras si el lote de candidatos es parcial (menos de 17)', async () => {
      const single = archiveEvents[0];
      await payload.update({
        collection: 'events',
        id: single.id,
        data: { _status: 'published', verification: { status: 'to_confirm' }, usageRights: { status: 'pending' } },
        context: { disableRevalidate: true },
      });

      await expect(repairStageHistoryDrafts({ dryRun: false })).rejects.toThrow(/Validación previa fallida/);

      // Confirmar que no escribió nada y restaurar single a draft
      const stillPublished = (await payload.findByID({ collection: 'events', id: single.id, depth: 0 })) as Event;
      expect(stillPublished._status).toBe('published');
      await payload.update({
        collection: 'events',
        id: single.id,
        data: { _status: 'draft' },
        context: { disableRevalidate: true },
      });
    });

    it('repairStageHistoryDrafts devuelve los 17 eventos a borrador, valida --dry-run, preserva historial y deja pasto-vive-flow-2026 intacto', async () => {
      expect(archiveEvents).toHaveLength(17);

      // Simular estado exacto de producción: los 17 archive publicados con to_confirm y pending
      for (const ev of archiveEvents) {
        await payload.update({
          collection: 'events',
          id: ev.id,
          data: { _status: 'published', verification: { status: 'to_confirm' }, usageRights: { status: 'pending' } },
          context: { disableRevalidate: true },
        });
      }

      const sample = archiveEvents[0];
      const versionsBeforeDryRun = await payload.db.drizzle.execute(
        `SELECT count(*)::int AS c FROM _events_v WHERE parent_id = ${sample.id};`,
      );

      const dry = await repairStageHistoryDrafts({ dryRun: true });
      expect(dry.inspected).toBe(17);
      expect(dry.repaired).toBe(17);
      expect(dry.protectedEventIntact).toBe(true);

      // Confirmar que --dry-run no realizó ninguna escritura ni en events ni en _events_v
      const afterDrySample = (await payload.findByID({ collection: 'events', id: sample.id, depth: 0 })) as Event;
      expect(afterDrySample._status).toBe('published');
      const versionsAfterDryRun = await payload.db.drizzle.execute(
        `SELECT count(*)::int AS c FROM _events_v WHERE parent_id = ${sample.id};`,
      );
      expect((versionsAfterDryRun.rows[0] as { c: number }).c).toBe(
        (versionsBeforeDryRun.rows[0] as { c: number }).c,
      );

      const applied = await repairStageHistoryDrafts({ dryRun: false });
      expect(applied.inspected).toBe(17);
      expect(applied.repaired).toBe(17);
      expect(applied.verifiedAllDraftAfter).toBe(true);
      expect(applied.protectedEventIntact).toBe(true);
      expect(applied.anonLocalApiVisibleAfter).toBe(0);

      // Verificar exposición pública anónima sin draft=true
      const anonNoDraft = await payload.find({
        collection: 'events',
        where: { listing: { equals: 'archive' } },
        overrideAccess: false,
        draft: false,
        limit: 100,
      });
      expect(anonNoDraft.totalDocs).toBe(0);

      const repairedSample = (await payload.findByID({ collection: 'events', id: sample.id, depth: 0 })) as Event;
      expect(repairedSample._status).toBe('draft');
      expect(repairedSample.eventName).toBe(sample.eventName);
      expect(repairedSample.posterImage).toBe(sample.posterImage);
      expect(repairedSample.usageRights?.status).toBe('pending');
      expect(repairedSample.verification?.status).toBe('to_confirm');

      const versionsAfterRepair = await payload.db.drizzle.execute(
        `SELECT count(*)::int AS c FROM _events_v WHERE parent_id = ${sample.id};`,
      );
      expect((versionsAfterRepair.rows[0] as { c: number }).c).toBeGreaterThan(
        (versionsBeforeDryRun.rows[0] as { c: number }).c,
      );

      // Confirmar que pasto-vive-flow-2026 no fue modificado
      const pastoAfter = (await payload.findByID({ collection: 'events', id: protectedEv.id, depth: 0 })) as Event;
      expect(pastoAfter.updatedAt).toBe(protectedBeforeUpdatedAt);

      // Idempotencia: segunda corrida no modifica nada
      const second = await repairStageHistoryDrafts({ dryRun: false });
      expect(second.repaired).toBe(0);
      expect(second.alreadyDraft).toBe(17);
      expect(second.verifiedAllDraftAfter).toBe(true);
      expect(second.protectedEventIntact).toBe(true);
    });
  });
});
