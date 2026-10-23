import type { CollectionConfig } from 'payload';
import { anyone, authenticated } from '@/access';

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'fullName',
    group: 'Administración',
    defaultColumns: ['fullName', 'email', 'subjectType', 'status', 'createdAt'],
    description: 'Solicitudes privadas de contratación (Booking), prensa y colaboraciones recibidas desde la web.',
  },
  access: {
    // Seguridad Crítica: Solo usuarios autenticados pueden leer o listar mensajes
    read: authenticated,
    // Permite que formularios públicos de contacto creen solicitudes
    create: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Nombre Completo del Contacto',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo Electrónico de Contacto',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Número Telefónico / WhatsApp (Opcional)',
    },
    {
      name: 'subjectType',
      type: 'select',
      label: 'Motivo del Contacto',
      required: true,
      defaultValue: 'booking_event',
      options: [
        { label: 'Contratación para Concierto / Show (Booking)', value: 'booking_event' },
        { label: 'Prensa, Medios y Entrevistas (Press & Media)', value: 'press_media' },
        { label: 'Alianza de Marca / Patrocinio (Brand Partnership)', value: 'brand_partnership' },
        { label: 'Otro Asunto Profesional', value: 'other' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mensaje Detallado de la Solicitud',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado Interno de Gestión',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Nuevo (Sin Responder)', value: 'new' },
        { label: 'En Contacto / Negociación', value: 'contacted' },
        { label: 'Archivado / Concluido', value: 'archived' },
      ],
      access: {
        read: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
      },
    },
  ],
};
