import type { CollectionConfig } from 'payload';
import { anyone, authenticated } from '@/access';
import { checkRateLimit } from '@/lib/rate-limiter';

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
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          // 1. Protección Anti-Spam por Honeypot
          if (data?.websiteHoneypot) {
            throw new Error('Solicitud rechazada: actividad sospechosa detectada.');
          }

          // 2. Limitación de Tasa (Rate Limiting) por IP o correo
          // Se extrae la IP de cabeceras estándar o fallback a email
          const forwarded = req.headers?.get?.('x-forwarded-for');
          const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.headers?.get?.('x-real-ip') || 'client';
          const rateKey = `${clientIp}_${data?.email || 'anon'}`;

          const allowed = checkRateLimit(rateKey, { maxRequests: 5, windowMs: 10 * 60 * 1000 });
          if (!allowed) {
            throw new Error('Demasiadas solicitudes enviadas. Por favor espera unos minutos antes de intentar de nuevo.');
          }

          // 3. Validaciones de longitud y formato del lado servidor
          if (data?.fullName && (data.fullName.length < 2 || data.fullName.length > 100)) {
            throw new Error('El nombre completo debe tener entre 2 y 100 caracteres.');
          }

          if (data?.message && (data.message.length < 10 || data.message.length > 3000)) {
            throw new Error('El mensaje debe tener entre 10 y 3000 caracteres.');
          }

          if (data?.phone && data.phone.length > 30) {
            throw new Error('El número telefónico no puede exceder los 30 caracteres.');
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Nombre Completo del Contacto',
      required: true,
      minLength: 2,
      maxLength: 100,
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
      maxLength: 30,
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
      minLength: 10,
      maxLength: 3000,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado Interno de Gestión',
      defaultValue: 'new',
      options: [
        { label: 'Nuevo (Sin Responder)', value: 'new' },
        { label: 'En Contacto / Negociación', value: 'contacted' },
        { label: 'Archivado / Concluido', value: 'archived' },
      ],
      access: {
        read: ({ req: { user } }) => Boolean(user),
        create: ({ req: { user } }) => Boolean(user), // Restringe la creación para que anónimos no puedan inyectar status
        update: ({ req: { user } }) => Boolean(user),
      },
    },
    {
      name: 'websiteHoneypot',
      type: 'text',
      label: 'Campo de Seguridad Anti-Spam',
      admin: {
        hidden: true,
        description: 'Campo oculto para detección de bots automatizados.',
      },
    },
  ],
};
