import type { CollectionConfig } from 'payload';
import { authenticated, authenticatedOrPublished } from '@/access';
import { verificationField } from '@/fields/verification';
import { revalidationHooks } from '@/lib/revalidate';

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    group: 'Audiovisual',
    defaultColumns: ['title', 'type', 'youtubeId', 'releaseDate', 'featured', '_status'],
    description: 'Videoclips oficiales, directos, visualizers y contenido audiovisual.',
  },
  versions: {
    drafts: true,
  },
  hooks: revalidationHooks('videos'),
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título del Video / Producción',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo de Contenido Audiovisual',
      required: true,
      defaultValue: 'official_music_video',
      options: [
        { label: 'Videoclip Oficial (Official Music Video)', value: 'official_music_video' },
        { label: 'Trailer / Teaser Oficial', value: 'trailer' },
        { label: 'Sesión en Vivo (Live Session)', value: 'live_session' },
        { label: 'Visualizer Oficial', value: 'visualizer' },
        { label: 'Detrás de Escenas (Behind The Scenes)', value: 'behind_the_scenes' },
      ],
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'URL de YouTube',
      required: true,
      admin: {
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'youtubeId',
      type: 'text',
      label: 'ID de YouTube (11 caracteres)',
      admin: {
        placeholder: 'ej: kcac_CIFJ7k',
        description: 'Identificador único de 11 caracteres del video en YouTube para embeds y miniaturas.',
      },
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duración (mm:ss)',
      admin: {
        placeholder: 'ej: 3:20',
      },
    },
    {
      name: 'customThumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Miniatura Cinematográfica Personalizada (Opcional)',
      admin: {
        description: 'Póster de alta definición para anular la miniatura automática de YouTube.',
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      label: 'Fecha de Estreno',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'relatedTrack',
      type: 'relationship',
      relationTo: 'tracks',
      label: 'Canción Vinculada (Opcional)',
    },
    {
      name: 'director',
      type: 'text',
      label: 'Director del Video',
    },
    {
      name: 'cinematographer',
      type: 'text',
      label: 'Director de Fotografía / Cinematógrafo',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción / Ficha Editorial del Video',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar como video principal en sección Audiovisual',
      defaultValue: false,
    },
    verificationField,
  ],
};
