import type { CollectionConfig } from 'payload';
import { authenticated, authenticatedOrPublished } from '@/access';

export const Releases: CollectionConfig = {
  slug: 'releases',
  admin: {
    useAsTitle: 'title',
    group: 'Música',
    defaultColumns: ['title', 'type', 'releaseDate', 'featured', '_status'],
    description: 'Catálogo oficial de lanzamientos discográficos: Álbumes, EPs y Singles.',
  },
  versions: {
    drafts: true,
  },
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
        description: 'Texto normalizado para la URL (ej: los-glocks-no-lloran).',
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Portada Oficial (Cover Artwork)',
      required: true,
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
      label: 'Descripción / Manifiesto del Lanzamiento',
    },
    {
      name: 'catalogNumber',
      type: 'text',
      label: 'Número de Catálogo Oficial (Opcional)',
      admin: {
        placeholder: 'ej: DG-2026-001',
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
          name: 'tidal',
          type: 'text',
          label: 'Tidal URL',
        },
      ],
    },
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
