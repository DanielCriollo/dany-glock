import type { Access } from 'payload';

/**
 * Permite acceso exclusivamente a usuarios autenticados en Payload.
 */
export const authenticated: Access = ({ req: { user } }) => {
  return Boolean(user);
};

/**
 * Permite acceso a cualquiera (público).
 */
export const anyone: Access = () => true;

/**
 * Para colecciones con versiones / borradores (Releases, Articles, Videos):
 * - Usuarios autenticados ven todos los documentos (publicados y borradores).
 * - Usuarios anónimos (públicos) solo ven documentos con _status === 'published'.
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true;
  }

  return {
    _status: {
      equals: 'published',
    },
  };
};

/**
 * Acceso restringido exclusivamente a administradores con rol 'admin'.
 */
export const adminsOnly: Access = ({ req: { user } }) => {
  if (!user) return false;
  return user.role === 'admin';
};

/**
 * Acceso para Users: administradores pueden leer/modificar todo;
 * usuarios autenticados estándar solo pueden leer o editar su propio perfil.
 */
export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'admin') {
    return true;
  }
  return {
    id: {
      equals: user.id,
    },
  };
};
