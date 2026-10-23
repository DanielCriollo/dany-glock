import type { GlobalConfig } from 'payload';
import { anyone, authenticated } from '@/access';
import { verificationField } from '@/fields/verification';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configuración General',
  admin: {
    group: 'Configuración Artística',
    description: 'Redes sociales, correos de contacto profesional y metadatos globales del sitio.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      label: 'Título General del Sitio',
      required: true,
      defaultValue: 'Dany Glock — Official Artist Experience',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Descripción Global para Buscadores (Meta Description)',
      defaultValue:
        'Plataforma oficial de Dany Glock: música urbana, discografía, lanzamientos, videografía cinematográfica y fechas de conciertos.',
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Perfiles Oficiales en Redes y Streaming',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
          defaultValue: 'https://www.instagram.com/danyglock_/',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'Canal de YouTube Oficial',
          defaultValue: 'https://www.youtube.com/@danyglock',
        },
        {
          name: 'youtubeChannelId',
          type: 'text',
          label: 'ID del Canal de YouTube Oficial',
          defaultValue: 'UCf-4AJMV8QZz1jj4OVBzaxg',
        },
        {
          name: 'appleMusic',
          type: 'text',
          label: 'Apple Music Artist URL',
          defaultValue: 'https://music.apple.com/us/artist/dany-glock/1739565666',
        },
        {
          name: 'spotify',
          type: 'text',
          label: 'Spotify Artist URL (Opcional - Pendiente de verificación)',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok URL (Opcional)',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'X / Twitter URL (Opcional)',
        },
      ],
    },
    {
      name: 'contactEmails',
      type: 'group',
      label: 'Correos Electrónicos Profesionales',
      admin: {
        description: 'Correos oficiales de contacto. Solo publicar cuando hayan sido confirmados por el management.',
      },
      fields: [
        { name: 'booking', type: 'email', label: 'Correo de Booking / Contrataciones' },
        { name: 'press', type: 'email', label: 'Correo de Prensa & Media' },
        { name: 'management', type: 'email', label: 'Correo de Management General' },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Texto de Derechos de Autor (Footer)',
      defaultValue: '© 2026 Dany Glock. Todos los derechos reservados.',
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      label: 'Activar Modo Mantenimiento en la Web Pública',
      defaultValue: false,
    },
    verificationField,
  ],
};
