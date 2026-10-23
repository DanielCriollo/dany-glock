import config from '@payload-config';
import { getPayload } from 'payload';
import type {
  ArtistProfile,
  SiteSetting,
  Release,
  Video,
  Event,
  Article,
  CareerHighlight,
  Booking,
  PressKit,
  Media,
} from '@/payload-types';

export interface PublicCmsData {
  artistProfile: ArtistProfile | null;
  siteSettings: SiteSetting | null;
  releases: Release[];
  featuredRelease: Release | null;
  videos: Video[];
  events: Event[];
  articles: Article[];
}

/**
 * Obtiene el perfil global del artista.
 */
export async function getArtistProfileData(): Promise<ArtistProfile | null> {
  try {
    const payload = await getPayload({ config });
    const profile = await payload.findGlobal({
      slug: 'artist-profile',
      overrideAccess: false,
      depth: 2,
    });
    return profile as ArtistProfile;
  } catch (error) {
    console.warn('cms-queries: Error al obtener artist-profile:', error);
    return null;
  }
}

/**
 * Obtiene las configuraciones globales del sitio.
 */
export async function getSiteSettingsData(): Promise<SiteSetting | null> {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      overrideAccess: false,
    });
    return settings as SiteSetting;
  } catch (error) {
    console.warn('cms-queries: Error al obtener site-settings:', error);
    return null;
  }
}

/**
 * Obtiene los lanzamientos discográficos publicados y verificados editorialmente.
 * Excluye estrictamente borradores (como sig-sauer-remix) y registros no verificados/scaffolding.
 */
export async function getPublishedReleasesData(): Promise<Release[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'releases',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            'verification.status': {
              equals: 'verified',
            },
          },
        ],
      },
      sort: '-releaseDate',
      limit: 20,
      overrideAccess: false,
      depth: 2,
    });
    return res.docs as Release[];
  } catch (error) {
    console.warn('cms-queries: Error al obtener releases:', error);
    return [];
  }
}

/**
 * Obtiene los videos oficiales de YouTube publicados y verificados.
 */
export async function getPublishedVideosData(): Promise<Video[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'videos',
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: '-releaseDate',
      limit: 20,
      overrideAccess: false,
      depth: 2,
    });
    return res.docs as Video[];
  } catch (error) {
    console.warn('cms-queries: Error al obtener videos:', error);
    return [];
  }
}

/**
 * Obtiene los eventos en vivo publicados y verificados.
 * Excluye estrictamente eventos en borrador (como pasto-vive-flow-2026).
 */
export async function getPublishedEventsData(): Promise<Event[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'events',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            'verification.status': {
              equals: 'verified',
            },
          },
        ],
      },
      sort: 'date',
      limit: 10,
      overrideAccess: false,
    });
    return res.docs as Event[];
  } catch (error) {
    console.warn('cms-queries: Error al obtener events:', error);
    return [];
  }
}

/**
 * Obtiene los artículos y comunicados editoriales publicados y verificados.
 */
export async function getPublishedArticlesData(): Promise<Article[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'articles',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            'verification.status': {
              equals: 'verified',
            },
          },
        ],
      },
      sort: '-publishedAt',
      limit: 20,
      overrideAccess: false,
    });
    return res.docs as Article[];
  } catch (error) {
    console.warn('cms-queries: Error al obtener articles:', error);
    return [];
  }
}

/**
 * Consulta unificada para la página principal, ejecutada en paralelo en Server Components.
 */
export async function getHomePageCmsData(): Promise<PublicCmsData> {
  const [artistProfile, siteSettings, releases, videos, events, articles] = await Promise.all([
    getArtistProfileData(),
    getSiteSettingsData(),
    getPublishedReleasesData(),
    getPublishedVideosData(),
    getPublishedEventsData(),
    getPublishedArticlesData(),
  ]);

  // Identificar el último lanzamiento destacado publicado (o el más reciente)
  const featuredRelease = releases.find((r) => r.featured) || releases[0] || null;

  return {
    artistProfile,
    siteSettings,
    releases,
    featuredRelease,
    videos,
    events,
    articles,
  };
}

/**
 * Trayectoria, reconocimientos y colaboraciones publicados por un administrador.
 * Los borradores (afirmaciones del brochure pendientes de confirmación) nunca se devuelven.
 */
export async function getPublishedCareerHighlightsData(): Promise<CareerHighlight[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'career-highlights',
      where: { _status: { equals: 'published' } },
      sort: 'sortOrder',
      limit: 50,
      overrideAccess: false,
      depth: 1,
    });
    return res.docs as CareerHighlight[];
  } catch (error) {
    console.warn('cms-queries: Error al obtener career-highlights:', error);
    return [];
  }
}

/**
 * Global de Shows & Booking. Los datos de management solo llegan si `publishContact` está activo
 * (control de acceso a nivel de campo).
 */
export async function getBookingData(): Promise<Booking | null> {
  try {
    const payload = await getPayload({ config });
    const booking = await payload.findGlobal({
      slug: 'booking',
      overrideAccess: false,
      depth: 1,
    });
    return booking as Booking;
  } catch (error) {
    console.warn('cms-queries: Error al obtener booking:', error);
    return null;
  }
}

/**
 * Global del Electronic Press Kit.
 */
export async function getPressKitData(): Promise<PressKit | null> {
  try {
    const payload = await getPayload({ config });
    const pressKit = await payload.findGlobal({
      slug: 'press-kit',
      overrideAccess: false,
      depth: 2,
    });
    return pressKit as PressKit;
  } catch (error) {
    console.warn('cms-queries: Error al obtener press-kit:', error);
    return null;
  }
}

/**
 * Archivo visual de shows: solo flyers y fotos en vivo marcados visibles
 * y con derechos de uso aprobados por management.
 */
export async function getShowGalleryData(): Promise<Media[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'media',
      where: {
        and: [
          { category: { in: ['event_flyer', 'live_photo'] } },
          { 'gallery.visible': { equals: true } },
          { 'gallery.rightsStatus': { equals: 'approved' } },
        ],
      },
      sort: 'gallery.sortOrder',
      limit: 40,
      overrideAccess: false,
    });
    return res.docs as Media[];
  } catch (error) {
    console.warn('cms-queries: Error al obtener la galería de shows:', error);
    return [];
  }
}

// Aliases para consumo idiomático en tests y vistas
export const getArtistProfile = getArtistProfileData;
export const getSiteSettings = getSiteSettingsData;
export const getPublishedReleases = getPublishedReleasesData;
export const getPublishedVideos = getPublishedVideosData;
export const getPublishedEvents = getPublishedEventsData;
export const getPublishedArticles = getPublishedArticlesData;
export const getPublishedCareerHighlights = getPublishedCareerHighlightsData;
export const getShowGallery = getShowGalleryData;
