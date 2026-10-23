import type { CollectionConfig } from 'payload';
import { anyone, authenticated } from '@/access';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'eventName',
    group: 'Gira y Prensa',
    defaultColumns: ['eventName', 'city', 'venue', 'date', 'ticketStatus'],
    description: 'Conciertos en vivo, festivales internacionales y fechas de gira.',
  },
  access: {
    read: anyone,
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
        placeholder: 'ej: Dany Glock Live — Pepsi Center WTC',
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
    },
    {
      name: 'country',
      type: 'text',
      label: 'País',
      required: true,
      defaultValue: 'Guatemala',
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Recinto / Venue',
      required: true,
      admin: {
        placeholder: 'ej: Fórum Majadas, Ciudad de Guatemala',
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
      name: 'additionalInfo',
      type: 'textarea',
      label: 'Información Adicional (Restricciones de edad, accesos, etc.)',
    },
  ],
};
