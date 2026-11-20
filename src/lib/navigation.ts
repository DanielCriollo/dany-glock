/**
 * Fuente única de verdad para la navegación pública del sitio oficial de Dany Glock.
 *
 * Todos los enlaces corresponden a rutas reales o anclas verificadas en `src/app/(public)/page.tsx`:
 *   /#musica · /#videos · /biografia · /#tour · /escenarios (condicional) · /booking · /#contacto
 *
 * No existen enlaces a secciones inexistentes (p. ej. `#journal`) ni a rutas privadas (`/epk`, `/admin`).
 */

export type NavItemKey =
  | 'musica'
  | 'videos'
  | 'biografia'
  | 'tour'
  | 'escenarios'
  | 'booking'
  | 'contacto';

export interface NavItem {
  key: NavItemKey;
  label: string;
  href: string;
  description: string;
}

export interface NumberedNavItem extends NavItem {
  index: string;
}

const ALL_NAV_ITEMS: readonly NavItem[] = [
  {
    key: 'musica',
    label: 'Música',
    href: '/#musica',
    description: 'Discografía oficial, singles y lanzamientos',
  },
  {
    key: 'videos',
    label: 'Videos',
    href: '/#videos',
    description: 'Videoclips oficiales y visuales',
  },
  {
    key: 'biografia',
    label: 'El artista',
    href: '/biografia',
    description: 'Biografía oficial, origen y colaboraciones',
  },
  {
    key: 'tour',
    label: 'Shows',
    href: '/#tour',
    description: 'Próximas fechas y actividad en vivo',
  },
  {
    key: 'escenarios',
    label: 'Trayectoria',
    href: '/escenarios',
    description: 'Archivo de presentaciones anteriores',
  },
  {
    key: 'booking',
    label: 'Booking',
    href: '/booking',
    description: 'Contratación, formato del show y cotización',
  },
  {
    key: 'contacto',
    label: 'Contacto',
    href: '/#contacto',
    description: 'Prensa, alianzas y canal directo',
  },
];

/** Enlaces completos (menú editorial/móvil y footer). «Trayectoria» solo aparece si hay eventos publicados. */
export function getNavigationItems(showStageHistory = false): NumberedNavItem[] {
  return ALL_NAV_ITEMS.filter((item) => showStageHistory || item.key !== 'escenarios').map((item, i) => ({
    ...item,
    index: String(i + 1).padStart(2, '0'),
  }));
}

/** Enlaces de la barra central de escritorio (`Booking` va destacado aparte como CTA a la derecha). */
export function getDesktopNavItems(showStageHistory = false): NavItem[] {
  return getNavigationItems(showStageHistory).filter((item) => item.key !== 'booking');
}

