import type { GlobalConfig } from 'payload';
import { anyone, authenticated } from '@/access';

export const ArtistProfile: GlobalConfig = {
  slug: 'artist-profile',
  label: 'Perfil del Artista',
  admin: {
    group: 'Configuración Artística',
    description: 'Biografía oficial en 3 formatos, manifiesto y datos de identidad del artista.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'stageName',
      type: 'text',
      label: 'Nombre Artístico Oficial',
      required: true,
      defaultValue: 'Dany Glock',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Lema / Tagline Editorial',
      defaultValue: 'Artist Digital Experience — Dark Cinematic Editorial',
    },
    {
      name: 'manifesto',
      type: 'textarea',
      label: 'Manifiesto Artístico',
      defaultValue:
        'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el altiplano de Guatemala y proyectada a la escena global.',
    },
    {
      name: 'shortBio',
      type: 'textarea',
      label: 'Biografía Corta (~50 palabras — Redes y Fichas de Festivales)',
      admin: {
        description: 'Usada en tarjetas de vista rápida, metadatos y programas de prensa.',
      },
      defaultValue:
        'Dany Glock es un artista de música urbana originario de Quetzaltenango, Guatemala. Su propuesta combina trap contemporáneo, reggaetón de autor y una estética visual nocturna de alto impacto cinematográfico.',
    },
    {
      name: 'mediumBio',
      type: 'textarea',
      label: 'Biografía Mediana (~150 palabras — Home y Reseñas)',
      admin: {
        description: 'Usada en la sección Bio de la página principal.',
      },
      defaultValue:
        'Originario de Quetzaltenango, Guatemala, Dany Glock ha consolidado una propuesta musical y visual que redefine el género urbano centroamericano. A través de una estética oscura, elegante y editorial, su trabajo fusiona letras introspectivas con producción de clase mundial.',
    },
    {
      name: 'fullBio',
      type: 'richText',
      label: 'Biografía Completa Oficial (Sección Editorial / Bio)',
    },
    {
      name: 'origin',
      type: 'group',
      label: 'Origen del Artista',
      fields: [
        {
          name: 'city',
          type: 'text',
          label: 'Ciudad de Origen',
          defaultValue: 'Quetzaltenango',
        },
        {
          name: 'country',
          type: 'text',
          label: 'País de Origen',
          defaultValue: 'Guatemala',
        },
      ],
    },
  ],
};
