import type { FieldAccess, GlobalConfig } from 'payload';
import { anyone, authenticated } from '@/access';

/**
 * Los datos de contacto de management solo salen por la API pública cuando
 * un administrador marca `publishContact` tras confirmar vigencia y autorización.
 */
const contactReadAccess: FieldAccess = ({ req: { user }, siblingData }) =>
  Boolean(user) || (siblingData as { publishContact?: boolean } | undefined)?.publishContact === true;

export const Booking: GlobalConfig = {
  slug: 'booking',
  label: 'Shows & Booking',
  admin: {
    group: 'Configuración Artística',
    description:
      'Formato del espectáculo, tipos de evento y management. No incluir tarifas, disponibilidad ni requisitos técnicos sin confirmación.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'showTitle',
      type: 'text',
      label: 'Título de la sección',
      defaultValue: 'Dany Glock en vivo',
    },
    {
      name: 'showDescription',
      type: 'textarea',
      label: 'Descripción del espectáculo',
    },
    {
      name: 'specsStatus',
      type: 'select',
      label: 'Estado de las especificaciones',
      required: true,
      defaultValue: 'declared',
      options: [
        { label: 'Declaradas por el equipo — sujetas a confirmación', value: 'declared' },
        { label: 'Confirmadas por management', value: 'confirmed' },
      ],
    },
    {
      name: 'specs',
      type: 'group',
      label: 'Especificaciones del show',
      fields: [
        { name: 'duration', type: 'text', label: 'Duración' },
        { name: 'format', type: 'text', label: 'Formato' },
        { name: 'genre', type: 'text', label: 'Género' },
        { name: 'audience', type: 'text', label: 'Público objetivo' },
        { name: 'includesDancers', type: 'checkbox', label: 'Incluye bailarines', defaultValue: false },
      ],
    },
    {
      name: 'liveFeatures',
      type: 'array',
      label: 'Características del directo',
      fields: [{ name: 'text', type: 'text', label: 'Característica', required: true }],
    },
    {
      name: 'eventTypes',
      type: 'array',
      label: 'Tipos de evento',
      fields: [
        { name: 'title', type: 'text', label: 'Tipo', required: true },
        { name: 'description', type: 'textarea', label: 'Descripción' },
      ],
    },
    {
      name: 'baseLocation',
      type: 'text',
      label: 'Base de operaciones',
      defaultValue: 'Pasto, Nariño, Colombia',
    },
    {
      name: 'availabilityNote',
      type: 'text',
      label: 'Nota de cobertura (sin fechas)',
    },
    {
      name: 'quoteNote',
      type: 'textarea',
      label: 'Texto de solicitud de cotización',
    },
    {
      name: 'technicalRider',
      type: 'upload',
      relationTo: 'media',
      label: 'Rider técnico (PDF) — solo cuando esté aprobado',
    },
    {
      name: 'management',
      type: 'group',
      label: 'Management y contrataciones',
      admin: {
        description:
          'Los datos de contacto permanecen privados (solo usuarios autenticados) hasta activar "Publicar contacto".',
      },
      fields: [
        {
          name: 'publishContact',
          type: 'checkbox',
          label: 'Publicar contacto (vigencia y autorización confirmadas)',
          defaultValue: false,
        },
        { name: 'name', type: 'text', label: 'Nombre', access: { read: contactReadAccess } },
        { name: 'role', type: 'text', label: 'Rol', access: { read: contactReadAccess } },
        { name: 'email', type: 'email', label: 'Correo de contrataciones', access: { read: contactReadAccess } },
        { name: 'whatsapp', type: 'text', label: 'WhatsApp', access: { read: contactReadAccess } },
        {
          name: 'confirmedAt',
          type: 'date',
          label: 'Fecha de confirmación con el management',
          admin: { date: { pickerAppearance: 'dayOnly' } },
          access: { read: contactReadAccess },
        },
        {
          name: 'sourceNote',
          type: 'textarea',
          label: 'Origen del dato (interno)',
          access: { read: ({ req: { user } }) => Boolean(user) },
        },
      ],
    },
  ],
};
