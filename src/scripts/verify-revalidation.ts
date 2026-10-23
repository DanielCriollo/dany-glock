import config from '../payload.config';
import { getPayload, type Payload } from 'payload';
import { randomBytes } from 'crypto';

/**
 * Verificación E2E de la revalidación bajo demanda (Misión 006-B.3).
 *
 * Requiere un servidor de PRODUCCIÓN local (`pnpm build && pnpm start`) apuntando a una
 * base de datos de desarrollo o pruebas. NUNCA ejecutar contra producción.
 *
 * - Crea un administrador temporal con contraseña aleatoria (no se imprime) y lo borra al final.
 * - Todos los cambios pasan por la API REST del servidor para que los hooks se ejecuten
 *   dentro del proceso de Next.js (igual que desde /admin).
 * - Restaura cada valor original al terminar, también vía REST.
 *
 * Uso: BASE_URL=http://localhost:3007 node <tsx> src/scripts/verify-revalidation.ts
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3007';
if (/forcefilters\.com/.test(BASE_URL)) {
  throw new Error('verify-revalidation no puede ejecutarse contra producción.');
}

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

async function page(path: string): Promise<{ status: number; html: string }> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Cache-Control': 'no-cache' } });
  return { status: res.status, html: await res.text() };
}

/** ISR regenera en la visita siguiente a la invalidación: se reintenta hasta 15 s. */
async function waitFor(path: string, predicate: (p: { status: number; html: string }) => boolean) {
  let last = { status: 0, html: '' };
  for (let i = 0; i < 30; i++) {
    last = await page(path);
    if (predicate(last)) return { ok: true, attempts: i + 1 };
    await new Promise((r) => setTimeout(r, 500));
  }
  return { ok: false, attempts: 30, status: last.status };
}

async function check(name: string, path: string, predicate: (p: { status: number; html: string }) => boolean) {
  const r = await waitFor(path, predicate);
  results.push({ name, ok: r.ok, detail: `${path} (${r.attempts} visita/s)` });
}

