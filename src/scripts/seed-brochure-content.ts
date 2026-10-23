import config from '../payload.config';
import { getPayload, type Payload } from 'payload';
import type { CareerHighlight } from '../payload-types';

/**
 * Siembra del contenido derivado del brochure oficial (Misión 006-B.2).
 * Fuente: local/_ai-workspace/15-brochure-audit.md
 *
 * Reglas:
 * 1. Solo crea: si un registro o global ya tiene contenido, NO se modifica (respeta ediciones del CMS).
 * 2. Colaboraciones verificables en plataformas → publicadas con `verification.status = verified`.
 * 3. Afirmaciones que solo constan en el brochure → borrador (`draft`) + `to_confirm`.
 * 4. No incluye datos de contacto de management: el repositorio es público. Se cargan desde el admin.
 */

type HighlightSeed = Omit<CareerHighlight, 'id' | 'createdAt' | 'updatedAt' | 'relatedRelease'> & {
  relatedReleaseSlug?: string;
};

const CONSULTED_AT = '2026-10-23T00:00:00.000Z';

const highlights: HighlightSeed[] = [
  {
    title: 'Debut oficial con «SIG Sauer»',
    slug: 'debut-sig-sauer',
    category: 'milestone',
    year: 2024,
    description: 'Primer single oficial en plataformas digitales, con producción de Nick Montana Beatmen.',
    relatedReleaseSlug: 'sig-sauer',
    sourceType: 'platform',
    sortOrder: 10,
    verification: {
      status: 'verified',
      sourceUrl: 'https://music.apple.com/us/album/sig-sauer-single/1739566495',
      consultedAt: CONSULTED_AT,
    },
    _status: 'published',
  },
  {
    title: 'SIG Sauer (Remix) con artistas de la escena local',
    slug: 'colaboracion-sig-sauer-remix',
    category: 'collaboration',
    year: 2024,
    description:
      'Versión remix que reúne a artistas de la escena urbana local. El brochure del equipo la presenta como el «junte del año».',
    people: [
      { name: 'Brak Johnz' },
      { name: 'Dollaro' },
      { name: 'TVZ' },
      { name: 'Selene Psycho' },
      { name: 'Darev' },
      { name: 'Loneliness' },
    ],
    externalUrl: 'https://www.youtube.com/watch?v=4BzpqeraFjc',
    sourceType: 'platform',
    sortOrder: 20,
    verification: {
      status: 'verified',
      sourceUrl: 'https://www.youtube.com/watch?v=4BzpqeraFjc',
      consultedAt: CONSULTED_AT,
      notes: 'Artistas tomados del título del video oficial. «Junte del año» es una denominación del brochure, no un premio.',
    },
    _status: 'published',
  },
  {
    title: 'SO FRESH, SO CLEAN — con Nick Montana',
    slug: 'colaboracion-so-fresh-so-clean',
    category: 'collaboration',
    year: 2025,
    description: 'Single en coautoría con Nick Montana.',
    people: [{ name: 'Nick Montana' }],
    relatedReleaseSlug: 'so-fresh-so-clean',
    sourceType: 'platform',
    sortOrder: 30,
    verification: {
      status: 'verified',
      sourceUrl: 'https://music.apple.com/us/album/so-fresh-so-clean-single/1828774400',
      consultedAt: CONSULTED_AT,
    },
    _status: 'published',
  },
  {
    title: 'Cicatrices — con Nick Montana, Dark Pro y Maick Records',
    slug: 'colaboracion-cicatrices',
    category: 'collaboration',
    year: 2026,
    description: 'Single conjunto publicado por Prix Music Group.',
    people: [{ name: 'Nick Montana' }, { name: 'Dark Pro' }, { name: 'Maick Records' }],
    relatedReleaseSlug: 'cicatrices',
    sourceType: 'platform',
    sortOrder: 40,
    verification: {
      status: 'verified',
      sourceUrl: 'https://music.apple.com/us/album/cicatrices-feat-maick-records-single/6794031338',
      consultedAt: CONSULTED_AT,
    },
    _status: 'published',
  },
  {
    title: 'EXCESO — artista invitado de Nick Montana',
    slug: 'colaboracion-exceso',
    category: 'collaboration',
    year: 2026,
    description: 'Participación como artista invitado junto a Sebas BP.',
    people: [{ name: 'Nick Montana' }, { name: 'Sebas BP' }],
    relatedReleaseSlug: 'exceso',
    sourceType: 'platform',
    sortOrder: 50,
    verification: {
      status: 'verified',
      sourceUrl: 'https://music.apple.com/us/album/exceso-feat-dany-glock-sebas-bp-single/6792980912',
      consultedAt: CONSULTED_AT,
    },
    _status: 'published',
  },
  // ---------------- Pendientes de confirmación (borrador) ----------------
  {
    title: 'Artista del Año — Premios Kiwid Line',
    slug: 'artista-del-ano-premios-kiwid-line',
    category: 'award',
    dateLabel: '2024 y 2025 (según brochure)',
    description: 'Reconocimiento en la categoría urbana «Artista o Agrupación del Año».',
    sourceType: 'artist_brochure',
    sortOrder: 60,
    verification: {
      status: 'to_confirm',
      notes:
        'Brochure p.1 dice solo 2024; p.2 y p.5 dicen 2024 y 2025. El flyer de la gala (Dic 12, 2025, Macondo Bar) anuncia la categoría, no el resultado. Solicitar acta, certificado o publicación de la organización.',
    },
    _status: 'draft',
  },
  {
    title: 'Show urbano de fin de año en el INPEC (Pasto)',
    slug: 'show-inpec-pasto',
    category: 'social_impact',
    description: 'Presentación en un centro penitenciario de Pasto, registrada en un mini documental.',
    sourceType: 'artist_brochure',
    sortOrder: 70,
    verification: {
      status: 'to_confirm',
      notes:
        'Flyer sin año legible. Confirmar año, autorización para difundir y enlace del mini documental.',
    },
    _status: 'draft',
  },
  {
    title: 'Escenarios compartidos',
    slug: 'escenarios-compartidos',
    category: 'shared_stage',
    description:
      'Artistas con los que ha compartido cartel en eventos. Compartir escenario no implica una colaboración musical.',
    people: [
      { name: 'Jory', origin: 'Puerto Rico' },
      { name: 'Ryan Castro', origin: 'Colombia' },
      { name: 'Pirlo 420', origin: 'Colombia' },
      { name: 'Carlos Cortez', origin: 'Ecuador' },
      { name: 'Milo Mae', origin: 'Ecuador' },
      { name: 'Jhonny Rivera' },
      { name: 'Mishel Master Boy' },
    ],
    sourceType: 'artist_brochure',
    sortOrder: 80,
    verification: {
      status: 'to_confirm',
      notes:
        'Flyers corroboran cartel con Mishell Master Boys y con Carlos Cortez & Milo Mae (7 dic 2024). Confirmar evento y fecha del resto antes de publicar.',
    },
    _status: 'draft',
  },
  {
    title: 'Pistolón (colaboración)',
    slug: 'colaboracion-pistolon',
    category: 'collaboration',
    description: 'Colaboración mencionada en el brochure.',
    sourceType: 'artist_brochure',
    sortOrder: 90,
    verification: {
      status: 'to_confirm',
      notes: 'No aparece en Apple Music ni en el canal oficial. Solicitar enlace, artista principal y fecha.',
    },
    _status: 'draft',
  },
];

