import type { CollectionConfig } from 'payload';
import { authenticated, authenticatedOrPublished } from '@/access';
import { verificationField } from '@/fields/verification';
import { revalidationHooks } from '@/lib/revalidate';

export const Releases: CollectionConfig = {
  slug: 'releases',
  admin: {
    useAsTitle: 'title',
    group: 'Música',
    defaultColumns: ['title', 'type', 'artistRole', 'releaseDate', 'featured', '_status'],
    description: 'Catálogo oficial de lanzamientos discográficos: Álbumes, EPs y Singles.',
  },
  versions: {
    drafts: true,
  },
  hooks: revalidationHooks('releases'),
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
      label: 'Título del Lanzamiento',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL (Identificador Único)',
      required: true,
      unique: true,
      admin: {
        description: 'Texto normalizado para la URL (ej: sig-sauer).',
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo de Lanzamiento',
      required: true,
      defaultValue: 'single',
      options: [
        { label: 'Single / Sencillo', value: 'single' },
        { label: 'EP (Extended Play)', value: 'ep' },
        { label: 'Álbum de Estudio', value: 'album' },
      ],
    },
    {
      name: 'artistRole',
      type: 'select',
      label: 'Rol de Dany Glock en el Lanzamiento',
      defaultValue: 'main',
      options: [
        { label: 'Artista Principal (Lead Artist)', value: 'main' },
        { label: 'Artista Invitado (Featured Artist)', value: 'featured' },
        { label: 'Colaborador / Co-autor', value: 'collaborator' },
      ],
      admin: {
        description: 'Distingue lanzamientos donde Dany Glock es el artista principal de colaboraciones como invitado.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Portada Oficial (Cover Artwork)',
      required: true,
    },
    {
      name: 'coverStatus',
      type: 'select',
      label: 'Estado del Arte de Portada',
      defaultValue: 'confirmed',
      options: [
        { label: 'Portada Oficial Confirmada', value: 'confirmed' },
        { label: 'Pendiente de Aprobación / Material Oficial', value: 'pending' },
        { label: 'Placeholder Visual Temporal', value: 'placeholder' },
      ],
    },
    {
      name: 'releaseDate',
      type: 'date',
      label: 'Fecha de Lanzamiento',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción / Ficha Editorial del Lanzamiento',
    },
    {
      name: 'catalogNumber',
      type: 'text',
      label: 'Número de Catálogo / Código Oficial (Opcional)',
      admin: {
        placeholder: 'ej: DG-2024-001',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar en la portada principal (Hero / Showcase)',
      defaultValue: false,
    },
    {
      name: 'streamingLinks',
      type: 'group',
      label: 'Enlaces de Streaming Oficiales',
      fields: [
        {
          name: 'spotify',
          type: 'text',
          label: 'Spotify URL',
        },
        {
          name: 'spotifyEmbedUrl',
          type: 'text',
          label: 'Spotify Embed URL / URI (Opcional)',
        },
        {
          name: 'appleMusic',
          type: 'text',
          label: 'Apple Music URL',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube Music / Video URL',
        },
        {
          name: 'amazonMusic',
          type: 'text',
          label: 'Amazon Music URL',
        },
        {
          name: 'tidal',
          type: 'text',
          label: 'Tidal URL',
        },
      ],
    },
    verificationField,
    {
      name: 'seo',
      type: 'group',
      label: 'Metadatos SEO y OpenGraph',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Título SEO para Buscadores',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Descripción SEO',
        },
      ],
    },
  ],
};