async function main() {
  const payload: Payload = await getPayload({ config });
  const email = `revalidation-e2e-${randomBytes(4).toString('hex')}@example.test`;
  const password = randomBytes(24).toString('base64url');
  const tempUser = await payload.create({
    collection: 'users',
    data: { name: 'E2E Revalidación (temporal)', email, password, role: 'admin' },
  });

  const original = {
    pressKit: await payload.findGlobal({ slug: 'press-kit' }),
    booking: await payload.findGlobal({ slug: 'booking' }),
    profile: await payload.findGlobal({ slug: 'artist-profile', depth: 0 }),
    release: (await payload.find({ collection: 'releases', where: { slug: { equals: 'exceso' } }, depth: 0 })).docs[0],
  };
  const media = (await payload.find({ collection: 'media', where: { filename: { equals: 'live-tarima-bn.jpg' } } })).docs[0];
  let highlightId: number | string | undefined;

  try {
    const login = await api('POST', '/api/users/login', { email, password });
    token = String(login.token);

    // 1. EPK: activar habilita /epk; desactivar vuelve a ocultarlo
    await check('EPK oculto al inicio', '/epk', (p) => p.status === 404);
    await api('POST', '/api/globals/press-kit', { isPublic: true });
    await check('Activar EPK habilita /epk', '/epk', (p) => p.status === 200 && p.html.includes('Electronic Press Kit'));
    await api('POST', '/api/globals/press-kit', { isPublic: false });
    await check('Desactivar EPK vuelve a ocultarlo', '/epk', (p) => p.status === 404);

    // 2. Hito: publicar lo muestra; retirar lo oculta; el borrador nunca se filtra
    const marker = `Hito E2E ${randomBytes(3).toString('hex')}`;
    const created = await api('POST', '/api/career-highlights?draft=true', {
      title: marker,
      slug: `e2e-${randomBytes(4).toString('hex')}`,
      category: 'milestone',
      sourceType: 'management',
      _status: 'draft',
    });
    highlightId = (created.doc as Json).id as number;
    await check('Borrador de hito invisible en /biografia', '/biografia', (p) => p.status === 200 && !p.html.includes(marker));
    const anon = await fetch(`${BASE_URL}/api/career-highlights?draft=true&limit=100&depth=0`).then((r) => r.json() as Promise<Json>);
    results.push({
      name: 'API anónima no devuelve borradores (draft=true)',
      ok: !JSON.stringify(anon).includes(marker),
    });
    await api('PATCH', `/api/career-highlights/${highlightId}`, { _status: 'published' });
    await check('Publicar hito lo muestra en /biografia', '/biografia', (p) => p.html.includes(marker));
    // Despublicar = actualizar el documento principal a `draft` (equivale a "Unpublish" en /admin)
    await api('PATCH', `/api/career-highlights/${highlightId}`, { _status: 'draft' });
    await check('Retirar hito lo elimina de /biografia', '/biografia', (p) => !p.html.includes(marker));

    // 3. Portada: cambiarla actualiza la discografía
    await api('PATCH', `/api/releases/${original.release.id}`, {
      coverImage: media.id,
      coverStatus: 'confirmed',
      _status: 'published',
    });
    await check('Cambiar portada actualiza la discografía (/)', '/', (p) => p.html.includes('live-tarima-bn'));

    // 4. Fotografía: retrato del artista en /biografia
    await api('POST', '/api/globals/artist-profile', { portraitImage: media.id });
    await check('Actualizar retrato modifica /biografia', '/biografia', (p) => p.html.includes('live-tarima-bn'));

    // 5. Booking: datos autorizados se actualizan; contacto privado solo con autorización
    const bookingMarker = `Descripción E2E ${randomBytes(3).toString('hex')}`;
    await api('POST', '/api/globals/booking', {
      showDescription: bookingMarker,
      management: { publishContact: false, name: 'Contacto E2E', email: 'contacto-e2e@example.test' },
    });
    await check('Modificar booking actualiza /booking', '/booking', (p) => p.html.includes(bookingMarker));
    await check('Contacto no autorizado no aparece en /booking', '/booking', (p) => !p.html.includes('contacto-e2e@example.test'));
    const anonBooking = await fetch(`${BASE_URL}/api/globals/booking?depth=0`).then((r) => r.json() as Promise<Json>);
    results.push({
      name: 'API anónima de booking oculta el contacto no autorizado',
      ok: !JSON.stringify(anonBooking).includes('contacto-e2e@example.test'),
    });
    await api('POST', '/api/globals/booking', { management: { publishContact: true } });
    await check('Contacto autorizado aparece en /booking', '/booking', (p) => p.html.includes('contacto-e2e@example.test'));
  } catch (error) {
    results.push({ name: 'Ejecución', ok: false, detail: (error as Error).message });
  } finally {
    // Restauración vía REST (para revalidar también la caché del servidor)
    const restore = async (label: string, fn: () => Promise<unknown>) => {
      try {
        await fn();
      } catch (e) {
        results.push({ name: `Restaurar ${label}`, ok: false, detail: (e as Error).message });
      }
    };
    await restore('hito', async () => highlightId && api('DELETE', `/api/career-highlights/${highlightId}`));
    await restore('press-kit', () => api('POST', '/api/globals/press-kit', { isPublic: original.pressKit.isPublic }));
    await restore('booking', () =>
      api('POST', '/api/globals/booking', {
        showDescription: original.booking.showDescription,
        management: original.booking.management ?? { publishContact: false },
      }),
    );
    await restore('retrato', () =>
      api('POST', '/api/globals/artist-profile', { portraitImage: original.profile.portraitImage ?? null }),
    );
    await restore('portada', () =>
      api('PATCH', `/api/releases/${original.release.id}`, {
        coverImage: original.release.coverImage,
        coverStatus: original.release.coverStatus,
        _status: original.release._status,
      }),
    );
    await payload.delete({ collection: 'users', id: tempUser.id });
  }

  for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed === 0 ? `\n✅ ${results.length} verificaciones superadas` : `\n❌ ${failed} verificaciones fallidas`);
  process.exit(failed === 0 ? 0 : 1);
}

if (process.argv[1]?.includes('verify-revalidation')) {
  main().catch((err) => {
    console.error('❌ Error en verify-revalidation:', err);
    process.exit(1);
  });
}
