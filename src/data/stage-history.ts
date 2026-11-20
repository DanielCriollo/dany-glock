import type { Event } from '@/payload-types';

/**
 * Inventario de flyers históricos de Dany Glock (Misión 006-C).
 *
 * Fuente: 18 flyers entregados por el equipo del artista (2026-11-17), almacenados de forma
 * PRIVADA en `storage/flyers/` (excluido de Git) y transferidos por canal privado (SSH/SCP) al VPS
 * para importarlos con `src/scripts/import-stage-history.ts`.
 *
 * Reglas de transcripción:
 * - Solo datos legibles en el flyer. Sin años inferidos: `date` solo existe cuando el año aparece.
 * - Sin teléfonos, precios, direcciones ni códigos QR en los campos públicos.
 * - Todo entra en BORRADOR, con verificación `to_confirm` y derechos del flyer `pending`.
 *   Publicar exige aprobación expresa del equipo desde el admin.
 * - `internalNotes` (solo admin) recoge pistas para la verificación: candidatos de año calculados
 *   por el día de la semana, duplicados del brochure y advertencias de calidad o sensibilidad.
 */

export type StageArtistRole = NonNullable<Event['artistRole']>;

export interface StageHistoryEntry {
  /** Identificador estable del evento (clave de idempotencia). */
  slug: string;
  /** Slugs de registros previos que representan el mismo evento (no se duplican). */
  aliases?: string[];
  /** Nombre de archivo dentro del directorio privado de flyers (por defecto `storage/flyers/`). */
  file: string;
  eventName: string;
  /** Fecha tal como aparece en el flyer. */
  dateLabel?: string;
  /** ISO 8601, solo si el año es legible en el flyer. */
  date?: string;
  city?: string;
  venue?: string;
  artistRole: StageArtistRole;
  summary: string;
  alt: string;
  credit?: string;
  sortOrder: number;
  /** Media del brochure (M006-B.2) con el mismo flyer en menor resolución. */
  brochureDuplicate?: string;
  internalNotes: string;
}

export const FLYER_SOURCE = 'Archivo privado del equipo del artista (2026-11-17)';

