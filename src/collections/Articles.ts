import type { CollectionConfig } from 'payload';
import { authenticated, authenticatedOrPublished } from '@/access';
import { verificationField } from '@/fields/verification';
import { revalidationHooks } from '@/lib/revalidate';

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    group: 'Gira y Prensa',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    description: 'Diario del artista, notas de prensa, comunicados editoriales y entrevistas.',
  },
  versions: {
    drafts: true,
  },
  hooks: revalidationHooks('articles'),
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
      label: 'Título del Artículo / Comunicado',
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
      name: 'category',
      type: 'select',
      label: 'Categoría Editorial',
      required: true,
      defaultValue: 'news',
      options: [
        { label: 'Noticia Oficial (News)', value: 'news' },
        { label: 'Nota Editorial (Editorial)', value: 'editorial' },
        { label: 'Entrevista Exclusiva (Interview)', value: 'interview' },
        { label: 'Comunicado de Prensa (Press Release)', value: 'press_release' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de Publicación',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen Principal del Artículo (Hero Image)',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Extracto / Resumen Corto (Meta descripción)',
      required: true,
      admin: {
        description: 'Texto introductorio de 1-2 párrafos para tarjetas y motores de búsqueda.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Cuerpo del Artículo (Contenido Enriquecido)',
      required: true,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Metadatos SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Título SEO',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Descripción SEO',
        },
      ],
    },
    verificationField,
  ],
};
