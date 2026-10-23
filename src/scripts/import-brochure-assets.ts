import config from '../payload.config';
import { getPayload } from 'payload';
import fs from 'fs';
import path from 'path';
import type { Media } from '../payload-types';

/**
 * Importa a la colección Media los flyers y fotos en vivo extraídos del brochure
 * (carpeta local `local/brochure-assets/`, excluida de Git por contener datos de terceros).
 *
 * - Idempotente por nombre de archivo.
 * - Todo entra OCULTO (`gallery.visible = false`) y con derechos `pending`:
 *   la publicación requiere aprobación de management desde el admin.
 * - Solo se transcriben textos legibles del flyer; no se infieren años ni lugares.
 * - `credit` queda vacío: el crédito real (fotógrafo/diseñador/promotor) lo completa management.
 */

type AssetSeed = {
  file: string;
  alt: string;
  category: Extract<Media['category'], 'event_flyer' | 'live_photo'>;
  eventLabel?: string;
  dateLabel?: string;
  venueLabel?: string;
  sortOrder: number;
};

const ASSETS_DIR = path.resolve(process.cwd(), 'local/brochure-assets');

const assets: AssetSeed[] = [
  { file: 'live-tarima-luces.jpg', alt: 'Dany Glock cantando en tarima bajo luces verdes', category: 'live_photo', sortOrder: 1 },
  { file: 'live-tarima-bn.jpg', alt: 'Dany Glock en tarima con micrófono, fotografía en blanco y negro', category: 'live_photo', sortOrder: 2 },
  { file: 'flyer-premios-kiwid-line-2025.jpg', alt: 'Flyer de la alfombra roja de Premios Kiwid Line edición 2025', category: 'event_flyer', eventLabel: 'Alfombra Roja — Premios Kiwid Line, categoría urbana', dateLabel: 'Viernes Dic 12, 2025', venueLabel: 'Macondo Bar', sortOrder: 10 },
  { file: 'flyer-sig-sauer-gang.jpg', alt: 'Flyer del evento Invitados locales Sig Sauer Gang', category: 'event_flyer', eventLabel: 'Invitados locales — Sig Sauer Gang', dateLabel: '7 diciembre 2024', sortOrder: 20 },
  { file: 'flyer-lanzamiento-sig-sauer-remix.jpg', alt: 'Flyer del lanzamiento de Sig Sauer Remix en Plaza Norte', category: 'event_flyer', eventLabel: 'Lanzamiento Sig Sauer Remix', dateLabel: '22.NOV.24', venueLabel: 'Plaza Norte', sortOrder: 30 },
  { file: 'flyer-show-fin-de-ano-inpec.jpg', alt: 'Flyer del show urbano de despedida de fin de año en el INPEC de Pasto', category: 'event_flyer', eventLabel: 'Show urbano — Despedida fin de año', venueLabel: 'INPEC, Pasto', sortOrder: 40 },
  { file: 'flyer-aniversario-atm.jpg', alt: 'Flyer del aniversario A Toda Madre con Mishell Master Boys y Dany Glock', category: 'event_flyer', eventLabel: 'Aniversario ATM — Noche de Perreo Clásico', dateLabel: 'Dic 26', sortOrder: 50 },
  { file: 'flyer-partyton-amor-y-amistad.jpg', alt: 'Flyer de Amor y Amistad Partyton con Sig Sauer Remix en vivo', category: 'event_flyer', eventLabel: 'Amor y Amistad Partyton — Sig Sauer Remix en vivo', dateLabel: 'Vie 19 Sep', venueLabel: 'Macondo Bar', sortOrder: 60 },
  { file: 'flyer-urban-fusion-quest.jpg', alt: 'Flyer de Urban Fusion Quest Season 2 de Beatmen Generations', category: 'event_flyer', eventLabel: 'Urban Fusion Quest — Season #2', dateLabel: '12 Ago', venueLabel: 'Selva Negra', sortOrder: 70 },
  { file: 'flyer-club-xilon.jpg', alt: 'Flyer del show de Dany Glock en Club Xilón', category: 'event_flyer', eventLabel: 'Dany Glock en Club Xilón', dateLabel: 'Sábado 15 Junio', venueLabel: 'Club Xilón, Pasto', sortOrder: 80 },
  { file: 'flyer-ghetto-dynasty.jpg', alt: 'Flyer de Ghetto Dynasty con Dany Glock como show central', category: 'event_flyer', eventLabel: 'Ghetto Dynasty — Show central', dateLabel: 'Sábado 6 de Abril', venueLabel: 'Teatro San Felipe Neri', sortOrder: 90 },
  { file: 'flyer-cristales-tintiados.jpg', alt: 'Flyer del lanzamiento Cristales Tintiados con Dany Glock como artista invitado', category: 'event_flyer', eventLabel: 'Lanzamiento Cristales Tintiados — Artista invitado', dateLabel: 'Sábado 13 Abr', venueLabel: 'El Faro', sortOrder: 100 },
  { file: 'flyer-alfombra-dance-hall.jpg', alt: 'Flyer de Alfombra Dance Hall con Dany Glock show en vivo', category: 'event_flyer', eventLabel: 'Alfombra Dance Hall — Show en vivo', dateLabel: 'Vier Feb 14', sortOrder: 110 },
  { file: 'flyer-dancehall-selekta.jpg', alt: 'Flyer de Dancehall Selekta presentando a Dany Glock', category: 'event_flyer', eventLabel: 'Dancehall Selekta — Live Session', dateLabel: 'Octubre 31', sortOrder: 120 },
];

async function importBrochureAssets() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log(`Carpeta ${ASSETS_DIR} no encontrada: nada que importar.`);
    return;
  }
  const payload = await getPayload({ config });
  console.log('🚀 Importando archivo visual del brochure (oculto hasta aprobación)...');

  for (const asset of assets) {
    const filePath = path.join(ASSETS_DIR, asset.file);
    if (!fs.existsSync(filePath)) {
      console.log(`  ! Falta ${asset.file}, se omite`);
      continue;
    }
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: asset.file } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      console.log(`  = ${asset.file} ya importado (sin cambios)`);
      continue;
    }
    await payload.create({
      collection: 'media',
      filePath,
      data: {
        alt: asset.alt,
        category: asset.category,
        gallery: {
          visible: false,
          rightsStatus: 'pending',
          eventLabel: asset.eventLabel,
          dateLabel: asset.dateLabel,
          venueLabel: asset.venueLabel,
          sortOrder: asset.sortOrder,
        },
      },
    });
    console.log(`  + ${asset.file}`);
  }
  console.log('✅ Importación completada.');
}

if (process.argv[1]?.includes('import-brochure-assets')) {
  importBrochureAssets()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error importando assets:', err);
      process.exit(1);
    });
}
