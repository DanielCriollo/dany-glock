import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, PayloadRequest } from 'payload';
import type { Event, Media } from '@/payload-types';
import { authenticated, authenticatedOrPublished } from '@/access';
import { verificationField } from '@/fields/verification';
import { purgeNextImageCache, revalidationHooks } from '@/lib/revalidate';

/**
 * Eventos en vivo: próximos conciertos y archivo histórico («Trayectoria en escenarios»).
 *
 * - `listing` separa la agenda (`upcoming`) del archivo (`archive`). Un evento pasado sin año
 *   legible no puede tener `date`, por eso la fecha exacta es opcional y `dateLabel` conserva
 *   la fecha tal como aparece en el flyer.
 * - El flyer solo se muestra públicamente cuando el evento está publicado y `usageRights.status = approved`:
 *   disponer del archivo no equivale a tener autorización para publicarlo (piezas de promotores y terceros).
 * - Las columnas ya admiten NULL (colección con borradores); `required` se valida al publicar.
 */

const extractMediaId = (posterImage: Event['posterImage']): number | null => {
  if (!posterImage) return null;
  return typeof posterImage === 'object' ? posterImage.id : posterImage;
};

async function hasOtherApprovedEventForMedia(
  req: PayloadRequest,
  mediaId: number,
  excludeEventId: number,
): Promise<boolean> {
  const others = await req.payload.find({
    collection: 'events',
    where: {
      and: [
        { id: { not_equals: excludeEventId } },
        { posterImage: { equals: mediaId } },
        { _status: { equals: 'published' } },
        { 'usageRights.status': { equals: 'approved' } },
      ],
    },
    limit: 1,
    depth: 0,
    req,
  });
  return others.totalDocs > 0;
}

async function setFlyerMediaRights(req: PayloadRequest, mediaId: number, shouldApprove: boolean): Promise<void> {
  const media = (await req.payload
    .findByID({ collection: 'media', id: mediaId, depth: 0, req })
    .catch(() => null)) as Media | null;
  if (!media || media.category !== 'event_flyer') return;
  const current = media.gallery?.rightsStatus ?? 'pending';
  const target = shouldApprove ? 'approved' : media.gallery?.visible ? current : 'pending';
  if (current !== target) {
    await req.payload.update({
      collection: 'media',
      id: mediaId,
      data: { gallery: { ...media.gallery, rightsStatus: target } },
      req,
    });
    if (target !== 'approved') {
      purgeNextImageCache();
    }
  }
}

/**
 * Sincroniza la autorización del flyer con el archivo en Media. Los flyers (`event_flyer`) solo
 * son legibles por visitantes anónimos con derechos aprobados (ver `Media.access.read`), así que
 * publicar un evento con derechos aprobados habilita la descarga del archivo, y retirarlo, dejarlo
 * en borrador o revocar derechos la vuelve a bloquear.
 * No toca flyers visibles en la galería de /booking, que tienen su propia aprobación.
 */
export const syncFlyerRights: CollectionAfterChangeHook<Event> = async ({ doc, previousDoc, req }) => {
  const mediaId = extractMediaId(doc.posterImage);
  const previousMediaId = extractMediaId(previousDoc?.posterImage);

  if (previousMediaId && previousMediaId !== mediaId) {
    const stillApprovedElsewhere = await hasOtherApprovedEventForMedia(req, previousMediaId, doc.id);
    if (!stillApprovedElsewhere) {
      await setFlyerMediaRights(req, previousMediaId, false);
    }
  }

  if (!mediaId) return doc;
  const approved = doc._status === 'published' && doc.usageRights?.status === 'approved';
  if (approved) {
    await setFlyerMediaRights(req, mediaId, true);
  } else {
    const stillApprovedElsewhere = await hasOtherApprovedEventForMedia(req, mediaId, doc.id);
    if (!stillApprovedElsewhere) {
      await setFlyerMediaRights(req, mediaId, false);
    }
  }
  return doc;
};

export const revokeFlyerRightsOnDelete: CollectionAfterDeleteHook<Event> = async ({ doc, req }) => {
  const mediaId = extractMediaId(doc.posterImage);
  if (!mediaId) return doc;
  const stillApprovedElsewhere = await hasOtherApprovedEventForMedia(req, mediaId, doc.id);
  if (!stillApprovedElsewhere) {
    await setFlyerMediaRights(req, mediaId, false);
  }
  return doc;
};

