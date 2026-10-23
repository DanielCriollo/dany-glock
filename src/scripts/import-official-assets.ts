import config from '../payload.config';
import { getPayload, type Payload } from 'payload';
import fs from 'fs';
import path from 'path';
import type { Media } from '../payload-types';

/**
 * Importa portadas oficiales e imágenes del canal oficial (Misión 006-B.4).
 * Archivos en `local/official-assets/web/` (excluido de Git). Inventario y derechos:
 * `local/_ai-workspace/17-media-inventory.md`.
 *
 * Reglas:
 * - Idempotente por nombre de archivo.
 * - Solo reemplaza marcadores de posición (`placeholder-cover*`, `test-cover*`) o campos vacíos:
 *   nunca sobrescribe medios reales ya asignados desde el CMS.
 * - El estado de autorización se registra en `gallery.rightsStatus` (sin hacerlas visibles en la galería).
 * - No toca fotos ni flyers del brochure (derechos pendientes, BRO-08).
 */

const ASSETS_DIR = path.resolve(process.cwd(), 'local/official-assets/web');

type Asset = {
  file: string;
  alt: string;
  category: Media['category'];
  credit: string;
};

const COVERS: (Asset & { releaseSlug: string })[] = [
  { releaseSlug: 'sig-sauer', file: 'cover-sig-sauer.jpg', alt: 'Portada oficial del single SIG Sauer de Dany Glock', category: 'artwork', credit: '℗ 2024 Beatmen Generations · Distr. Diskover Co.' },
  { releaseSlug: 'so-fresh-so-clean', file: 'cover-so-fresh-so-clean.jpg', alt: 'Portada oficial de SO FRESH, SO CLEAN de Nick Montana y Dany Glock', category: 'artwork', credit: '℗ 2025 BeatmenGenerations · Distr. Diskover Co.' },
  { releaseSlug: 'cicatrices', file: 'cover-cicatrices.jpg', alt: 'Portada oficial de Cicatrices con Dany Glock y Maick Records', category: 'artwork', credit: '℗ 2026 Prix Music Group' },
  { releaseSlug: 'exceso', file: 'cover-exceso.jpg', alt: 'Portada oficial de EXCESO de Nick Montana con Dany Glock y Sebas BP', category: 'artwork', credit: '℗ 2026 BeatmenGenerations' },
];

// El banner del canal (2075×1167) se descartó como Hero: es un rótulo sobre público con terceros
// identificables (incluida una menor), el artista no se reconoce y en la caja 4:5 del Hero exigía
// recorte y ampliación. heroDesktopMedia/heroMobileMedia quedan vacíos hasta recibir fotos de prensa.

const PORTRAIT: Asset = {
  file: 'artist-avatar-youtube.jpg',
  alt: 'Retrato promocional de Dany Glock con gorra roja',
  category: 'photo_shoot',
  credit: 'Canal oficial de YouTube de Dany Glock',
};

const isPlaceholder = (m: unknown): boolean => {
  if (!m) return true;
  if (typeof m !== 'object') return false;
  const filename = (m as Media).filename ?? '';
  return /^(placeholder-cover|test-cover)/.test(filename);
};

async function upsertMedia(payload: Payload, asset: Asset): Promise<Media> {
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: asset.file } }, limit: 1 });
  if (existing.docs[0]) {
    console.log(`  = ${asset.file} ya importado`);
    return existing.docs[0];
  }
  const doc = await payload.create({
    collection: 'media',
    filePath: path.join(ASSETS_DIR, asset.file),
    data: {
      alt: asset.alt,
      category: asset.category,
      credit: asset.credit,
      // Autorización confirmada por el responsable del sitio (2026-10-23); no visible en la galería.
      gallery: { visible: false, rightsStatus: 'approved' },
    },
  });
  console.log(`  + ${asset.file} (${doc.width}×${doc.height})`);
  return doc;
}

async function importOfficialAssets() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log(`Carpeta ${ASSETS_DIR} no encontrada: nada que importar.`);
    return;
  }
  const payload = await getPayload({ config });
  console.log('🚀 Importando material oficial autorizado...');

  for (const cover of COVERS) {
    const media = await upsertMedia(payload, cover);
    const release = (
      await payload.find({ collection: 'releases', where: { slug: { equals: cover.releaseSlug } }, depth: 1, limit: 1 })
    ).docs[0];
    if (!release) {
      console.log(`  ! Lanzamiento ${cover.releaseSlug} no encontrado`);
      continue;
    }
    if (!isPlaceholder(release.coverImage)) {
      console.log(`  = ${cover.releaseSlug}: ya tiene una portada real asignada (sin cambios)`);
      continue;
    }
    await payload.update({
      collection: 'releases',
      id: release.id,
      data: { coverImage: media.id, coverStatus: 'confirmed' },
    });
    console.log(`  ✓ ${cover.releaseSlug}: portada oficial asignada (confirmed)`);
  }

  const profile = await payload.findGlobal({ slug: 'artist-profile', depth: 1 });
  const portrait = await upsertMedia(payload, PORTRAIT);
  if (!profile.portraitImage) {
    await payload.updateGlobal({ slug: 'artist-profile', data: { portraitImage: portrait.id } });
    console.log('  ✓ ArtistProfile: portraitImage');
  } else {
    console.log('  = portraitImage ya asignado (sin cambios)');
  }
  // Hero (desktop y móvil) vacío: no existe una foto oficial adecuada (ver inventario §4).
  console.log('✅ Importación completada.');
}

if (process.argv[1]?.includes('import-official-assets')) {
  importOfficialAssets()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error importando material oficial:', err);
      process.exit(1);
    });
}
