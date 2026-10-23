import { revalidatePath } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload';

/**
 * Revalidación bajo demanda de las páginas públicas (ISR).
 *
 * Las páginas públicas se prerenderizan en el build y Next.js las regenera en la
 * siguiente visita cuando se invalida su ruta. Los hooks de Payload se ejecutan dentro
 * del mismo proceso de Next.js (admin y API REST son rutas de la app), por lo que
 * `revalidatePath` actúa sobre la caché del servidor sin endpoints públicos adicionales.
 */

export const PUBLIC_PATHS = ['/', '/biografia', '/booking', '/epk'] as const;
export type PublicPath = (typeof PUBLIC_PATHS)[number];

/** Rutas que muestran datos de cada colección o global. `'*'` = todo el sitio (layout). */
export const CONTENT_DEPENDENCIES: Record<string, readonly PublicPath[] | '*'> = {
  releases: ['/', '/biografia', '/epk'],
  tracks: ['/', '/biografia', '/epk'],
  videos: ['/', '/epk'],
  events: ['/'],
  articles: ['/'],
  'career-highlights': ['/biografia', '/epk'],
  'artist-profile': ['/', '/biografia', '/epk'],
  booking: ['/', '/biografia', '/booking', '/epk'],
  'press-kit': ['/', '/epk'],
  // Media se usa en portadas, hero, retrato, galería y EPK; SiteSettings en header y footer.
  media: '*',
  'site-settings': '*',
};

/**
 * Invalida las rutas que dependen de `slug`. Fuera del runtime de Next.js (scripts con tsx,
 * Vitest) `revalidatePath` lanza una invariante: se ignora porque allí no hay caché que invalidar.
 */
export function revalidateContent(slug: string): readonly string[] {
  const deps = CONTENT_DEPENDENCIES[slug];
  if (!deps) return [];
  const paths = deps === '*' ? ['/'] : deps;
  try {
    if (deps === '*') {
      revalidatePath('/', 'layout');
    } else {
      for (const path of deps) revalidatePath(path);
    }
  } catch {
    return [];
  }
  return paths;
}

type RevalidationContext = { disableRevalidate?: boolean };

function shouldSkip(context: unknown): boolean {
  return Boolean((context as RevalidationContext | undefined)?.disableRevalidate);
}

type MaybeVersioned = { _status?: 'draft' | 'published' | null };

/**
 * En colecciones con borradores solo hay que revalidar cuando el documento está publicado
 * o deja de estarlo (despublicación). Guardar un borrador no cambia la web pública.
 */
function affectsPublicSite(doc: MaybeVersioned | undefined, previousDoc: MaybeVersioned | undefined): boolean {
  const hasDrafts = doc?._status !== undefined || previousDoc?._status !== undefined;
  if (!hasDrafts) return true;
  return doc?._status === 'published' || previousDoc?._status === 'published';
}

export function revalidateCollectionAfterChange(slug: string): CollectionAfterChangeHook {
  return ({ doc, previousDoc, req }) => {
    if (shouldSkip(req.context)) return doc;
    if (affectsPublicSite(doc as MaybeVersioned, previousDoc as MaybeVersioned)) {
      const paths = revalidateContent(slug);
      if (paths.length > 0) req.payload.logger.info(`Revalidación (${slug}): ${paths.join(', ')}`);
    }
    return doc;
  };
}

export function revalidateCollectionAfterDelete(slug: string): CollectionAfterDeleteHook {
  return ({ doc, req }) => {
    if (shouldSkip(req.context)) return doc;
    if (affectsPublicSite(doc as MaybeVersioned, undefined)) {
      const paths = revalidateContent(slug);
      if (paths.length > 0) req.payload.logger.info(`Revalidación por borrado (${slug}): ${paths.join(', ')}`);
    }
    return doc;
  };
}

export function revalidateGlobalAfterChange(slug: string): GlobalAfterChangeHook {
  return ({ doc, req }) => {
    if (shouldSkip(req.context)) return doc;
    const paths = revalidateContent(slug);
    if (paths.length > 0) req.payload.logger.info(`Revalidación (${slug}): ${paths.join(', ')}`);
    return doc;
  };
}

/** Atajo para registrar ambos hooks en una colección. */
export function revalidationHooks(slug: string) {
  return {
    afterChange: [revalidateCollectionAfterChange(slug)],
    afterDelete: [revalidateCollectionAfterDelete(slug)],
  };
}