export const STAGE_HISTORY: StageHistoryEntry[] = [
  {
    slug: 'pasto-vive-flow-2026',
    file: 'pasto-vive-flow-vol-1.jpg',
    eventName: 'Pasto Vive Flow Vol. 1',
    dateLabel: '01 de agosto de 2026',
    date: '2026-08-01T20:00:00.000Z',
    city: 'Pasto',
    venue: 'Centro de Eventos Andino',
    artistRole: 'headliner',
    summary: 'Pasto Vive Flow Vol. 1, con Dany Glock como artista del cartel en el Centro de Eventos Andino.',
    alt: 'Flyer de Pasto Vive Flow Vol. 1 con Dany Glock, Centro de Eventos Andino, 1 de agosto de 2026',
    sortOrder: 10,
    internalNotes:
      'Evento ya registrado (M006-A.1, borrador). Año legible en el flyer: 01-08-2026. El flyer incluye teléfono de boletería.',
  },
  {
    slug: 'baby-nico-party-estreno-exceso',
    file: 'baby-nico-party-estreno-exceso.jpg',
    eventName: 'Baby Nico Party — Estreno del video «EXCESO»',
    dateLabel: 'Sábado 26 de septiembre',
    venue: 'Tayndala',
    artistRole: 'release_event',
    summary:
      'Baby Nico Party Birthday con DJ Slow y estreno exclusivo del video musical de «EXCESO» — Sebas BP × Dany Glock × Nick Montana.',
    alt: 'Flyer de Baby Nico Party Birthday con el estreno del video musical de EXCESO de Sebas BP, Dany Glock y Nick Montana',
    sortOrder: 20,
    internalNotes:
      'Año no legible. Sábado 26-sep cae en 2020 o 2026; EXCESO se lanzó el 2026-07-07, por lo que 2026 es lo probable (confirmar). Ciudad no legible. El flyer incluye un número de reservas.',
  },
  {
    slug: 'macondo-bye-bye-cicatrices',
    file: 'macondo-bye-bye-cicatrices.jpg',
    eventName: 'Macondo Bye Bye — Lanzamiento del video «Cicatrices»',
    dateLabel: '25 de julio · 7 PM',
    artistRole: 'release_event',
    summary:
      'Frili Entertainment presenta Macondo Bye Bye: lanzamiento del video de «Cicatrices» (prod. by Darkpro). Entrada libre.',
    alt: 'Flyer estilo portada de revista de Macondo Bye Bye con Dany Glock y el lanzamiento del video de Cicatrices',
    sortOrder: 30,
    internalNotes:
      'Año no legible; Cicatrices se lanzó el 2026-07-01, 2026 probable (confirmar). El lugar no aparece como tal: «Macondo» es parte del título (el brochure cita «Macondo Bar» en otros eventos). Ciudad no legible. Incluye QR de Instagram.',
  },
  {
    slug: 'flow-fest-vol-01-ipiales',
    file: 'flow-fest-vol-01-ipiales.jpg',
    eventName: 'Flow Fest Vol. 01 — Magnate en concierto',
    dateLabel: 'Viernes 31 de julio',
    city: 'Ipiales',
    venue: 'A Toda Madre Club',
    artistRole: 'special_guest',
    summary:
      'ATM Eventos presenta Flow Fest Vol. 01: Magnate en concierto, con Dany Glock como invitado especial junto a Sebas BP, Nasner y JMelody.',
    alt: 'Flyer de Flow Fest Vol. 01 con Magnate en concierto y Dany Glock como invitado especial en A Toda Madre Club Ipiales',
    sortOrder: 40,
    internalNotes:
      'Año no legible; viernes 31-jul cae en 2020 o 2026 (confirmar). El flyer escribe «Danny Glock». Incluye teléfono de tickets, QR y dirección. Evento +18.',
  },
  {
    slug: 'panti-y-colale-camino-a-fronteo',
    file: 'panti-y-colale-camino-a-fronteo.jpg',
    eventName: 'Panti y Colale — Camino a Fronteo',
    dateLabel: 'Viernes 23 de octubre',
    city: 'Pasto',
    venue: 'Santo Perreo',
    artistRole: 'special_guest',
    summary:
      'JMM Producer y JC Entertainment presentan «Panti y Colale — Camino a Fronteo», con Dany Glock como invitado especial y el DJ residente Dreix.',
    alt: 'Flyer de Panti y Colale Camino a Fronteo con Dany Glock como invitado especial en Santo Perreo, Pasto',
    sortOrder: 50,
    internalNotes:
      'Año no legible; viernes 23-oct cae en 2020 o 2026 (confirmar). El flyer escribe «Danny Glock». Incluye dirección del venue.',
  },
  {
    slug: 'luna-roja-halloween-party',
    file: 'luna-roja-halloween-party.jpg',
    eventName: 'Luna Roja — Halloween Party',
    dateLabel: '31 de octubre',
    venue: 'Rey Arlequín',
    artistRole: 'unspecified',
    summary: 'Luna Roja, fiesta de disfraces de Halloween, con Dany Glock presentado como artista local.',
    alt: 'Flyer rojo de Luna Roja Halloween Party con Dany Glock como artista local',
    sortOrder: 60,
    internalNotes:
      'Año y ciudad no legibles (sin día de la semana). «Rey Arlequín» aparece como rótulo sin la etiqueta «lugar»: confirmar que es el venue. Incluye precio de preventa.',
  },
  {
    slug: 'aniversario-atm-perreo-clasico',
    file: 'aniversario-atm.jpg',
    eventName: 'Aniversario ATM — Noche de Perreo Clásico',
    dateLabel: 'Viernes 26 de diciembre',
    venue: 'A Toda Madre Club',
    artistRole: 'special_guest',
    summary:
      'Aniversario de A Toda Madre Club: noche de perreo clásico con Mishell Master Boys y Dany Glock como special guest; DJ Dani Burgos y DJ The Scientific.',
    alt: 'Flyer del aniversario de A Toda Madre Club con Mishell Master Boys y Dany Glock como invitado especial',
    sortOrder: 70,
    brochureDuplicate: 'flyer-aniversario-atm.jpg',
    internalNotes:
      'Año no legible; viernes 26-dic entre 2018 y 2026 solo cae en 2025 (confirmar). Ciudad no legible (dirección en barrio Las Cuadras). Captura de Instagram con iconos superpuestos (calidad media). Duplicado del brochure F13. Incluye teléfono de reservas.',
  },
  {
    slug: 'lanzamiento-sig-sauer-remix',
    file: 'lanzamiento-sig-sauer-remix.jpg',
    eventName: 'Lanzamiento «SIG Sauer Remix»',
    dateLabel: '22 de noviembre de 2024',
    date: '2024-11-22T17:00:00.000Z',
    venue: 'Plaza Norte',
    artistRole: 'release_event',
    summary:
      'Plaza Norte presenta el lanzamiento de «SIG Sauer Remix» con Dany Glock, Brak Johnz, Selene Psycho, Tevez, Dollaro, Lonelinees y Darev.',
    alt: 'Flyer del lanzamiento de SIG Sauer Remix en Plaza Norte con Dany Glock y los artistas del remix',
    sortOrder: 80,
    brochureDuplicate: 'flyer-lanzamiento-sig-sauer-remix.jpg',
    internalNotes:
      'Fecha legible: 22.NOV.24 (hora no indicada; se guarda a mediodía de Colombia). Ciudad no legible (barrio Palermo). Duplicado del brochure F7. Incluye teléfono y dirección.',
  },
  {
    slug: 'alfombra-dance-hall',
    file: 'alfombra-dance-hall.jpg',
    eventName: 'Alfombra Dance Hall XXX',
    dateLabel: 'Viernes 14 de febrero · 8 PM',
    artistRole: 'headliner',
    summary:
      'Frili Entertainment presenta a Dany Glock en show en vivo en «Alfombra Dance Hall XXX», con grabación de intro para la miniserie de Amenrap.',
    alt: 'Flyer de Frili Entertainment para Alfombra Dance Hall con Dany Glock en show en vivo',
    sortOrder: 90,
    brochureDuplicate: 'flyer-alfombra-dance-hall.jpg',
    internalNotes:
      'Año no legible; viernes 14-feb cae en 2020 o 2025 (confirmar). Lugar y ciudad no legibles. Captura de Instagram con icono de audio superpuesto (calidad media). Duplicado del brochure F2. Incluye teléfono de reservas.',
  },
  {
    slug: 'urban-fusion-quest-vol-4',
    file: 'urban-fusion-quest-vol-4.jpg',
    eventName: 'Urban Fusion Quest Vol. 4 — La última del año',
    dateLabel: '16 de diciembre · 7 PM',
    venue: 'Gastrobar El Calavera',
    artistRole: 'headliner',
    summary:
      'Beatmen Generations presenta Urban Fusion Quest Vol. 4 «La última del año», con Dany Glock, Underblessta como invitados especiales y artistas de Beatmen Generations.',
    alt: 'Flyer de Urban Fusion Quest Vol. 4 de Beatmen Generations con Dany Glock en Gastrobar El Calavera',
    credit: 'Diseño: Ducker Design',
    sortOrder: 95,
    internalNotes:
      'Año y ciudad no legibles (sin día de la semana). Incluye precios y número de Nequi. Firma de diseño: Ducker Design.',
  },
  {
    slug: 'urban-fusion-quest-season-2',
    file: 'urban-fusion-quest-season-2.jpg',
    eventName: 'Urban Fusion Quest Season #2',
    dateLabel: '12 de agosto · 7 PM',
    venue: 'Selva Negra',
    artistRole: 'lineup',
    summary:
      'Beatmen Generations presenta Urban Fusion Quest Season #2: gran final de concurso de baile, concurso de canto, batalla de beatmakers y artistas en vivo, con Dany Glock.',
    alt: 'Flyer de Urban Fusion Quest Season 2 de Beatmen Generations con Dany Glock en Selva Negra',
    credit: 'Diseño: Ducker Design',
    sortOrder: 110,
    brochureDuplicate: 'flyer-urban-fusion-quest.jpg',
    internalNotes:
      'Año no legible (sin día de la semana). Ciudad no legible (barrio San Felipe). Duplicado del brochure F9. Incluye WhatsApp, dirección y cover. Firma de diseño: Ducker Design.',
  },
  {
    slug: 'ghetto-dynasty-show-central',
    file: 'ghetto-dynasty.jpg',
    eventName: 'Ghetto Dynasty',
    dateLabel: 'Sábado 6 de abril · 7 PM',
    venue: 'Teatro San Felipe Neri',
    artistRole: 'headliner',
    summary: 'Ghetto Dynasty, con Dany Glock como show central ft. Cinco Ribo. Organiza Bloodline.',
    alt: 'Flyer de Ghetto Dynasty con Dany Glock como show central en el Teatro San Felipe Neri',
    sortOrder: 120,
    brochureDuplicate: 'flyer-ghetto-dynasty.jpg',
    internalNotes:
      'Año no legible; sábado 6-abr cae en 2019 o 2024 (confirmar). Ciudad no legible. Duplicado del brochure F3. Incluye precio de entrada.',
  },
  {
    slug: 'lanzamiento-cristales-tintiados',
    file: 'lanzamiento-cristales-tintiados.jpg',
    eventName: 'Lanzamiento «Cristales Tintiados»',
    dateLabel: 'Sábado 13 de abril · 8 PM',
    venue: 'El Faro',
    artistRole: 'special_guest',
    summary:
      'Lanzamiento de «Cristales Tintiados» (Dollaro × Jekony × TVZ Flow Maki), con Dany Glock como artista invitado. Entrada libre.',
    alt: 'Flyer azul del lanzamiento de Cristales Tintiados con Dany Glock como artista invitado en El Faro',
    sortOrder: 130,
    brochureDuplicate: 'flyer-cristales-tintiados.jpg',
    internalNotes:
      'Año no legible; sábado 13-abr cae en 2019 o 2024 (confirmar). Ciudad no legible (barrio Las Cuadras). Captura de Instagram con icono de audio superpuesto (calidad media). Duplicado del brochure F5. Incluye dirección.',
  },
  {
    slug: 'dany-glock-club-xilon',
    file: 'club-xilon.jpg',
    eventName: 'Dany Glock en Club Xilón',
    dateLabel: 'Sábado 15 de junio',
    city: 'Pasto',
    venue: 'Club Xilón',
    artistRole: 'headliner',
    summary: 'Dany Glock en Club Xilón, Pasto, con acceso para menores y mayores de edad.',
    alt: 'Flyer de Dany Glock en Club Xilón, Pasto, sábado 15 de junio',
    sortOrder: 140,
    brochureDuplicate: 'flyer-club-xilon.jpg',
    internalNotes: 'Año no legible; sábado 15-jun cae en 2019 o 2024 (confirmar). Duplicado del brochure F6.',
  },
  {
    slug: 'dancehall-selekta-live-session',
    file: 'dancehall-selekta.jpg',
    eventName: 'Dancehall Selekta — Live Session',
    dateLabel: '31 de octubre · 8 PM',
    city: 'Pasto',
    artistRole: 'headliner',
    summary: 'Dancehall Selekta presenta a Dany Glock, con DJ Bra / DJ Slow live session y Ciju Bless en vivo.',
    alt: 'Flyer de Dancehall Selekta presentando a Dany Glock con DJ Bra y DJ Slow, Pasto',
    sortOrder: 150,
    brochureDuplicate: 'flyer-dancehall-selekta.jpg',
    internalNotes:
      'Año no legible (sin día de la semana). Lugar no indicado más allá de «Avenida Los Estudiantes». Captura de historia con franjas negras (calidad media). Duplicado del brochure F1. Incluye teléfono de boletería.',
  },
  {
    slug: 'nejo-el-broko-telonero',
    file: 'nejo-el-broko-telonero.jpg',
    eventName: 'Ñejo «El Broko» — Telonero oficial',
    dateLabel: '25 de abril',
    venue: 'Centro de Eventos Andino',
    artistRole: 'opening_act',
    summary: 'Piso 12 y Borbón Entertainment presentan a Ñejo «El Broko», con Dany Glock como telonero oficial.',
    alt: 'Flyer de Ñejo El Broko con Dany Glock como telonero oficial en el Centro de Eventos Andino',
    sortOrder: 160,
    internalNotes: 'Año no legible (sin día de la semana). Ciudad no escrita en el flyer.',
  },
  {
    slug: 'colorado-fest',
    file: 'colorado-fest.jpg',
    eventName: 'Colorado Fest',
    city: 'Pasto',
    artistRole: 'special_guest',
    summary: 'Colorado Fest, con Dany Glock como artista invitado.',
    alt: 'Flyer naranja de Colorado Fest con Dany Glock como artista invitado, Pasto',
    sortOrder: 170,
    internalNotes: 'Sin fecha ni lugar legibles; «Pasto» aparece en la ilustración del volcán. Información insuficiente.',
  },
  {
    slug: 'show-urbano-fin-de-ano-inpec',
    file: 'show-fin-de-ano-inpec.jpg',
    eventName: 'Show urbano — Despedida de fin de año',
    city: 'Pasto',
    venue: 'Instituto Nacional Penitenciario y Carcelario (INPEC)',
    artistRole: 'headliner',
    summary: 'Show urbano de despedida de fin de año de Dany Glock, «por primera vez en Pasto».',
    alt: 'Flyer del show urbano de despedida de fin de año de Dany Glock en el INPEC, Pasto',
    sortOrder: 180,
    brochureDuplicate: 'flyer-show-fin-de-ano-inpec.jpg',
    internalNotes:
      'SENSIBLE: evento en centro penitenciario. Requiere autorización expresa del artista y del INPEC para difundir. Sin fecha legible. Duplicado del brochure F10 (career-highlights #9 en borrador).',
  },
];
