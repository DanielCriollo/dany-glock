import type { GlobalConfig } from 'payload';
import { anyone, authenticated } from '@/access';
import { revalidateGlobalAfterChange } from '@/lib/revalidate';

/**
 * Electronic Press Kit. La versión web compone datos ya publicados
 * (biografía, lanzamientos, videos, trayectoria, show). La versión descargable
 * queda preparada mediante `downloadablePdf` + `downloadStatus`.
 */
export const PressKit: GlobalConfig = {
  slug: 'press-kit',
  label: 'Electronic Press Kit (EPK)',
  admin: {
    group: 'Configuración Artística',
    description: 'Dossier para promotores y medios. Solo muestra contenido publicado y verificado.',
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange('press-kit')],
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'isPublic',
      type: 'checkbox',
      label: 'Página /epk visible públicamente',
      defaultValue: false,
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Titular del EPK',
      defaultValue: 'Electronic Press Kit',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Introducción para promotores y medios',
    },
    {
      name: 'bioVariant',
      type: 'select',
      label: 'Biografía a mostrar',
      defaultValue: 'medium',
      options: [
        { label: 'Corta', value: 'short' },
        { label: 'Mediana', value: 'medium' },
      ],
    },
    {
      name: 'pressPhotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Fotografías de prensa (alta resolución, con crédito)',
    },
    {
      name: 'featuredReleases',
      type: 'relationship',
      relationTo: 'releases',
      hasMany: true,
      label: 'Lanzamientos destacados (vacío = todos los publicados)',
    },
    {
      name: 'featuredVideos',
      type: 'relationship',
      relationTo: 'videos',
      hasMany: true,
      label: 'Videoclips destacados (vacío = los más recientes)',
    },
    {
      name: 'includeShowInfo',
      type: 'checkbox',
      label: 'Incluir ficha del show (global Shows & Booking)',
      defaultValue: true,
    },
    {
      name: 'downloadStatus',
      type: 'select',
      label: 'Versión descargable',
      defaultValue: 'not_available',
      options: [
        { label: 'No disponible', value: 'not_available' },
        { label: 'En preparación', value: 'in_preparation' },
        { label: 'Disponible', value: 'available' },
      ],
    },
    {
      name: 'downloadablePdf',
      type: 'upload',
      relationTo: 'media',
      label: 'EPK descargable (PDF)',
    },
  ],
};
