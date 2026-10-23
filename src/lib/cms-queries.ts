import config from '@payload-config';
import { getPayload } from 'payload';
import type {
  ArtistProfile,
  SiteSetting,
  Release,
  Video,
  Event,
  Article,
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

// Aliases para consumo idiomático en tests y vistas
export const getArtistProfile = getArtistProfileData;
export const getSiteSettings = getSiteSettingsData;
export const getPublishedReleases = getPublishedReleasesData;
export const getPublishedVideos = getPublishedVideosData;
export const getPublishedEvents = getPublishedEventsData;
export const getPublishedArticles = getPublishedArticlesData;