async function findReleaseId(payload: Payload, slug?: string): Promise<number | undefined> {
  if (!slug) return undefined;
  const res = await payload.find({
    collection: 'releases',
    where: { slug: { equals: slug } },
    draft: true,
    limit: 1,
  });
  return res.docs[0] ? Number(res.docs[0].id) : undefined;
}

export async function seedBrochureContent(payloadInstance?: Payload) {
  const payload = payloadInstance || (await getPayload({ config }));
  console.log('🚀 Siembra del contenido del brochure (solo creación)...');

  // 1. Trayectoria, reconocimientos y colaboraciones
  for (const { relatedReleaseSlug, ...item } of highlights) {
    const existing = await payload.find({
      collection: 'career-highlights',
      where: { slug: { equals: item.slug } },
      draft: true,
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      console.log(`  = Hito existente "${item.title}" (sin cambios)`);
      continue;
    }
    const relatedRelease = await findReleaseId(payload, relatedReleaseSlug);
    const created = await payload.create({
      collection: 'career-highlights',
      draft: item._status === 'draft',
      data: { ...item, ...(relatedRelease ? { relatedRelease } : {}) },
    });
    console.log(`  + Creado hito "${created.title}" (${item._status === 'draft' ? 'BORRADOR' : 'PUBLICADO'})`);
  }

  // 2. Shows & Booking — solo si el global no ha sido redactado todavía
  const booking = await payload.findGlobal({ slug: 'booking' });
  if (!booking.showDescription) {
    await payload.updateGlobal({
      slug: 'booking',
      data: {
        showTitle: 'Dany Glock en vivo',
        showDescription:
          'Show de reggaetón y trap urbano que combina DJ set y performance en vivo, con interacción directa con el público y coreografías en escena.',
        specsStatus: 'declared',
        specs: {
          duration: '30–45 minutos',
          format: 'DJ set + performance en vivo',
          genre: 'Reggaetón y trap urbano',
          audience: '18–35 años',
          includesDancers: true,
        },
        liveFeatures: [
          { text: 'Interacción directa con el público' },
          { text: 'Coreografías en escena' },
          { text: 'Bailarines' },
        ],
        eventTypes: [
          { title: 'Discotecas', description: 'Formato para ambientes nocturnos y fiestas urbanas.' },
          { title: 'Festivales urbanos', description: 'Presentación para eventos masivos de música urbana.' },
          {
            title: 'Eventos corporativos',
            description: 'Show adaptado para marcas que quieren conectar con audiencias jóvenes.',
          },
        ],
        baseLocation: 'Pasto, Nariño, Colombia',
        availabilityNote: 'Disponibilidad para presentarse en otras ciudades.',
        quoteNote:
          'Para cotizaciones, disponibilidad y rider técnico, envía tu solicitud indicando fecha, ciudad y tipo de evento.',
        management: {
          publishContact: false,
          sourceNote:
            'Brochure oficial p.6 contiene nombre, rol, correo y WhatsApp de management. Cargar manualmente tras confirmar vigencia y autorización de publicación.',
        },
      },
    });
    console.log('  + Global Shows & Booking inicializado (especificaciones declaradas, contacto privado)');
  } else {
    console.log('  = Global Shows & Booking ya redactado (sin cambios)');
  }

  // 3. Electronic Press Kit — solo si no tiene introducción
  const pressKit = await payload.findGlobal({ slug: 'press-kit' });
  if (!pressKit.intro) {
    await payload.updateGlobal({
      slug: 'press-kit',
      data: {
        isPublic: false,
        headline: 'Electronic Press Kit',
        intro:
          'Información oficial de Dany Glock para promotores, medios y organizadores: biografía, música, videoclips, trayectoria y formato del show.',
        bioVariant: 'medium',
        includeShowInfo: true,
        downloadStatus: 'in_preparation',
      },
    });
    console.log('  + Global EPK inicializado (privado hasta aprobación)');
  } else {
    console.log('  = Global EPK ya redactado (sin cambios)');
  }

  console.log('✅ Siembra del brochure completada.');
}

if (process.argv[1]?.includes('seed-brochure-content')) {
  seedBrochureContent()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error en seedBrochureContent:', err);
      process.exit(1);
    });
}
