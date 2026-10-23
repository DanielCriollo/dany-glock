import type { GlobalConfig } from 'payload';
import { anyone, authenticated } from '@/access';
import { verificationField } from '@/fields/verification';

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
      defaultValue: 'Música urbana, trap latino y estética nocturna desde Pasto, Colombia.',
    },
    {
      name: 'heroDesktopMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Visual Principal del Hero (Desktop — 16:9, recomendado 1920×1080)',
      admin: {
        description: 'Imagen fotográfica o visual oficial del artista para pantallas de escritorio.',
      },
    },
    {
      name: 'heroMobileMedia',
      type: 'upload',
      relationTo: 'media',
      label: 'Visual del Hero (Móvil — 9:16, recomendado 1080×1920)',
      admin: {
        description: 'Fotografía o encuadre vertical oficial para dispositivos móviles.',
      },
    },
    {
      name: 'heroVideoUrl',
      type: 'text',
      label: 'Video o Loop de Fondo del Hero (Opcional)',
      admin: {
        description: 'URL directa a un archivo de video MP4 o WebM (silenciado, en bucle). Los enlaces de YouTube no se reproducen como fondo.',
      },
    },
    {
      name: 'portraitImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografía Vertical del Artista (Sección Biografía — 4:5, recomendado 1600×2000)',
      admin: {
        description: 'Retrato oficial para la sección editorial de biografía.',
      },
    },
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Título Principal del Hero',
      defaultValue: 'Dany Glock',
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      label: 'Subtítulo del Hero',
      defaultValue: 'Trap Latino & Sonido Nocturno',
    },
    {
      name: 'heroCtaPrimary',
      type: 'text',
      label: 'Texto CTA Principal del Hero',
      defaultValue: 'Explorar Discografía',
    },
    {
      name: 'heroCtaSecondary',
      type: 'text',
      label: 'Texto CTA Secundario del Hero',
      defaultValue: 'Videografía Oficial',
    },
    {
      name: 'bioStatus',
      type: 'select',
      label: 'Estado de Aprobación de la Biografía',
      defaultValue: 'editorial_draft',
      options: [
        { label: 'Propuesta Editorial (Borrador pendiente de aprobación)', value: 'editorial_draft' },
        { label: 'Aprobado Oficialmente por el Artista', value: 'approved' },
      ],
      admin: {
        description: 'Indica si la biografía ha sido revisada y confirmada directamente por el artista o su management.',
      },
    },
    {
      name: 'manifesto',
      type: 'textarea',
      label: 'Manifiesto Artístico',
      defaultValue:
        'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el sur de Colombia y proyectada a la escena global.',
    },
    {
      name: 'shortBio',
      type: 'textarea',
      label: 'Biografía Corta (~50 palabras — Redes y Fichas de Festivales)',
      admin: {
        description: 'Usada en tarjetas de vista rápida, metadatos y programas de prensa.',
      },
      defaultValue:
        'Dany Glock es un artista de música urbana originario de Pasto, Nariño, Colombia. Su propuesta combina trap contemporáneo, identidad lírica y una estética visual nocturna de alto impacto cinematográfico.',
    },
    {
      name: 'mediumBio',
      type: 'textarea',
      label: 'Biografía Mediana (~150 palabras — Home y Reseñas)',
      admin: {
        description: 'Usada en la sección Bio de la página principal.',
      },
      defaultValue:
        'Originario de Pasto, Nariño, Colombia, Dany Glock ha consolidado una propuesta musical y visual que redefine el género urbano latino. A través de una estética oscura, elegante y editorial, su trabajo fusiona letras introspectivas con producción de primer nivel.',
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
          defaultValue: 'Pasto',
        },
        {
          name: 'country',
          type: 'text',
          label: 'País de Origen',
          defaultValue: 'Colombia',
        },
      ],
    },
    {
      name: 'translations',
      type: 'group',
      label: 'Traducciones Internacionales',
      fields: [
        {
          name: 'en',
          type: 'group',
          label: 'Versión en Inglés (English Version)',
          fields: [
            {
              name: 'status',
              type: 'select',
              label: 'Estado de la Traducción',
              defaultValue: 'draft_pending_review',
              options: [
                { label: 'Borrador Editorial en Inglés (Draft Pending Review)', value: 'draft_pending_review' },
                { label: 'Aprobado (Approved)', value: 'approved' },
              ],
            },
            {
              name: 'shortBio',
              type: 'textarea',
              label: 'Short Bio (English)',
              defaultValue:
                'Dany Glock is an urban music and Latin trap artist from Pasto, Colombia. His sonic vision merges nocturnal storytelling with a dark, high-impact cinematic editorial aesthetic.',
            },
            {
              name: 'mediumBio',
              type: 'textarea',
              label: 'Medium Bio (English)',
              defaultValue:
                'Hailing from Pasto, Nariño, Colombia, Dany Glock brings a distinct and sophisticated perspective to contemporary Latin urban music. Anchored by heavy atmospheric beats and introspective lyrics, his work defines a dark cinematic visual and sonic experience.',
            },
          ],
        },
      ],
    },
    verificationField,
  ],
};
