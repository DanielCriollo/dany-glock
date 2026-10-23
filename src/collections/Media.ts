import type { CollectionConfig } from 'payload';
import { anyone, authenticated } from '@/access';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Multimedia',
    defaultColumns: ['filename', 'alt', 'category', 'isPressAsset', 'filesize', 'createdAt'],
    description: 'Imágenes optimizadas, audio previews de canciones y archivos para descarga.',
  },
  access: {
    read: anyone,
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
      ],
    },
    {
      name: 'isPressAsset',
      type: 'checkbox',
      label: 'Disponible para descarga en el Electronic Press Kit (EPK)',
      defaultValue: false,
    },
  ],
};
