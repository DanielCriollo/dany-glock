import config from '../payload.config';
import { getPayload, type Payload } from 'payload';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { Event, Media } from '../payload-types';
import { FLYER_SOURCE, STAGE_HISTORY, type StageHistoryEntry } from '../data/stage-history';

/**
 * Importador idempotente del archivo de eventos (Misión 006-C).
 *
 *   pnpm exec tsx src/scripts/import-stage-history.ts [--dry-run] [--dir <ruta>]
 *   STAGE_FLYERS_DIR=/ruta/privada/flyers pnpm exec tsx src/scripts/import-stage-history.ts
 *
 * - Lee los flyers desde un directorio PRIVADO local (por defecto `storage/flyers/`, excluido de
 *   Git; nunca versiona ni modifica los originales). Si la carpeta no existe, termina sin error.
 * - Media: reutiliza el registro si ya existe uno con el mismo nombre o el mismo contenido (SHA-256);
 *   si no, lo sube como `event_flyer` OCULTO en la galería de /booking (`gallery.visible = false`).
 * - Eventos: identifica por `slug` (y alias). Nunca duplica, nunca cambia el estado editorial y
 *   nunca sobrescribe datos existentes: en registros previos solo completa campos vacíos.
 *   Los registros publicados no se tocan.
 * - Todo evento nuevo entra en BORRADOR (`to_confirm`, derechos del flyer `pending`).
 *   Publicar es una decisión editorial que se toma en el admin.
 * - Seguro para ejecutar en cualquier entorno, también tras un despliegue (previa transferencia
 *   privada de flyers por SSH/SCP).
 */

export const FLYERS_DIR = path.resolve(process.cwd(), 'storage/flyers');
const MEDIA_DIR = path.resolve(process.cwd(), 'media');
const MEDIA_PREFIX = 'escenario-';

export function resolveFlyersDir(
  argv: string[] = process.argv,
  env: Record<string, string | undefined> = process.env,
): string {
  const eqArg = argv.find((a) => a.startsWith('--dir='));
  if (eqArg) return path.resolve(eqArg.slice('--dir='.length));
  const idx = argv.indexOf('--dir');
  if (idx !== -1 && argv[idx + 1]) return path.resolve(argv[idx + 1]);
  if (env.STAGE_FLYERS_DIR) return path.resolve(env.STAGE_FLYERS_DIR);
  return FLYERS_DIR;
}

