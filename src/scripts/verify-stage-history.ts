import config from '../payload.config';
import { getPayload, type Payload } from 'payload';
import { randomBytes } from 'crypto';
import type { Event } from '../payload-types';

/**
 * Verificación E2E de «Trayectoria en escenarios» (Misión 006-C) contra un servidor de
 * PRODUCCIÓN local (`pnpm build && pnpm start`). NUNCA ejecutar contra producción.
 *
 *   BASE_URL=http://localhost:3007 node <tsx> src/scripts/verify-stage-history.ts          # verificar y restaurar
 *   BASE_URL=http://localhost:3007 node <tsx> src/scripts/verify-stage-history.ts --demo   # dejar publicado (QA visual)
 *   BASE_URL=http://localhost:3007 node <tsx> src/scripts/verify-stage-history.ts --restore
 *
 * Publica temporalmente 3 eventos del archivo vía REST (los hooks corren dentro de Next.js):
 * dos con flyer aprobado y uno con derechos pendientes. Comprueba revalidación, imágenes,
 * privacidad y menú; después restaura el estado original (borrador, `to_confirm`, `pending`).
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3007';
if (/forcefilters\.com/.test(BASE_URL)) throw new Error('verify-stage-history no puede ejecutarse contra producción.');

const DEMO = [
  { slug: 'dany-glock-club-xilon', approveFlyer: true },
  { slug: 'nejo-el-broko-telonero', approveFlyer: true },
  { slug: 'colorado-fest', approveFlyer: false },
];

type Json = Record<string, unknown>;
let token = '';
const results: { name: string; ok: boolean; detail?: string }[] = [];

async function api(method: string, path: string, body?: Json): Promise<Json> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json).slice(0, 200)}`);
  return json;
}

async function page(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Cache-Control': 'no-cache' } });
  return { status: res.status, html: await res.text() };
}

async function check(name: string, path: string, predicate: (p: { status: number; html: string }) => boolean) {
  let last = { status: 0, html: '' };
  for (let i = 0; i < 30; i++) {
    last = await page(path);
    if (predicate(last)) {
      results.push({ name, ok: true, detail: `${path} (${i + 1} visita/s)` });
      return last;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  results.push({ name, ok: false, detail: `${path} → ${last.status}` });
  return last;
}

async function status(path: string) {
  return (await fetch(`${BASE_URL}${path}`)).status;
}

async function loadEvents(payload: Payload): Promise<Event[]> {
  const res = await payload.find({
    collection: 'events',
    where: { slug: { in: DEMO.map((d) => d.slug) } },
    depth: 1,
  });
  return res.docs as Event[];
}

async function restoreAll(events: Event[]) {
  for (const e of events) {
    await api('PATCH', `/api/events/${e.id}`, {
      _status: 'draft',
      verification: { ...e.verification, status: 'to_confirm' },
      usageRights: { ...e.usageRights, status: 'pending' },
    });
  }
}

async function main() {
  const mode = process.argv.includes('--demo') ? 'demo' : process.argv.includes('--restore') ? 'restore' : 'verify';
  const payload = await getPayload({ config });
  const email = `stage-e2e-${randomBytes(4).toString('hex')}@example.test`;
  const password = randomBytes(24).toString('base64url');
  const tempUser = await payload.create({
    collection: 'users',
    data: { name: 'E2E Escenarios (temporal)', email, password, role: 'admin' },
  });
  const events = await loadEvents(payload);
  if (events.length !== DEMO.length) throw new Error('Faltan eventos de demo: ejecutar import-stage-history.ts');

  try {
    token = String((await api('POST', '/api/users/login', { email, password })).token);

    if (mode === 'restore') {
      await restoreAll(events);
      await check('Restaurado: /escenarios vuelve a 404', '/escenarios', (p) => p.status === 404);
      return;
    }

    await check('Sin eventos publicados /escenarios es 404', '/escenarios', (p) => p.status === 404);
    await check(
      'Sin eventos publicados el menú no enlaza /escenarios ni anclas rotas (#journal)',
      '/',
      (p) =>
        p.status === 200 &&
        !p.html.includes('href="/escenarios"') &&
        !p.html.includes('/#journal') &&
        p.html.includes('href="/biografia"') &&
        p.html.includes('href="/booking"'),
    );
    await check(
      '/booking accesible sin galería de flyers ni enlace a /escenarios cuando no hay publicados',
      '/booking',
      (p) =>
        p.status === 200 &&
        p.html.includes('href="/#tour"') &&
        p.html.includes('href="/#musica"') &&
        !p.html.includes('/#journal') &&
        !p.html.includes('href="/escenarios"') &&
        !p.html.includes('Archivo visual de presentaciones') &&
        !p.html.includes('02 / Archivo de presentaciones'),
    );

    const xilon = events.find((e) => e.slug === 'dany-glock-club-xilon')!;
    const xilonMedia = typeof xilon.posterImage === 'object' ? xilon.posterImage : null;
    const xilonFile = xilonMedia?.filename ?? null;
    const xilonSizes = Object.values(xilonMedia?.sizes ?? {})
      .map((s) => s?.filename)
      .filter((f): f is string => Boolean(f));
    const colorado = events.find((e) => e.slug === 'colorado-fest')!;
    const coloradoMedia = typeof colorado.posterImage === 'object' ? colorado.posterImage : null;
    const coloradoFile = coloradoMedia?.filename ?? null;

    // Rutas estáticas directas: nunca deben exponer flyers locales ni media/
    results.push({
      name: 'Rutas estáticas (/storage/flyers, /flyers, /media) bloqueadas (404)',
      ok:
        (await status('/storage/flyers/club-xilon.jpg')) === 404 &&
        (await status('/flyers/club-xilon.jpg')) === 404 &&
        (await status(`/media/${xilonFile}`)) === 404,
    });
    results.push({
      name: 'Flyer no aprobado: archivo original bloqueado para anónimos',
      ok: (await status(`/api/media/file/${xilonFile}`)) >= 400,
    });
    const resizedStatuses = await Promise.all(xilonSizes.map((f) => status(`/api/media/file/${f}`)));
    results.push({
      name: `Flyer no aprobado: variantes redimensionadas (${xilonSizes.length}) bloqueadas`,
      ok: xilonSizes.length > 0 && resizedStatuses.every((code) => code >= 400),
      detail: resizedStatuses.join(','),
    });
    results.push({
      name: 'Flyer no aprobado: /_next/image rechazado para anónimos',
      ok: (await status(`/_next/image?url=${encodeURIComponent(`/api/media/file/${xilonFile}`)}&w=640&q=75`)) >= 400,
    });
    const anonMediaBefore = (await fetch(`${BASE_URL}/api/media?limit=100`).then((r) => r.json())) as {
      docs?: Array<{ category?: string }>;
    };
    results.push({
      name: 'API /api/media anónima sin flyers/fotos no aprobados',
      ok: (anonMediaBefore.docs ?? []).every((m) => m.category !== 'event_flyer' && m.category !== 'live_photo'),
    });
    const gqlRes = (await fetch(`${BASE_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ allMedia(limit: 100) { docs { filename category } } Events(limit: 100) { docs { slug } } }',
      }),
    }).then((r) => r.json())) as {
      data?: { allMedia?: { docs?: Array<{ category?: string }> }; Events?: { docs?: Array<{ slug?: string }> } };
    };
    results.push({
      name: 'API GraphQL anónima sin borradores ni flyers no aprobados',
      ok:
        (gqlRes.data?.Events?.docs?.length ?? -1) === 0 &&
        (gqlRes.data?.allMedia?.docs ?? []).every((m) => m.category !== 'event_flyer' && m.category !== 'live_photo'),
    });

    // Comprobar que aprobar derechos en BORRADOR no expone el flyer
    await api('PATCH', `/api/events/${xilon.id}`, {
      _status: 'draft',
      usageRights: { ...xilon.usageRights, status: 'approved' },
    });
    results.push({
      name: 'Borrador con derechos aprobados: flyer sigue bloqueado para anónimos',
      ok: (await status(`/api/media/file/${xilonFile}`)) >= 400,
    });
    await api('PATCH', `/api/events/${xilon.id}`, {
      _status: 'draft',
      usageRights: { ...xilon.usageRights, status: 'pending' },
    });

    for (const d of DEMO) {
      const e = events.find((x) => x.slug === d.slug)!;
      await api('PATCH', `/api/events/${e.id}`, {
        _status: 'published',
        verification: { ...e.verification, status: 'verified' },
        usageRights: { ...e.usageRights, status: d.approveFlyer ? 'approved' : 'pending' },
      });
    }

    const html = (
      await check('Publicar eventos habilita /escenarios', '/escenarios', (p) =>
        p.status === 200 && p.html.includes('Club Xilón') && p.html.includes('Colorado Fest'),
      )
    ).html;
    results.push({ name: 'Flyer aprobado presente en /escenarios', ok: html.includes(String(xilonFile)) });
    results.push({ name: 'Flyer con derechos pendientes ausente', ok: !html.includes(String(coloradoFile)) });
    results.push({
      name: 'Sin notas internas, fuente ni teléfonos en el HTML',
      ok: !/\[M006-C\]|WhatsApp|storage\/flyers|\d{3}[\s-]\d{3}[\s-]\d{4}/.test(html),
    });
    results.push({ name: 'Flyer aprobado servible (200)', ok: (await status(`/api/media/file/${xilonFile}`)) === 200 });
    results.push({
      name: 'Variante optimizada /_next/image (200)',
      ok: (await status(`/_next/image?url=${encodeURIComponent(`/api/media/file/${xilonFile}`)}&w=640&q=75`)) === 200,
    });
    results.push({ name: 'Flyer pendiente sigue bloqueado', ok: (await status(`/api/media/file/${coloradoFile}`)) >= 400 });
    await check('El menú enlaza /escenarios', '/', (p) => p.html.includes('href="/escenarios"'));
    await check('/biografia muestra la trayectoria', '/biografia', (p) => p.html.includes('Trayectoria en escenarios'));
    await check('/booking enlaza /escenarios sin duplicar la galería de flyers', '/booking', (p) =>
      p.status === 200 &&
      p.html.includes('href="/escenarios"') &&
      !p.html.includes('Archivo visual de presentaciones') &&
      !p.html.includes('02 / Archivo de presentaciones'),
    );
    await check('Otros borradores siguen ocultos', '/escenarios', (p) => !p.html.includes('Luna Roja'));
    await check('EPK sigue oculto', '/epk', (p) => p.status === 404);

    const anon = await fetch(`${BASE_URL}/api/events?draft=true&limit=100&depth=2`).then((r) => r.json() as Promise<Json>);
    const anonText = JSON.stringify(anon);
    results.push({
      name: 'API anónima: solo los 3 publicados, sin notas/fuentes internas ni flyer pendiente',
      ok:
        (anon.totalDocs as number) === 3 &&
        !anonText.includes('[M006-C]') &&
        !anonText.includes('"approvalNote"') &&
        !anonText.includes('"source"') &&
        !anonText.includes(String(coloradoFile)),
    });

    if (mode === 'demo') {
      console.log('ℹ️  Modo demo: los 3 eventos quedan publicados. Restaurar con --restore.');
      return;
    }

    // QA visual opcional: mantiene la publicación temporal N segundos y luego restaura igualmente.
    const hold = Number(process.env.QA_HOLD_SECONDS || 0);
    if (hold > 0) {
      console.log(`ℹ️  QA visual: publicación temporal durante ${hold} s; después se restaura.`);
      await new Promise((r) => setTimeout(r, hold * 1000));
    }

    await restoreAll(events);
    await check('Retirar eventos vuelve a ocultar /escenarios', '/escenarios', (p) => p.status === 404);
    await check('Retirar eventos quita el enlace del menú', '/', (p) => !p.html.includes('href="/escenarios"'));
    await check('Retirar eventos quita el enlace en /booking', '/booking', (p) => !p.html.includes('href="/escenarios"'));
    results.push({ name: 'Flyer vuelve a bloquearse', ok: (await status(`/api/media/file/${xilonFile}`)) >= 400 });
    results.push({
      name: 'Caché /_next/image purgada tras revocar flyer',
      ok: (await status(`/_next/image?url=${encodeURIComponent(`/api/media/file/${xilonFile}`)}&w=640&q=75`)) >= 400,
    });
  } catch (error) {
    results.push({ name: 'Ejecución', ok: false, detail: (error as Error).message });
    if (mode !== 'demo') await restoreAll(events).catch(() => undefined);
  } finally {
    await payload.delete({ collection: 'users', id: tempUser.id });
  }

  for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed === 0 ? `\n✅ ${results.length} verificaciones superadas` : `\n❌ ${failed} verificaciones fallidas`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
