/**
 * Limitador de tasa (Rate Limiter) en memoria para protección de endpoints públicos contra abusos.
 * Diseñado para operar sin dependencias externas pesadas ni servicios de terceros.
 */

const submissionMap = new Map<string, number[]>();

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
}

/**
 * Verifica si un identificador (ej. IP o email) ha excedido el límite de solicitudes.
 * @returns true si la solicitud es permitida, false si ha sido limitada.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): boolean {
  const maxRequests = options.maxRequests ?? 5;
  const windowMs = options.windowMs ?? 10 * 60 * 1000; // 10 minutos por defecto
  const now = Date.now();

  const timestamps = submissionMap.get(identifier) || [];
  const recent = timestamps.filter((time) => now - time < windowMs);

  if (recent.length >= maxRequests) {
    return false;
  }

  recent.push(now);
  submissionMap.set(identifier, recent);

  // Mantenimiento preventivo de memoria si el mapa crece
  if (submissionMap.size > 2000) {
    for (const [key, ts] of submissionMap.entries()) {
      if (ts.every((t) => now - t >= windowMs)) {
        submissionMap.delete(key);
      }
    }
  }

  return true;
}

/**
 * Reinicia el estado del rate limiter (útil para pruebas automatizadas).
 */
export function resetRateLimits(): void {
  submissionMap.clear();
}