function sha256(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

/** Índice SHA-256 → id de los medios existentes cuyo archivo está en disco. */
async function indexExistingMedia(payload: Payload): Promise<Map<string, Media>> {
  const index = new Map<string, Media>();
  const all = await payload.find({ collection: 'media', limit: 1000, pagination: false, depth: 0 });
  for (const doc of all.docs as Media[]) {
    if (!doc.filename) continue;
    const onDisk = path.join(MEDIA_DIR, doc.filename);
    if (fs.existsSync(onDisk)) index.set(sha256(onDisk), doc);
  }
  return index;
}

async function ensureFlyerMedia(
  payload: Payload,
  entry: StageHistoryEntry,
  hashIndex: Map<string, Media>,
  flyersDir: string,
  dryRun: boolean,
): Promise<{ media: Media | null; action: string }> {
  const filePath = path.join(flyersDir, entry.file);
  const filename = `${MEDIA_PREFIX}${entry.file}`;

  const byName = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (byName.totalDocs > 0) return { media: byName.docs[0] as Media, action: 'media existente (nombre)' };

  const hash = sha256(filePath);
  const sameContent = hashIndex.get(hash);
  if (sameContent) return { media: sameContent, action: `media existente (contenido idéntico: ${sameContent.filename})` };

  if (dryRun) return { media: null, action: 'media nueva (dry-run)' };

  const data = fs.readFileSync(filePath);
  const media = (await payload.create({
    collection: 'media',
    data: {
      alt: entry.alt,
      category: 'event_flyer',
      credit: entry.credit,
      gallery: {
        visible: false,
        rightsStatus: 'pending',
        eventLabel: entry.eventName,
        dateLabel: entry.dateLabel,
        venueLabel: entry.venue,
        sortOrder: 200 + entry.sortOrder,
      },
    },
    file: { data, mimetype: 'image/jpeg', name: filename, size: data.length },
    context: { disableRevalidate: true },
  })) as Media;
  hashIndex.set(hash, media);
  return { media, action: 'media nueva' };
}

function buildNotes(entry: StageHistoryEntry): string {
  const lines = [`[M006-C] ${entry.internalNotes}`, `Archivo: ${entry.file}.`];
  if (entry.brochureDuplicate) {
    lines.push(`Mismo flyer que el medio del brochure «${entry.brochureDuplicate}» (menor resolución): se usa esta copia.`);
  }
  return lines.join('\n');
}

async function findEvent(payload: Payload, entry: StageHistoryEntry): Promise<Event | null> {
  const slugs = [entry.slug, ...(entry.aliases ?? [])];
  const res = await payload.find({
    collection: 'events',
    where: { slug: { in: slugs } },
    // Se lee la tabla principal (no la última versión) para comparar con lo que ve la web.
    limit: 1,
    depth: 0,
  });
  return (res.docs[0] as Event | undefined) ?? null;
}

const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

/** Campos vacíos de un registro existente que el importador puede completar. */
export function fillableFields(existing: Event, entry: StageHistoryEntry, mediaId: number | null): Partial<Event> {
  const patch: Partial<Event> = {};
  const isPast = existing.date ? new Date(existing.date).getTime() < Date.now() : true;
  // `listing = upcoming` proviene del valor por defecto de la migración: un evento ya pasado va al archivo.
  if (existing.listing !== 'archive' && isPast) patch.listing = 'archive';
  if (isEmpty(existing.dateLabel) && entry.dateLabel) patch.dateLabel = entry.dateLabel;
  if (isEmpty(existing.date) && entry.date) patch.date = entry.date;
  if (isEmpty(existing.city) && entry.city) patch.city = entry.city;
  if (isEmpty(existing.venue) && entry.venue) patch.venue = entry.venue;
  if ((isEmpty(existing.artistRole) || existing.artistRole === 'unspecified') && entry.artistRole !== 'unspecified') {
    patch.artistRole = entry.artistRole;
  }
  if (isEmpty(existing.summary)) patch.summary = entry.summary;
  if (isEmpty(existing.posterImage) && mediaId) patch.posterImage = mediaId;
  // 100 es el valor por defecto de la migración: se sustituye por el orden editorial del inventario.
  if ((existing.sortOrder === 100 || isEmpty(existing.sortOrder)) && existing.sortOrder !== entry.sortOrder) {
    patch.sortOrder = entry.sortOrder;
  }
  if (isEmpty(existing.usageRights?.source)) {
    patch.usageRights = {
      ...existing.usageRights,
      status: existing.usageRights?.status ?? 'pending',
      source: FLYER_SOURCE,
      credit: existing.usageRights?.credit || entry.credit,
    };
  }
  if (!existing.verification?.notes?.includes('[M006-C]')) {
    patch.verification = {
      ...existing.verification,
      notes: [existing.verification?.notes, buildNotes(entry)].filter(Boolean).join('\n\n'),
    };
  }
  return patch;
}

export interface ImportStageHistoryOptions {
  flyersDir?: string;
  dryRun?: boolean;
}

export interface ImportStageHistorySummary {
  created: number;
  completed: number;
  unchanged: number;
  skippedPublished: number;
  missing: number;
  missingDir: boolean;
}

export async function importStageHistory(
  options?: ImportStageHistoryOptions,
): Promise<ImportStageHistorySummary> {
  const flyersDir = options?.flyersDir ? path.resolve(options.flyersDir) : resolveFlyersDir();
  const isDryRun = options?.dryRun ?? process.argv.includes('--dry-run');

  if (!fs.existsSync(flyersDir)) {
    console.log(
      `Carpeta privada de flyers no encontrada (${flyersDir}): nada que importar. ` +
        'Los flyers no se versionan en Git; transfiérelos por canal privado (SSH/SCP) o indica --dir / STAGE_FLYERS_DIR.',
    );
    return {
      created: 0,
      completed: 0,
      unchanged: 0,
      skippedPublished: 0,
      missing: STAGE_HISTORY.length,
      missingDir: true,
    };
  }
  const payload = await getPayload({ config });
  console.log(`🎤 Importando archivo de eventos desde ${flyersDir}${isDryRun ? ' (dry-run, sin escribir)' : ''}...`);

  const hashIndex = await indexExistingMedia(payload);
  const summary: ImportStageHistorySummary = {
    created: 0,
    completed: 0,
    unchanged: 0,
    skippedPublished: 0,
    missing: 0,
    missingDir: false,
  };

  for (const entry of STAGE_HISTORY) {
    if (!fs.existsSync(path.join(flyersDir, entry.file))) {
      console.log(`  ! Falta ${entry.file} en ${flyersDir}, se omite`);
      summary.missing++;
      continue;
    }

    const existing = await findEvent(payload, entry);
    if (existing?._status === 'published') {
      console.log(`  = ${entry.slug}: publicado, no se modifica`);
      summary.skippedPublished++;
      continue;
    }

    const { media, action } = await ensureFlyerMedia(payload, entry, hashIndex, flyersDir, isDryRun);
    const mediaId = media?.id ?? null;

    if (existing) {
      const patch = fillableFields(existing, entry, mediaId);
      if (Object.keys(patch).length === 0) {
        console.log(`  = ${entry.slug}: sin cambios (${action})`);
        summary.unchanged++;
        continue;
      }
      if (!isDryRun) {
        const updated = (await payload.update({
          collection: 'events',
          id: existing.id,
          draft: true,
          data: { ...patch, _status: 'draft' },
          context: { disableRevalidate: true },
        })) as Event;
        if (updated._status !== 'draft') {
          throw new Error(`Estado editorial inesperado tras actualizar ${entry.slug}: ${String(updated._status)}`);
        }
      }
      console.log(`  ~ ${entry.slug}: completados ${Object.keys(patch).join(', ')} (${action})`);
      summary.completed++;
      continue;
    }

    if (!isDryRun) {
      const created = (await payload.create({
        collection: 'events',
        draft: true,
        data: {
          _status: 'draft',
          eventName: entry.eventName,
          slug: entry.slug,
          listing: 'archive',
          sortOrder: entry.sortOrder,
          date: entry.date,
          dateLabel: entry.dateLabel,
          city: entry.city,
          country: 'Colombia',
          venue: entry.venue,
          artistRole: entry.artistRole,
          summary: entry.summary,
          ticketStatus: null,
          posterImage: mediaId,
          usageRights: { status: 'pending', source: FLYER_SOURCE, credit: entry.credit },
          verification: { status: 'to_confirm', notes: buildNotes(entry) },
        },
        context: { disableRevalidate: true },
      })) as Event;
      if (created._status !== 'draft') {
        throw new Error(`Estado editorial inesperado tras crear ${entry.slug}: ${String(created._status)}`);
      }
    }
    console.log(`  + ${entry.slug} (borrador; ${action})`);
    summary.created++;
  }

  console.log(
    `✅ Listo: ${summary.created} creados, ${summary.completed} completados, ${summary.unchanged} sin cambios, ` +
      `${summary.skippedPublished} publicados intactos, ${summary.missing} archivos faltantes.`,
  );
  console.log('ℹ️  Ningún evento se publicó. La caché pública no cambia: los borradores no son visibles.');
  return summary;
}

if (process.argv[1]?.includes('import-stage-history')) {
  importStageHistory()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error importando el archivo de eventos:', err);
      process.exit(1);
    });
}
