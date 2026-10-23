import type { CollectionConfig } from 'payload';
import { anyone, authenticated } from '@/access';
import { verificationField } from '@/fields/verification';

export const Tracks: CollectionConfig = {
  slug: 'tracks',
  admin: {
    useAsTitle: 'title',
    group: 'Música',
    defaultColumns: ['trackNumber', 'title', 'release', 'artistRole', 'duration', 'featured'],
    description: 'Canciones individuales, metadata técnica, letras oficiales y audio preview.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Canción',
      required: true,
    },
    {
      name: 'release',
      type: 'relationship',
      relationTo: 'releases',
      label: 'Lanzamiento / Álbum al que pertenece',
      required: true,
      admin: {
        description: 'Asocia esta pista a un single, EP o álbum oficial.',
      },
    },
    {
      name: 'artistRole',
      type: 'select',
      label: 'Rol de Dany Glock en la Pista',
      defaultValue: 'main',
      options: [
        { label: 'Artista Principal (Lead Artist)', value: 'main' },
        { label: 'Artista Invitado (Featured Artist)', value: 'featured' },
        { label: 'Colaborador / Co-autor', value: 'collaborator' },
      ],
      admin: {
        description: 'Distingue pistas donde Dany Glock es artista principal o invitado.',
      },
    },
    {
      name: 'trackNumber',
      type: 'number',
      label: 'Número de Pista',
      required: true,
      defaultValue: 1,
      min: 1,
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duración (Formato mm:ss)',
      required: true,
      admin: {
        placeholder: 'ej: 3:28',
      },
    },
    {
      name: 'audioPreview',
      type: 'upload',
      relationTo: 'media',
      label: 'Archivo de Audio Preview (MP3/WAV)',
      admin: {
        description: 'Muestra de 30-60 segundos para el reproductor flotante inercial.',
      },
    },
    {
      name: 'appleMusicUrl',
      type: 'text',
      label: 'URL de Apple Music de la Pista (Opcional)',
      admin: {
        placeholder: 'https://music.apple.com/...',
      },
    },
    {
      name: 'featuredArtists',
      type: 'text',
      label: 'Artistas Invitados (Features)',
      admin: {
        placeholder: 'ej: feat. Artista Invitado',
      },
    },
    {
      name: 'credits',
      type: 'group',
      label: 'Créditos de Producción y Composición',
      fields: [
        {
          name: 'producers',
          type: 'text',
          label: 'Productores Musicales',
        },
        {
          name: 'composers',
          type: 'text',
          label: 'Compositores / Letristas',
        },
        {
          name: 'mixing',
          type: 'text',
          label: 'Ingeniero de Mezcla',
        },
        {
          name: 'mastering',
          type: 'text',
          label: 'Ingeniero de Mastering',
        },
      ],
    },
    {
      name: 'isrcCode',
      type: 'text',
      label: 'Código ISRC Oficial (Opcional)',
      admin: {
        placeholder: 'ej: US-S1Z-26-00001',
      },
    },
    {
      name: 'lyrics',
      type: 'textarea',
      label: 'Letra Oficial de la Canción',
      admin: {
        description: 'Texto completo de la letra con saltos de estrofa para la vista de detalle.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar como pista principal / Top Track',
      defaultValue: false,
    },
    verificationField,
  ],
};
