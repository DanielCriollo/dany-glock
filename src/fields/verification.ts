import type { Field } from 'payload';

/**
 * Grupo reutilizable de trazabilidad de fuente. Se añade a Releases, Tracks,
 * Videos y Events para que cada dato publicado en el CMS indique si es un hecho
 * verificado, un dato por confirmar o una propuesta editorial.
 * `notes` es solo visible para usuarios autenticados (no sale en la API pública).
 */
export const verificationField: Field = {
  name: 'verification',
  type: 'group',
  label: 'Trazabilidad y verificación de la fuente',
  admin: {
    description:
      'Indica el origen del dato. Solo "Verificado" debe presentarse como hecho. No se publican inferencias como datos confirmados.',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Estado de verificación',
      defaultValue: 'to_confirm',
      options: [
        { label: 'Verificado (fuente primaria/plataforma)', value: 'verified' },
        { label: 'Por confirmar', value: 'to_confirm' },
        { label: 'Propuesta editorial (pendiente de aprobación)', value: 'editorial_proposal' },
      ],
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'URL de la fuente',
    },
    {
      name: 'consultedAt',
      type: 'date',
      label: 'Fecha de consulta',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas internas (no públicas)',
      access: {
        read: ({ req: { user } }) => Boolean(user),
      },
    },
  ],
};
