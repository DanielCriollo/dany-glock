# 16 — Estrategia de Caché y Revalidación del CMS (Misión 006-B.3)

Resuelve **DEPLOY-01**: los cambios publicados en Payload aparecen en la web **sin `pnpm build` ni reinicio**.
Implementado y verificado en local el 2026-10-23. Pendiente de commit y despliegue.

---

## 1. Estrategia

| Capa | Decisión | Motivo |
| :--- | :--- | :--- |
| Renderizado | Páginas públicas **estáticas con ISR** (`○` + `Revalidate 1h` en el build) | Mantiene el rendimiento de HTML prerenderizado (cabecera `x-nextjs-cache: HIT`) sin desactivar la caché |
| Invalidación | **Bajo demanda** con `revalidatePath` desde hooks `afterChange`/`afterDelete` de Payload | Payload corre dentro del proceso de Next.js (admin y `/api` son rutas de la app): los hooks invalidan la caché del servidor sin endpoints públicos. Patrón de la plantilla oficial `website` de Payload |
| Regeneración | En la **siguiente visita** a la ruta invalidada (documentado por Next.js para Route Handlers) | Verificado E2E: el cambio aparece en la primera visita posterior |
| Red de seguridad | `export const revalidate = 3600` en `/`, `/biografia`, `/booking`, `/epk` | Cubre cambios que no pasan por hooks (seeds por CLI, SQL directo) |
| Errores | Las consultas (`cms-queries.ts`) y el layout **propagan** errores | Si PostgreSQL falla durante una regeneración, Next.js conserva la última versión válida en vez de cachear una página vacía |
| Manual | `POST /api/revalidate` (solo administradores) | Forzar actualización completa tras un seed o un cambio por SQL |

### Mapa de dependencias (`src/lib/revalidate.ts`)

| Origen | Rutas invalidadas |
| :--- | :--- |
| `releases`, `tracks` | `/`, `/biografia`, `/epk` |
| `videos` | `/`, `/epk` |
| `events`, `articles` | `/` |
| `career-highlights` | `/biografia`, `/epk` |
| `artist-profile` | `/`, `/biografia`, `/epk` |
| `booking` | `/`, `/biografia`, `/booking`, `/epk` |
| `press-kit` | `/`, `/epk` |
| `media`, `site-settings` | todo el sitio (`revalidatePath('/', 'layout')`) — se usan en portadas, hero, retrato, galería, header y footer |
| `users`, `contacts` | ninguna (no son públicas) |

### Reglas de los hooks
- Colecciones con borradores: se revalida solo si el documento **está publicado o deja de estarlo** (despublicación). Guardar un borrador no toca la caché pública.
- Borrar un documento publicado revalida; borrar un borrador no.
- Colecciones sin borradores (`media`) y globals: revalidan siempre al guardarse.
- `req.context.disableRevalidate = true` desactiva la revalidación (para operaciones masivas).
- Fuera del runtime de Next.js (scripts `tsx`, Vitest) `revalidatePath` lanza una invariante: se captura y la escritura no falla.

---

## 2. Informe de seguridad

| Riesgo | Control | Evidencia |
| :--- | :--- | :--- |
| Borradores visibles | Consultas públicas con `overrideAccess: false` y sin `draft`; access `authenticatedOrPublished`; la regeneración se ejecuta sin usuario | E2E: borrador invisible en `/biografia` y en `GET /api/career-highlights?draft=true` anónimo; Vitest: publicar/retirar |
| Contacto de management | Acceso a nivel de campo (`publishContact`); la revalidación no cambia permisos, solo regenera con la lectura anónima | E2E: contacto no autorizado ausente en página y API; aparece solo tras autorizarlo |
| Endpoint de revalidación | Sin token compartido: exige sesión Payload con rol `admin`; acción idempotente que no devuelve datos | Vitest: anónimo 403, editor 403, admin 200; E2E: `POST` anónimo 403 |
| Abuso por regeneraciones | Solo usuarios autenticados disparan hooks; las visitas anónimas sirven HTML en caché | Cabeceras `HIT` en visitas repetidas |
| Caché envenenada por error de BD | Errores propagados → Next.js mantiene la última versión válida | Comportamiento documentado de ISR |
| Rutas privadas | `/admin` y `/api` siguen dinámicas (`ƒ`) | Salida del build |

---

## 3. Verificación realizada

- **Vitest** `src/tests/revalidation.test.ts` (18 pruebas): mapa de dependencias, publicar/despublicar/borrar/borrador, `disableRevalidate`, globals, media, integración con la configuración real de Payload (hooks registrados), privacidad de booking, endpoint (403/403/200).
- **E2E** `src/scripts/verify-revalidation.ts` contra `next start` local (13/13): EPK activar → 200 / desactivar → 404; hito borrador invisible; API anónima sin borradores; publicar → visible; retirar → oculto; cambiar portada → discografía; cambiar retrato → `/biografia`; editar booking → `/booking`; contacto no autorizado oculto en página y API; contacto autorizado visible. Usuario admin temporal (contraseña aleatoria no impresa) eliminado y valores restaurados.
- **Control negativo:** un cambio hecho por SQL directo **no** aparece en 3 visitas (la página se sirve desde caché, `x-nextjs-cache: HIT`), lo que demuestra que la actualización proviene de los hooks.
- Suite completa 96/96, typecheck 0, lint 0, build OK, sin deriva de esquema (no requiere migración).

---

## 4. Riesgos y limitaciones

1. **Seeds y SQL directo** no disparan los hooks del servidor: el cambio tarda hasta 1 h en verse o requiere `POST /api/revalidate` con sesión admin. Reiniciar el servicio **no** basta, porque la caché ISR persiste en `.next/`.
2. **Instancia única:** la caché ISR vive en el disco local (`.next/`). Correcto para el VPS actual; con varias instancias haría falta un cache handler compartido.
3. **Primera visita tras invalidar** renderiza la página (consulta a PostgreSQL); impacto mínimo con el tráfico actual.
4. **`media` y `site-settings`** invalidan todo el sitio (5 páginas); simple y correcto para el tamaño actual.
5. Un **nuevo `pnpm build`** sigue siendo necesario para cambios de código, no de contenido.

---

## 5. Despliegue manual (cuando se autorice)

Sin migraciones ni cambios de dependencias. Procedimiento estándar de `14-vps-deployment.md` §4:

```bash
ssh dany-vps
sudo -iu danyglock
cd /var/www/dany-glock
git fetch origin && git log --oneline HEAD..origin/wip/mision-006a
git pull --ff-only origin wip/mision-006a
pnpm install --frozen-lockfile
exit
sudo systemctl stop dany-glock
sudo -iu danyglock bash -c 'cd /var/www/dany-glock && NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=1536 pnpm build'
sudo systemctl start dany-glock
```

Verificación posterior: `curl -sI https://dany.forcefilters.com/ | grep -i x-nextjs-cache` (esperado `HIT` en la segunda visita); `curl -s -o /dev/null -w "%{http_code}" -X POST https://dany.forcefilters.com/api/revalidate` → `403`. Prueba funcional sin alterar contenido real: en `/admin` guardar `Shows & Booking` sin cambios y comprobar en `journalctl -u dany-glock` la línea `Revalidación (booking)`.

**No ejecutar `verify-revalidation.ts` en producción** (crea un admin temporal y modifica contenido; el script lo bloquea para dominios `forcefilters.com`).
