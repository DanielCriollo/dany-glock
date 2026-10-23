import type { CollectionConfig } from 'payload';
import { authenticated, authenticatedOrPublished } from '@/access';
import { verificationField } from '@/fields/verification';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'eventName',
    group: 'Gira y Prensa',
    defaultColumns: ['eventName', 'city', 'venue', 'date', 'ticketStatus', '_status'],
    description: 'Conciertos en vivo, festivales internacionales y fechas de gira.',
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
      name: 'eventName',
      type: 'text',
      label: 'Nombre del Evento / Show',
      required: true,
      admin: {
        placeholder: 'ej: Dany Glock Live — Pasto Vive Flow',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL (Identificador Único)',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador para URLs y rutas del evento (ej: pasto-vive-flow-2026).',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Fecha y Hora del Evento',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'city',
      type: 'text',
      label: 'Ciudad',
      required: true,
      defaultValue: 'Pasto',
    },
    {
      name: 'country',
      type: 'text',
      label: 'País',
      required: true,
      defaultValue: 'Colombia',
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Recinto / Venue',
      required: true,
      admin: {
        placeholder: 'ej: Centro de Eventos Andino, Pasto',
      },
    },
    {
      name: 'ticketStatus',
      type: 'select',
      label: 'Estado de Entradas',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Entradas Disponibles (Comprar Tickets)', value: 'available' },
        { label: 'Agotado (Sold Out)', value: 'sold_out' },
        { label: 'Preventa Exclusiva', value: 'presale' },
        { label: 'Entrada Libre / Gratuito', value: 'free' },
        { label: 'Cancelado / Pospuesto', value: 'cancelled' },
      ],
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Enlace Oficial de Boletería (URL)',
    },
    {
      name: 'vipPackageUrl',
      type: 'text',
      label: 'Enlace a Pase VIP / Meet & Greet (Opcional)',
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Póster Oficial del Evento (Opcional)',
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Galería de Fotos del Show (Opcional)',
      admin: {
        description: 'Fotografías oficiales del show para cobertura editorial.',
      },
    },
    {
      name: 'relatedVideoUrl',
      type: 'text',
      label: 'URL de Video / Recap Relacionado (Opcional)',
      admin: {
        placeholder: 'https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'instagramPostUrl',
      type: 'text',
      label: 'URL de Publicación / Anuncio en Instagram (Opcional)',
      admin: {
        placeholder: 'https://www.instagram.com/p/...',
      },
    },
    {
      name: 'additionalInfo',
      type: 'textarea',
      label: 'Información Adicional (Restricciones de edad, accesos, etc.)',
    },
    verificationField,
  ],
};
