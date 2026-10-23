/**
 * Utilidades puras y robustas para slugs, validación de URLs e identificadores de YouTube.
 */

const VALID_YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const ALLOWED_YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
]);

/**
 * Convierte cualquier texto en un slug alfanumérico seguro en minúsculas,
 * eliminando diacríticos, caracteres especiales y normalizando guiones.
 */
export function slugify(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes y diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar no-alfanuméricos por guiones
    .replace(/^-+|-+$/g, '') // Quitar guiones al inicio y fin
    .slice(0, 100);
}

/**
 * Extrae y valida rigurosamente el ID de 11 caracteres de un video de YouTube.
 * Requiere protocolo HTTP/HTTPS, valida dominios oficiales exactos y rechaza dominios engañosos.
 */
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  // Solo permitir protocolos web seguros
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!ALLOWED_YOUTUBE_HOSTS.has(hostname)) {
    return null;
  }

  let candidateId: string | null = null;

  if (hostname === 'youtu.be') {
    const segments = parsed.pathname.split('/').filter(Boolean);
    candidateId = segments[0] ?? null;
  } else {
    if (parsed.pathname === '/watch') {
      candidateId = parsed.searchParams.get('v');
    } else {
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
      candidateId = match ? match[1] : null;
    }
  }

  if (candidateId && VALID_YOUTUBE_ID_REGEX.test(candidateId)) {
    return candidateId;
  }

  return null;
}

/**
 * Genera la URL pública de la miniatura de YouTube si el ID es válido.
 * Retorna null si el ID no cumple estrictamente el formato de 11 caracteres.
 */
export function youTubeThumbnailUrl(id: string | null | undefined): string | null {
  if (!id || !VALID_YOUTUBE_ID_REGEX.test(id)) {
    return null;
  }
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Genera la URL para iframe embed de YouTube con modo privacy-enhanced (youtube-nocookie).
 */
export function youTubeEmbedUrl(id: string | null | undefined): string | null {
  if (!id || !VALID_YOUTUBE_ID_REGEX.test(id)) {
    return null;
  }
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}
