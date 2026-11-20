import type { Endpoint } from 'payload';
import { revalidateContent, PUBLIC_PATHS } from '@/lib/revalidate';

/**
 * POST /api/revalidate — invalida todas las páginas públicas.
 * Uso: tras cambios que no pasan por los hooks (seeds por CLI, SQL directo).
 * Protección: requiere sesión de Payload con rol `admin`; no acepta tokens compartidos.
 * La acción es idempotente y no expone datos.
 */
export const revalidateSiteEndpoint: Endpoint = {
  path: '/revalidate',
  method: 'post',
  handler: async (req) => {
    if (!req.user || req.user.role !== 'admin') {
      return Response.json({ error: 'No autorizado' }, { status: 403 });
    }
    const paths = revalidateContent('site-settings');
    req.payload.logger.info(`Revalidación manual de todo el sitio solicitada por el usuario ${req.user.id}`);
    return Response.json({ revalidated: paths.length > 0, paths: PUBLIC_PATHS });
  },
};
