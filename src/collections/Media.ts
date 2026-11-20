import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload';
import type { Access, Where } from 'payload';
import type { Media as MediaDoc } from '@/payload-types';
import { authenticated } from '@/access';
import { purgeNextImageCache, revalidationHooks } from '@/lib/revalidate';

const RESTRICTED_CATEGORIES = new Set(['event_flyer', 'live_photo']);

/**
 * Visitantes anónimos: todo excepto flyers y fotos en vivo sin derechos aprobados. Los flyers
 * son piezas de terceros (promotores, venues) con teléfonos y direcciones: tener el archivo no
 * autoriza a publicarlo. Payload aplica esta regla también a `/api/media/file/*`.
 */
export const publicMediaRead: Access = ({ req: { user } }) => {
  if (user) return true;
  const notRestricted: Where = { category: { not_in: ['event_flyer', 'live_photo'] } };
  const approved: Where = { 'gallery.rightsStatus': { equals: 'approved' } };
  return { or: [notRestricted, approved] };
};

/**
 * Si un flyer o foto en vivo deja de estar aprobado (o se elimina), purga `.next/cache/images`
 * para que `/_next/image` no pueda seguir sirviendo una copia previa tras el 403 del origen.
 */
const purgeRestrictedImageCacheAfterChange: CollectionAfterChangeHook<MediaDoc> = ({ doc, previousDoc }) => {
  const isRestricted = RESTRICTED_CATEGORIES.has(doc.category);
  const wasApproved = previousDoc?.gallery?.rightsStatus === 'approved';
  const isApproved = doc.gallery?.rightsStatus === 'approved';
  if (isRestricted && wasApproved && !isApproved) {
    purgeNextImageCache();
  }
  return doc;
};

const purgeRestrictedImageCacheAfterDelete: CollectionAfterDeleteHook<MediaDoc> = ({ doc }) => {
  if (RESTRICTED_CATEGORIES.has(doc.category)) {
    purgeNextImageCache();
  }
  return doc;
};

const mediaRevalidation = revalidationHooks('media');

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Multimedia',
    defaultColumns: ['filename', 'alt', 'category', 'isPressAsset', 'filesize', 'createdAt'],
    description: 'Imágenes optimizadas, audio previews de canciones y archivos para descarga.',
  },
  hooks: {
    afterChange: [purgeRestrictedImageCacheAfterChange, ...mediaRevalidation.afterChange],
    afterDelete: [purgeRestrictedImageCacheAfterDelete, ...mediaRevalidation.afterDelete],
  },
  access: {
    read: publicMediaRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'application/pdf',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
        position: 'centre',
      },
      {
        name: 'card',
        width: 640,
        height: 640,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo (Accesibilidad & SEO)',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Pie de Foto / Descripción',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría del Archivo',
      required: true,
      defaultValue: 'artwork',
      options: [
        { label: 'Portada de Álbum / Single (Artwork)', value: 'artwork' },
        { label: 'Sesión Fotográfica (Photo Shoot)', value: 'photo_shoot' },
        { label: 'Fotografía de Prensa (Press Photo)', value: 'press_photo' },
        { label: 'Audio Preview (Muestra de audio)', value: 'audio_preview' },
        { label: 'Documento / Press Kit PDF', value: 'document' },
        { label: 'Flyer de Evento (Archivo histórico)', value: 'event_flyer' },
        { label: 'Fotografía en Vivo (Show)', value: 'live_photo' },
      ],
    },
    {
      name: 'isPressAsset',
      type: 'checkbox',
      label: 'Disponible para descarga en el Electronic Press Kit (EPK)',
      defaultValue: false,
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Crédito (fotógrafo / diseñador / promotor)',
    },
    {
      name: 'gallery',
      type: 'group',
      label: 'Archivo visual de shows',
      admin: {
        description:
          'Solo se muestra en la galería pública si "Visible en galería" está activo y los derechos de uso están aprobados. Transcribir únicamente datos legibles; no inferir años ni lugares.',
      },
      fields: [
        {
          name: 'visible',
          type: 'checkbox',
          label: 'Visible en galería pública',
          defaultValue: false,
        },
        {
          name: 'rightsStatus',
          type: 'select',
          label: 'Derechos de uso',
          defaultValue: 'pending',
          options: [
            { label: 'Pendiente de aprobación', value: 'pending' },
            { label: 'Aprobado por management', value: 'approved' },
            { label: 'Requiere consentimiento de terceros', value: 'third_party_consent' },
          ],
        },
        { name: 'eventLabel', type: 'text', label: 'Evento (texto legible)' },
        { name: 'dateLabel', type: 'text', label: 'Fecha (tal como aparece)' },
        { name: 'venueLabel', type: 'text', label: 'Lugar (tal como aparece)' },
        {
          name: 'sortOrder',
          type: 'number',
          label: 'Orden en galería',
          defaultValue: 100,
        },
      ],
    },
  ],
};