const eventRevalidation = revalidationHooks('events');

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'eventName',
    group: 'Gira y Prensa',
    defaultColumns: ['eventName', 'listing', 'dateLabel', 'city', 'venue', 'usageRights.status', '_status'],
    description:
      'Próximos conciertos y archivo histórico de presentaciones. Solo se publican eventos verificados; el flyer requiere derechos aprobados.',
  },
  defaultSort: 'sortOrder',
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [syncFlyerRights, ...eventRevalidation.afterChange],
    afterDelete: [revokeFlyerRightsOnDelete, ...eventRevalidation.afterDelete],
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
      name: 'listing',
      type: 'select',
      label: 'Sección pública',
      required: true,
      defaultValue: 'upcoming',
      options: [
        { label: 'Próximo concierto (agenda)', value: 'upcoming' },
        { label: 'Evento anterior (Trayectoria en escenarios)', value: 'archive' },
      ],
      admin: {
        position: 'sidebar',
        description: 'La agenda solo muestra fechas futuras; el archivo muestra presentaciones ya realizadas.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Orden de visualización (archivo)',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Menor número = aparece antes. Se usa cuando no hay fecha exacta.',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Fecha y hora exactas',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description:
          'Obligatoria para la agenda. En el archivo, completar solo si el año está confirmado; si no, usar "Fecha tal como aparece".',
      },
      validate: (value, { siblingData }) => {
        const listing = (siblingData as { listing?: string } | undefined)?.listing;
        if (listing !== 'archive' && !value) {
          return 'La fecha exacta es obligatoria para los próximos conciertos.';
        }
        return true;
      },
    },
    {
      name: 'dateLabel',
      type: 'text',
      label: 'Fecha tal como aparece en el flyer',
      admin: {
        placeholder: 'ej: Sábado 15 de junio',
        description: 'Transcribir sin inferir el año.',
      },
    },
    {
      name: 'city',
      type: 'text',
      label: 'Ciudad',
      admin: {
        description: 'Dejar vacío si la ciudad no está confirmada.',
      },
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
      admin: {
        placeholder: 'ej: Centro de Eventos Andino, Pasto',
        description: 'Nombre del lugar. No publicar direcciones ni teléfonos de terceros.',
      },
    },
    {
      name: 'artistRole',
      type: 'select',
      label: 'Participación de Dany Glock',
      defaultValue: 'unspecified',
      options: [
        { label: 'Artista principal / show central', value: 'headliner' },
        { label: 'Invitado especial', value: 'special_guest' },
        { label: 'Telonero oficial', value: 'opening_act' },
        { label: 'Parte del cartel', value: 'lineup' },
        { label: 'Lanzamiento / estreno', value: 'release_event' },
        { label: 'Sin especificar', value: 'unspecified' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Descripción breve (pública)',
      maxLength: 280,
      admin: {
        description: 'Solo datos visibles en el flyer o confirmados por el equipo. Sin teléfonos, precios ni direcciones.',
      },
    },
    {
      name: 'ticketStatus',
      type: 'select',
      label: 'Estado de Entradas',
      defaultValue: 'available',
      options: [
        { label: 'Entradas Disponibles (Comprar Tickets)', value: 'available' },
        { label: 'Agotado (Sold Out)', value: 'sold_out' },
        { label: 'Preventa Exclusiva', value: 'presale' },
        { label: 'Entrada Libre / Gratuito', value: 'free' },
        { label: 'Cancelado / Pospuesto', value: 'cancelled' },
      ],
      admin: {
        condition: (data) => data?.listing !== 'archive',
      },
    },
    {
      name: 'ticketUrl',
      type: 'text',
      label: 'Enlace Oficial de Boletería (URL)',
      admin: {
        condition: (data) => data?.listing !== 'archive',
      },
    },
    {
      name: 'vipPackageUrl',
      type: 'text',
      label: 'Enlace a Pase VIP / Meet & Greet (Opcional)',
      admin: {
        condition: (data) => data?.listing !== 'archive',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Flyer / Póster del evento',
    },
    {
      name: 'usageRights',
      type: 'group',
      label: 'Fuente y autorización de uso del flyer',
      admin: {
        description:
          'El flyer solo se muestra en la web si el estado es "Aprobado". Los flyers pueden incluir imágenes, marcas y datos de terceros.',
      },
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Autorización de uso',
          defaultValue: 'pending',
          options: [
            { label: 'Pendiente de aprobación', value: 'pending' },
            { label: 'Aprobado para la web', value: 'approved' },
            { label: 'Requiere consentimiento de terceros', value: 'third_party_consent' },
            { label: 'No publicar el flyer', value: 'rejected' },
          ],
        },
        {
          name: 'source',
          type: 'text',
          label: 'Fuente del archivo (interno)',
          admin: { placeholder: 'ej: Archivo privado del equipo del artista (2026-11-17)' },
          access: {
            read: ({ req: { user } }) => Boolean(user),
          },
        },
        {
          name: 'credit',
          type: 'text',
          label: 'Crédito público (promotor / diseñador)',
        },
        {
          name: 'approvalNote',
          type: 'textarea',
          label: 'Quién aprobó y cuándo (interno)',
          access: {
            read: ({ req: { user } }) => Boolean(user),
          },
        },
      ],
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
