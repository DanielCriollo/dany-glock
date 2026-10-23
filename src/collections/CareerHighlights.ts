import type { CollectionConfig } from 'payload';
import { authenticated, authenticatedOrPublished } from '@/access';
import { verificationField } from '@/fields/verification';

/**
 * Trayectoria, reconocimientos, colaboraciones y escenarios compartidos.
 * Una sola colección tipada por `category` para no duplicar estructuras.
 * Regla editorial: "Escenario compartido" NO equivale a "Colaboración musical".
 */
export const CareerHighlights: CollectionConfig = {
  slug: 'career-highlights',
  labels: {
    singular: 'Hito de Trayectoria',
    plural: 'Trayectoria y Reconocimientos',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Configuración Artística',
    defaultColumns: ['title', 'category', 'year', 'sourceType', '_status'],
    description:
      'Reconocimientos, hitos, colaboraciones musicales y escenarios compartidos. Solo los registros publicados aparecen en la web; los datos no verificados se muestran con la etiqueta de su fuente.',
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
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Identificador único',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría',
      required: true,
      options: [
        { label: 'Reconocimiento / Premio', value: 'award' },
        { label: 'Hito de trayectoria', value: 'milestone' },
        { label: 'Colaboración musical (grabación conjunta)', value: 'collaboration' },
        { label: 'Escenario compartido (no implica colaboración)', value: 'shared_stage' },
        { label: 'Impacto social / Documental', value: 'social_impact' },
      ],
    },
    {
      name: 'year',
      type: 'number',
      label: 'Año (solo si consta en la fuente)',
      min: 2000,
      max: 2100,
    },
    {
      name: 'dateLabel',
      type: 'text',
      label: 'Fecha o periodo textual (opcional)',
      admin: {
        description: 'Ej.: "2024 — 2025". No inferir años a partir de flyers sin año legible.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción editorial (sin superlativos no verificables)',
    },
    {
      name: 'people',
      type: 'array',
      label: 'Artistas o entidades relacionadas',
      fields: [
        { name: 'name', type: 'text', label: 'Nombre', required: true },
        { name: 'origin', type: 'text', label: 'Origen (opcional)' },
      ],
    },
    {
      name: 'relatedRelease',
      type: 'relationship',
      relationTo: 'releases',
      label: 'Lanzamiento relacionado (opcional)',
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Enlace público de referencia (opcional)',
    },
    {
      name: 'sourceType',
      type: 'select',
      label: 'Tipo de fuente',
      required: true,
      defaultValue: 'artist_brochure',
      options: [
        { label: 'Plataforma oficial (Apple Music, YouTube…)', value: 'platform' },
        { label: 'Prensa / organización externa', value: 'press' },
        { label: 'Brochure del equipo del artista', value: 'artist_brochure' },
        { label: 'Confirmado por management', value: 'management' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Orden de aparición',
      defaultValue: 100,
    },
    verificationField,
  ],
};
