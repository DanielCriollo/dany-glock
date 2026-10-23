import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';

// next/cache solo funciona dentro del runtime de Next.js: se sustituye por un espía.
const revalidatePathMock = vi.hoisted(() => vi.fn());
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));

import config from '@/payload.config';
import { getPayload, type Payload, type PayloadRequest } from 'payload';
import {
  CONTENT_DEPENDENCIES,
  revalidateCollectionAfterChange,
  revalidateCollectionAfterDelete,
  revalidateContent,
  revalidateGlobalAfterChange,
} from '@/lib/revalidate';
import { revalidateSiteEndpoint } from '@/endpoints/revalidateSite';
import { getBookingData, getPublishedCareerHighlights } from '@/lib/cms-queries';

type HookArgs = Parameters<ReturnType<typeof revalidateCollectionAfterChange>>[0];

const fakeReq = (context: Record<string, unknown> = {}) =>
  ({ context, payload: { logger: { info: vi.fn() } } }) as unknown as PayloadRequest;

const calledPaths = () => revalidatePathMock.mock.calls.map((c) => (c[1] ? `${c[0]}|${c[1]}` : c[0]));

beforeEach(() => {
  revalidatePathMock.mockClear();
});

describe('Misión 006-B.3 — Revalidación bajo demanda del CMS', () => {
  describe('1. Mapa de dependencias', () => {
    it('cubre Home, Biografía, Booking, Discografía, Videos y EPK', () => {
      expect(CONTENT_DEPENDENCIES.releases).toEqual(['/', '/biografia', '/epk']);
      expect(CONTENT_DEPENDENCIES.videos).toEqual(['/', '/epk']);
      expect(CONTENT_DEPENDENCIES['career-highlights']).toEqual(['/biografia', '/epk']);
      expect(CONTENT_DEPENDENCIES.booking).toContain('/booking');
      expect(CONTENT_DEPENDENCIES['press-kit']).toContain('/epk');
      expect(CONTENT_DEPENDENCIES.media).toBe('*');
      expect(CONTENT_DEPENDENCIES['site-settings']).toBe('*');
    });

    it('media y site-settings invalidan todo el sitio vía layout raíz', () => {
      revalidateContent('media');
      expect(calledPaths()).toEqual(['/|layout']);
    });

    it('colecciones privadas (users, contacts) no revalidan nada', () => {
      expect(revalidateContent('users')).toEqual([]);
      expect(revalidateContent('contacts')).toEqual([]);
      expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('fuera del runtime de Next.js un fallo de revalidatePath no rompe la escritura', () => {
      revalidatePathMock.mockImplementationOnce(() => {
        throw new Error('Invariant: static generation store missing');
      });
      expect(() => revalidateContent('booking')).not.toThrow();
    });
  });

  describe('2. Hooks de colecciones con borradores', () => {
    const hook = revalidateCollectionAfterChange('career-highlights');
    const run = (doc: object, previousDoc?: object, context = {}) =>
      hook({ doc, previousDoc, req: fakeReq(context) } as unknown as HookArgs);

    it('publicar revalida /biografia y /epk', () => {
      run({ _status: 'published' }, { _status: 'draft' });
      expect(calledPaths()).toEqual(['/biografia', '/epk']);
    });

    it('despublicar (publicado → borrador) también revalida para retirar el contenido', () => {
      run({ _status: 'draft' }, { _status: 'published' });
      expect(calledPaths()).toEqual(['/biografia', '/epk']);
    });

    it('guardar un borrador nunca publicado no toca la caché pública', () => {
      run({ _status: 'draft' }, { _status: 'draft' });
      expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('respeta context.disableRevalidate (seeds y migraciones)', () => {
      run({ _status: 'published' }, undefined, { disableRevalidate: true });
      expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('borrar un documento publicado revalida; borrar un borrador no', () => {
      const del = revalidateCollectionAfterDelete('releases');
      del({ doc: { _status: 'published' }, req: fakeReq() } as unknown as Parameters<typeof del>[0]);
      expect(calledPaths()).toEqual(['/', '/biografia', '/epk']);
      revalidatePathMock.mockClear();
      del({ doc: { _status: 'draft' }, req: fakeReq() } as unknown as Parameters<typeof del>[0]);
      expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('colecciones sin borradores (media) revalidan siempre', () => {
      revalidateCollectionAfterChange('media')({ doc: { id: 1 }, req: fakeReq() } as unknown as HookArgs);
      expect(calledPaths()).toEqual(['/|layout']);
    });

    it('los globals revalidan sus rutas al guardarse', () => {
      const g = revalidateGlobalAfterChange('press-kit');
      g({ doc: {}, req: fakeReq() } as unknown as Parameters<typeof g>[0]);
      expect(calledPaths()).toEqual(['/', '/epk']);
    });
  });

  describe('3. Integración con la configuración real de Payload', () => {
    let payload: Payload;
    let highlightId: number;
    let originalBooking: Awaited<ReturnType<Payload['findGlobal']>>;

    beforeAll(async () => {
      payload = await getPayload({ config });
      originalBooking = await payload.findGlobal({ slug: 'booking' });
      const created = await payload.create({
        collection: 'career-highlights',
        draft: true,
        data: {
          title: 'Hito temporal de prueba (revalidación)',
          slug: 'test-revalidacion-temporal',
          category: 'milestone',
          sourceType: 'management',
          _status: 'draft',
        },
      });
      highlightId = Number(created.id);
    });

    afterAll(async () => {
      if (highlightId) await payload.delete({ collection: 'career-highlights', id: highlightId });
      await payload.updateGlobal({
        slug: 'booking',
        data: { management: (originalBooking as { management?: object }).management ?? {} },
      });
    });

    it('un borrador recién creado no revalida ni es visible', async () => {
      const visible = await getPublishedCareerHighlights();
      expect(visible.map((h) => h.slug)).not.toContain('test-revalidacion-temporal');
    });

    it('publicar el hito revalida /biografia y lo hace visible', async () => {
      revalidatePathMock.mockClear();
      await payload.update({ collection: 'career-highlights', id: highlightId, data: { _status: 'published' } });
      expect(calledPaths()).toEqual(expect.arrayContaining(['/biografia', '/epk']));
      const visible = await getPublishedCareerHighlights();
      expect(visible.map((h) => h.slug)).toContain('test-revalidacion-temporal');
    });

    it('retirar el hito revalida y deja de ser visible para anónimos', async () => {
      revalidatePathMock.mockClear();
      await payload.update({ collection: 'career-highlights', id: highlightId, data: { _status: 'draft' } });
      expect(calledPaths()).toEqual(expect.arrayContaining(['/biografia', '/epk']));
      const visible = await getPublishedCareerHighlights();
      expect(visible.map((h) => h.slug)).not.toContain('test-revalidacion-temporal');
    });

    it('guardar booking revalida /booking pero el contacto sigue privado sin autorización', async () => {
      revalidatePathMock.mockClear();
      await payload.updateGlobal({
        slug: 'booking',
        data: { management: { publishContact: false, name: 'Privado Prueba', email: 'privado@example.com' } },
      });
      expect(calledPaths()).toEqual(expect.arrayContaining(['/booking', '/']));
      const publicBooking = await getBookingData();
      expect(publicBooking?.management?.name).toBeUndefined();
      expect(publicBooking?.management?.email).toBeUndefined();
    });
  });

  describe('4. Endpoint protegido POST /api/revalidate', () => {
    const call = (user: object | null) =>
      revalidateSiteEndpoint.handler({
        user,
        payload: { logger: { info: vi.fn() } },
      } as unknown as PayloadRequest);

    it('rechaza visitantes anónimos (403) sin revalidar', async () => {
      const res = await call(null);
      expect(res.status).toBe(403);
      expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('rechaza usuarios autenticados sin rol admin (403)', async () => {
      const res = await call({ id: 2, role: 'editor' });
      expect(res.status).toBe(403);
      expect(revalidatePathMock).not.toHaveBeenCalled();
    });

    it('un admin invalida todo el sitio', async () => {
      const res = await call({ id: 1, role: 'admin' });
      expect(res.status).toBe(200);
      expect(calledPaths()).toEqual(['/|layout']);
    });
  });
});
