import type { Event, Media } from '@/payload-types';

/**
 * Utilidades puras del archivo «Trayectoria en escenarios» (sin dependencias de Payload en runtime).
 */

export const ARTIST_ROLE_LABELS: Record<NonNullable<Event['artistRole']>, string | null> = {
  headliner: 'Show central',
  special_guest: 'Invitado especial',
  opening_act: 'Telonero oficial',
  lineup: 'En el cartel',
  release_event: 'Lanzamiento',
  unspecified: null,
};

export function artistRoleLabel(role: Event['artistRole']): string | null {
  return role ? ARTIST_ROLE_LABELS[role] : null;
}

/** Vista pública de un evento del archivo: solo los campos que la web puede mostrar. */
export interface StageHistoryItem {
  id: number;
  slug: string;
  title: string;
  dateLabel: string | null;
  place: string | null;
  role: string | null;
  summary: string | null;
  credit: string | null;
  flyer: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
}

/** Fecha visible: la transcrita del flyer; si no hay, la exacta (solo existe cuando el año está confirmado). */
export function eventDateLabel(event: Pick<Event, 'dateLabel' | 'date'>): string | null {
  if (event.dateLabel) return event.dateLabel;
  if (!event.date) return null;
  return new Date(event.date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  });
}

/**
 * El flyer solo se expone si sus derechos de uso están aprobados y el archivo existe.
 * Disponer del archivo no equivale a tener autorización para publicarlo.
 */
export function publicFlyer(event: Pick<Event, 'posterImage' | 'usageRights'>): StageHistoryItem['flyer'] {
  if (event.usageRights?.status !== 'approved') return null;
  const media = event.posterImage;
  if (!media || typeof media === 'number') return null;
  const m = media as Media;
  if (!m.url || !m.width || !m.height) return null;
  return { url: m.url, alt: m.alt, width: m.width, height: m.height };
}

export function toStageHistoryItem(event: Event): StageHistoryItem {
  const place = [event.venue, event.city].filter(Boolean).join(', ');
  const flyer = publicFlyer(event);
  return {
    id: event.id,
    slug: event.slug,
    title: event.eventName,
    dateLabel: eventDateLabel(event),
    place: place || null,
    role: artistRoleLabel(event.artistRole),
    summary: event.summary || null,
    credit: flyer ? event.usageRights?.credit || null : null,
    flyer,
  };
}
