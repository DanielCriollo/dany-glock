# 06 — Estado Actual del Proyecto

## 1. Ficha del Proyecto

- **Nombre del Proyecto:** Dany Glock — Official Artist Website
- **Fase Actual:** Misión 006-B — Integración final (Multimedia + Brochure) **lista para commit y despliegue manual** (local, sin commit)
- **Última Misión Completada:** **Misión 006-B — Integración final y preparación para despliegue** (integra M006-B.2 Multimedia de Antigravity y M006-B.2 Brochure de Claude Code)
- **Siguiente Misión:** Desplegar M006-B.3 (revalidación, ver `16-cache-revalidation.md` §5), aprobaciones editoriales BRO-01…BRO-09 y **Misión 007**.
- **Bloqueos Activos:** Ninguno.
- **Producción:** `https://dany.forcefilters.com` — rama `wip/mision-006a` @ `329157f` (M006-B.3 ISR + M006-B.4 material oficial), desplegado 2026-10-23 21:43 UTC (anterior: `45b84d2`). Guía: `14-vps-deployment.md`.

---

## 2. Diagnóstico del Entorno Local

| Herramienta / Runtime | Versión Detectada | Estado / Observación |
| :--- | :--- | :--- |
| **Sistema Operativo** | Windows 10/11 (AMD64) | Verificado |
| **Node.js** | `v22.12.0` | Cumple el requisito de Payload 3 (`>= 20.18.1`) |
| **NPM** | `10.9.0` | Funcional |
| **PNPM** | `10.34.4` | Gestor de paquetes primario con `pnpm-lock.yaml` |
| **Git** | `2.45.2.windows.1` | Activo en rama `wip/mision-006a` |
| **PostgreSQL** | `PostgreSQL 17.6` (Docker / local: 5432) | Motor relacional local activo; BD `dany_glock_dev` |
| **Docker** | `docker 27.x` | Contenedor `my_postgres` ejecutando Postgres 17.6 |

---

### [2026-10-23] — Cierre y despliegue de M006-B.3 + M006-B.4 (`45b84d2` → `329157f`)
- **Commits (push a `origin/wip/mision-006a`, local = remoto):** `d6bd589` feat(cms) ISR + revalidación (M006-B.3); `329157f` feat(media) material oficial (M006-B.4).
- **Validación previa (local):** tests 96/96, typecheck 0, lint 0, build OK; E2E de revalidación 13/13 contra `next start` local; QA headless desktop/móvil sin errores. Escaneo de secretos/contactos/assets en lo commiteado: limpio.
- **Discrepancia «4 portadas / 5 lanzamientos» aclarada:** el catálogo tiene 4 lanzamientos oficiales publicados (SIG Sauer; SO FRESH, SO CLEAN — un solo lanzamiento —; Cicatrices; EXCESO) más `sig-sauer-remix` en borrador sin portada oficial (conserva placeholder y `pending`). Catálogo sin cambios.
- **VPS:** backups `pre-deploy-b34-*.dump` (32 tablas con datos), `media-b34-*.tgz`, `env-b34-*` (600, en `/var/backups/dany-glock` 750); `git pull --ff-only`; `pnpm install --frozen-lockfile` (sin cambios); migraciones comparadas por SQL (5 = 5, ninguna pendiente, sin invocar comandos `payload`); copia `.next` en `/home/danyglock/next-prev-45b84d2`; build OK, corte 54 s; servicio activo, 0 errores en logs.
- **Imágenes en producción:** 5 archivos autorizados transferidos por SCP con verificación SHA-256 a `local/official-assets/web/` (ignorado por Git) e importados con `import-official-assets.ts` (Local API, idempotente: 2.ª ejecución sin cambios). 4 portadas (`coverStatus = confirmed`), `portraitImage` = avatar oficial, Hero vacío, sin duplicados, galería sin cambios. Banner y brochure no subidos.
- **ISR en producción (comprobado):** 4 rutas con `initialRevalidateSeconds = 3600` y caché `HIT`; hooks y endpoint en el bundle; `POST /api/revalidate` anónimo y con JWT falso → 403; API anónima sin borradores; booking sin datos de management; EPK oculto (404). 14/14 dominios del VPS idénticos a la línea base.
- **Incidencia:** la importación por CLI no invalida la caché del servidor (limitación REV-02): la API devolvía las portadas pero el HTML seguía en caché. **Resuelta** a las 22:03:36 UTC: el usuario ejecutó `POST /api/revalidate` con su sesión de admin → `200 {"revalidated":true}` (registrado en `journalctl`).
- **Verificación final desde internet:** `/` muestra las 4 portadas oficiales y el retrato; `/biografia` el retrato; todas las variantes `/_next/image` y `/api/media/file/*` responden 200 `image/jpeg`; Hero con fallback editorial; caché `HIT` en las 4 rutas; `/admin` 200; `/epk` 404; `POST /api/revalidate` anónimo 403; sin borradores ni contactos de management expuestos. Servicio activo sin reinicios ni errores; 14/14 dominios idénticos a la línea base. **M006-B.3 y M006-B.4 cerradas.**

### [2026-10-23] — Misión 006-B.4: Imágenes oficiales y contenido multimedia real (local, sin desplegar)
- **Material recuperado** (fuentes públicas oficiales, autenticidad verificada; `local/official-assets/`, excluido de Git): 4 portadas de Apple Music vía iTunes Lookup (3000² salvo Cicatrices 1400², máximo disponible), avatar y banner del canal oficial de YouTube (identidad verificada por `channelId` del video oficial), 6 miniaturas maxres de videoclips. Sin ampliaciones artificiales. Instagram/TikTok/Spotify sin material accesible sin login: no se eludió.
- **Autorización:** confirmada por el responsable del sitio para portadas e imágenes del canal; brochure sigue pendiente (BRO-08).
- **Payload local:** 4 portadas asignadas (`coverStatus = confirmed`), retrato = avatar oficial; Hero desktop/móvil vacíos (banner descartado: terceros identificables y artista no reconocible). Script idempotente `import-official-assets.ts` (no sobrescribe medios reales).
- **Correcciones visuales justificadas:** `ReleaseCover` ya no superpone el título sobre portadas reales (el arte lo incluye; título conservado para lectores de pantalla sin duplicar el `h2` del spotlight); `ArtistPortrait` y `HeroMedia` ya no superponen el monograma «DG» sobre fotografías reales.
- **Calidad:** tests 96/96, typecheck 0, lint 0, build OK; E2E de revalidación 13/13; QA headless (Edge) desktop/móvil en `/`, `/biografia`, `/booking` sin imágenes rotas, sin overflow, sin errores de consola ni saltos de encabezado. Capturas en `local/official-assets/verification/`.
- **Documentación:** `17-media-inventory.md` (inventario, fuentes, derechos, pendientes). Incidencia de entorno: `next dev` quedó bloqueado al compilar `/api/[...slug]` y el panel del navegador estaba oculto; la verificación se hizo con build de producción y Edge headless.

### [2026-10-23] — Misión 006-B.3: Revalidación del CMS sin rebuild (local, sin desplegar)
- **Implementación:** `src/lib/revalidate.ts` (mapa de dependencias + hooks), hooks en `releases`, `tracks`, `videos`, `events`, `articles`, `career-highlights`, `media` y en los globals `artist-profile`, `booking`, `press-kit`, `site-settings`; `export const revalidate = 3600` en `/`, `/biografia`, `/booking`, `/epk`; `cms-queries.ts` y layout propagan errores; endpoint `POST /api/revalidate` solo admin (`src/endpoints/revalidateSite.ts`).
- **Pruebas:** `src/tests/revalidation.test.ts` (18); E2E `src/scripts/verify-revalidation.ts` contra `next start` local 13/13 (EPK on/off, publicar/retirar hito, portada, retrato, booking, privacidad); control negativo con SQL directo (sin revalidar no cambia: caché `HIT`). Suite 96/96, typecheck 0, lint 0, build OK (rutas `○` con `Revalidate 1h`), sin migración.
- **Documentación:** `16-cache-revalidation.md` (estrategia, seguridad, riesgos, despliegue); ADR-020.
- **Resuelve:** DEPLOY-01.

### [2026-10-23] — Despliegue de M006-B en producción (`e12f397` → `45b84d2`)
- **Procedimiento (§8 de `14-vps-deployment.md`):** GitHub = local (`45b84d2`, contenido auditado: sin PDF, imágenes ni contactos) → backups previos a cualquier comando `payload`: `pre-deploy-m006b-20261023-202816.dump` (23 tablas con datos), `media-m006b-*.tgz`, `env-m006b-*` (600) → `git pull --ff-only` (VPS limpio) → `pnpm install --frozen-lockfile` (una sola `sharp` 0.34.5 / libvips 8.17.3) → `payload migrate` → `seed-brochure-content.ts` → copia `.next` en `/home/danyglock/next-prev-e12f397` → stop → build → start.
- **Migraciones:** `20261023_194032_add_brochure_content_structure` aplicada una vez (lote 3); 5/5 registradas.
- **Seed:** 5 hitos verificados publicados, 4 afirmaciones del brochure en borrador, `booking` (especificaciones declaradas, contacto vacío y privado) y `press-kit` (`isPublic = false`) inicializados; segunda ejecución sin cambios. **No** se ejecutaron `seed-artist-data.ts` ni `import-brochure-assets.ts`. Datos previos intactos (5 releases, 6 videos, 1 usuario, 1 media, 0 contactos).
- **Build:** OK. Interrupción: 73 s. Sin rollback.
- **Verificación pública:** `/`, `/biografia`, `/booking`, `/admin` 200; `/epk` 404 (privado); `first-register` 403; API `booking` sin datos de management; API `career-highlights` anónima solo 5 publicados (también con `draft=true`); 17/17 estáticos y `/_next/image` 200; formulario valida (400) sin crear registros; sin textos pendientes de aprobación en la web. Logs sin errores de sharp. 14/14 dominios del VPS idénticos a la línea base.

### [2026-10-23] — Misión 006-B: Integración final y preparación para despliegue
- **Alcance:** revisión conjunta de M006-B.2 Multimedia (Antigravity: `HeroMedia`, `ReleaseCover`, `ArtistPortrait`, `VideoGallery`, `next.config.ts`, `depth: 2`) y M006-B.2 Brochure (Claude Code: `career-highlights`, `booking`, `press-kit`, galería en `media`, `/booking`, `/epk`, migración `20261023_194032`).
- **Conflictos encontrados:** ninguno de código entre agentes (archivos compartidos — `page.tsx`, `biografia/page.tsx`, `cms-queries.ts`, `LatestReleaseSpotlight.tsx` — combinan ambos cambios sin pérdidas). Todas las secciones M006-B.1 (`lanzamiento`, `musica`, `biografia`, `videos`, `tour`, `contacto`, `press-kit`) siguen presentes.
- **Problemas comprobados y corregidos:**
  1. **Dos versiones de sharp en el mismo proceso** (Next 15.4 → 0.34.5, proyecto → 0.35.5). Ambas incluyen `libvips-42.dll`; en Windows, si el optimizador `next/image` (nuevo en M006-B) cargaba primero, Payload fallaba con `ERR_DLOPEN_FAILED` y la página daba error. Reproducido en `pnpm dev`. En Linux (Docker `node:24-bookworm-slim`) ambos órdenes funcionan → producción no afectada. **Corrección:** `sharp` del proyecto fijado a `^0.34.5` (una sola versión en el lockfile). Verificado: subida con generación de tamaños en Payload, orden `next/image` → `/admin` OK, build y tests OK. (ADR-019)
  2. **`down` de la migración `20261023_194032` fallaba** (DROP CONSTRAINT tras DROP TABLE … CASCADE). Corregido con `IF EXISTS`. Verificado en BD restaurada con el estado de producción: up → down (esquema idéntico al original) → up, sin deriva.
  3. Texto de ayuda de `heroVideoUrl` prometía YouTube; `HeroMedia` solo reproduce MP4/WebM directos. Corregido el texto (sin cambio de esquema).
- **Verificaciones:** tipos generados sincronizados con la configuración; migraciones encadenadas desde cero (5) y sobre estado de producción (4 → 5); seeds: `seed-brochure-content.ts` solo-creación; ningún contacto/secreto en archivos versionables; PDF, assets del brochure, `media/` y `.env` ignorados.
- **Calidad:** typecheck 0, lint 0, tests 78/78 (7 suites), build OK (8 rutas). Navegador: desktop 1440×900 y móvil 375×812 en `/`, `/biografia`, `/booking` sin scroll horizontal, sin imágenes rotas, menú móvil con cierre por Escape; `/epk` 404 mientras no sea público.
- **Pendientes reales:** ver `08-backlog-and-blockers.md` §12.

### [2026-10-23] — Misión 006-B.2 (Brochure): Migración del brochure oficial a la experiencia web
- **Misión:** Misión 006-B.2 — Migración del Brochure Oficial (local; sin commit ni despliegue).
- **Implementaciones realizadas:**
  - Auditoría completa de las 6 páginas y matriz de verificación: `15-brochure-audit.md` (23 afirmaciones clasificadas, 14 imágenes evaluadas, 13 flyers transcritos).
  - Payload: colección `career-highlights`, globals `booking` y `press-kit`, ampliación de `media` (galería de shows). Migración `20261023_194032_add_brochure_content_structure` (lote 5 local; verificada desde cero, sin deriva).
  - Seeds solo-creación `seed-brochure-content.ts` (5 hitos verificados publicados, 4 afirmaciones en borrador, booking y EPK inicializados) e `import-brochure-assets.ts` (14 piezas ocultas, derechos pendientes).
  - Vistas: `/biografia` (trayectoria y colaboraciones, en vivo), `/booking` (nueva), `/epk` (nueva, 404 hasta `isPublic`), home enlazada; navegación `/#ancla` válida desde subpáginas.
  - Correcciones responsive preexistentes: desbordamiento horizontal en móvil de la home (brillo de `LatestReleaseSpotlight` y título «SHOWS & PRESENTACIONES»).
  - Privacidad: datos de contacto fuera del repositorio público; `local/*.pdf` y `local/brochure-assets/` en `.gitignore`.
- **Calidad:** tests 78/78 (nueva suite `brochure-content.test.tsx`, 15 pruebas), typecheck 0, lint 0, build OK (`/booking` 122 kB First Load JS). Revisión en navegador desktop 1440×900 y móvil 375×812 sin scroll horizontal; 1 h1 por página, sin saltos de encabezado, sin imágenes sin `alt` ni enlaces sin nombre.
- **Arquitectura y decisiones:** ADR-018.
- **Pendientes:** BRO-01…BRO-10 en `08-backlog-and-blockers.md`.

### [2026-10-23] — Misión 006-B.2: Official Artist Visual Identity & Media Experience
- **Misión:** Misión 006-B.2
- **Implementaciones realizadas:**
  - **Optimización de Imágenes & Formatos Modernos (`next.config.ts`):**
    - Habilitados formatos `image/avif` e `image/webp`.
    - Añadidos `images.remotePatterns` para `i.ytimg.com` e `img.youtube.com`.
  - **Población Profunda en Consultas CMS (`src/lib/cms-queries.ts`):**
    - Añadido `depth: 2` a `getArtistProfileData()`, `getPublishedReleasesData()`, `getPublishedVideosData()` y `getHomePageCmsData()`, garantizando la resolución completa de los objetos `Media` vinculados (`heroDesktopMedia`, `heroMobileMedia`, `portraitImage`, `coverImage`, `customThumbnail`).
  - **Hero Multimedia Cinemático & Accesible (`src/components/hero/HeroMedia.tsx`):**
    - Soporte responsivo dual: imágenes desktop (`16:10` / `16:9`) y móvil (`9:16` / `4:5`) con `priority={true}` anti-CLS.
    - Soporte para video en bucle (`heroVideoUrl`) silenciado con fallback a imagen poster.
    - Control accesible de reproducción/pausa con atributos ARIA (`aria-label`, `aria-pressed`).
    - Detección activa de `prefers-reduced-motion` que pausa automáticamente el video de fondo respetando preferencias del sistema.
    - Canvas editorial Dark Cinematic Editorial para estado vacío sin medios cargados.
  - **Carátulas Oficiales Cuadradas 1:1 (`src/components/music/ReleaseCover.tsx`):**
    - Proporción 1:1 rigurosa con `<Image>` de Next.js.
    - Soporte prioritario para el Single Spotlight (`priority={true}`) y lazy loading para el catálogo.
    - Fallback de vinilo concéntrico con rotulado de catálogo (`DG-REC-001`, etc.) para estados sin arte cargado o en sincronización.
  - **Retratos Verticales 4:5 (`src/components/artist/ArtistPortrait.tsx`):**
    - Integración en Home ("El Artista") y en `/biografia`.
    - Proporción 4:5 vertical con fallback de textura tonal oscura y monograma DG.
  - **Videoteca Optimizada (`src/components/video/VideoGallery.tsx`):**
    - Cero iframes en carga inicial.
    - Priorización de `customThumbnail` sobre la miniatura automática de YouTube con `<Image>` optimizado.
    - Modal accesible `<dialog>` con foco atrapado y soporte de Escape.
  - **Quality Gates & Pruebas:**
    - 63 de 63 pruebas unitarias y de integración pasando en Vitest (6 suites).
    - `pnpm typecheck`: 0 errores.
    - `pnpm lint`: 0 errores, 0 warnings.
    - `pnpm build`: 100% exitoso (Next.js 15 App Router estático `/` y `/biografia`).
    - Verificación visual con browser subagent en desktop (1440x900) y mobile (390x844).
- **Arquitectura y decisiones:** Registrado ADR-017 en `05-technical-decisions.md`.

---


### [2026-10-23] — Actualización de producción a M006-B.1 (`8ea781f` → `e12f397`)
- **Procedimiento:** `git pull --ff-only` como `danyglock` (fast-forward, árbol limpio) → `pnpm install --frozen-lockfile` (lockfile sin cambios, nada instalado) → backup verificado `pre-deploy-e12f397-20261023-184623.dump` (46 tablas en `pg_restore --list`) + `media-20261023.tgz` → migración → seed → copia `.next` previo en `/home/danyglock/next-prev-8ea781f` → stop → build → start.
- **Migración `20261023_180000_add_hero_and_portrait_media`:** aditiva (8 columnas nulables + 3 FK `ON DELETE SET NULL`), aplicada una vez como lote 2. **Incidencia:** la aplicó `prodMigrations` al inicializar Payload durante `pnpm payload migrate:status` (con `.env` cargado, `NODE_ENV=production`), no `payload migrate`. Fue después del backup y sin efectos adversos; documentado en `14-vps-deployment.md`.
- **Seed:** re-ejecutado (idempotente, 0 creaciones) para actualizar `tagline` y textos del hero; se verificó antes que ningún registro había sido editado desde el CMS (solo `users`, que el seed no toca).
- **Build:** OK (`/` y `/biografia` estáticas). Interrupción del servicio: 49 s.
- **Verificación pública:** `/`, `/biografia`, `/admin`, `/admin/login`, API REST/globals 200; 15/15 recursos `/_next/static` 200; miniaturas YouTube y media 200; 404 correcto; `first-register` 403; sin textos de desarrollo en la Home. Logs sin errores. 14/14 dominios del VPS idénticos a la línea base.
- **Calidad (BD temporal, eliminada después):** tests 57/57, typecheck 0, lint 0 → DEPLOY-02 resuelto.

### [2026-10-23] — Misión DevOps: Despliegue inicial en VPS Ubuntu compartido
- **Misión:** Despliegue de Dany Glock en `https://dany.forcefilters.com` sin afectar proyectos existentes.
- **Implementaciones realizadas:**
  - SSH por clave dedicada (`ssh dany-vps`); acceso por contraseña intacto.
  - Auditoría: Nginx 1.24 sirve 80/443 (Apache inactivo), PHP-FPM 8.3/8.4, MySQL 8, PostgreSQL 16, Docker (n8n), bot en :3000. Swap 2 GB añadido (autorizado) tras un OOM en `pnpm install`.
  - PostgreSQL: `danyglock_db` / `danyglock_app`, acceso remoto rechazado solo para esta BD (autorizado); 3 migraciones aplicadas con `payload migrate` previo `pg_dump`; seed idempotente ejecutado (4 releases publicados + 1 borrador, 5 tracks, 6 videos, 1 evento borrador).
  - Calidad en VPS: typecheck 0 errores, lint 0 errores, tests 54/55 en BD temporal (fallo preexistente de texto del badge, DEPLOY-02), build OK (pico 1.4 GB).
  - `dany-glock.service` (systemd, usuario `danyglock`, `127.0.0.1:3100`, `Restart=always` verificado con `kill -9`, habilitado al arranque).
  - Nginx: vhost exclusivo `zz-dany.forcefilters.com`, HTTP→HTTPS 301, HSTS, `client_max_body_size 50m`. Certificado Let's Encrypt (webroot) hasta 2027-01-21, `renew --dry-run` OK.
  - Admin de Payload creado por el usuario vía túnel SSH con `/admin` bloqueado hasta entonces.
  - Verificación: 14 dominios existentes con respuesta HTTP/HTTPS idéntica a la línea base.
- **Arquitectura y decisiones:** ADR-016.
- **Pendientes:** DEPLOY-01…06, INFRA-01/02 en `08-backlog-and-blockers.md`.

### [2026-10-23] — Misión 006-B.1: Cinematic Artist Experience & Home Redesign
- **Misión:** Misión 006-B.1
- **Implementaciones realizadas:**
  - **Expansión del Modelo de Contenido & Migración Segura (`ArtistProfile`):**
    - Nuevos campos administrables en `src/globals/ArtistProfile.ts`: `heroDesktopMedia`, `heroMobileMedia`, `heroVideoUrl`, `portraitImage`, `heroTitle`, `heroSubtitle`, `heroCtaPrimary`, `heroCtaSecondary`.
    - Migración formal `src/migrations/20261023_180000_add_hero_and_portrait_media.ts` ejecutada y registrada en `payload_migrations` (batch 4).
    - Tipos de TypeScript actualizados con `pnpm payload generate:types`.
  - **Hero Cinematográfico Asimétrico:**
    - Tipografía editorial `DANY GLOCK` en gran escala (`text-6xl` a `text-9xl`), subtítulo en `font-serif italic`, badges territoriales (*Pasto, Colombia · Plataforma Oficial*), y canvas visual cinematográfico adaptable (16:10 en desktop, responsive para móviles).
  - **Single Spotlight — Último Lanzamiento (`src/components/music/LatestReleaseSpotlight.tsx`):**
    - Sección independiente para *Cicatrices feat. Maick Records* con vinilo concéntrico 1:1, créditos de producción y enlaces a Apple Music y YouTube.
  - **Discografía Asimétrica & Distinción de Roles:**
    - Cuadrícula editorial de lanzamientos reales sin textos de scaffolding, distinguiendo artista principal vs. invitado (*EXCESO*).
  - **Sección Editorial "El Artista" & Ruta Completa `/biografia` (`src/app/(public)/biografia/page.tsx`):**
    - Nueva sección en Home y ruta dedicada `/biografia` con narrativa territorial y artística verificada (3 capítulos editoriales, ficha técnica, enlaces a discografía y contacto).
  - **Jerarquía en Videografía (`src/components/video/VideoGallery.tsx`):**
    - Video principal en formato spotlight 16:9 con badge de tipo (`Videoclip Oficial`) y duración, más cuadrícula de videos complementarios y modal accesible HTML5 `<dialog>`.
  - **Shows & Booking Unificado:**
    - Estado editorial elegante sin fechas inventadas; formulario de contacto profesional (`ContactForm.tsx`) con honeypot anti-spam.
  - **Simplificación Radical del Footer (`src/components/layout/SiteFooter.tsx`):**
    - Eliminado enlace público a `/admin`; navegación esencial, redes verificadas, copyright y botón volver arriba.
  - **Limpieza Editorial Estricta:**
    - Cero términos de desarrollo (`Artist Digital Experience`, `Dark Cinematic Editorial`, `Arte Oficial en Sincronización`, `Fase 005`).
  - **Quality Gates & Pruebas:**
    - 57 de 57 pruebas unitarias y de integración pasando en Vitest (`src/tests/public-views.test.tsx` actualizado).
    - `pnpm typecheck`: 0 errores.
    - `pnpm lint`: 0 errores, 0 warnings.
    - `pnpm build`: 100% exitoso (Next.js 15 App Router estático + dinámico).
    - Verificación visual con browser subagent en desktop (1440x900) y mobile (390x844).

---

### [2026-10-23] — Misión 006-A.2: Transformar la landing demostrativa en la web oficial de Dany Glock
- **Misión:** Misión 006-A.2
- **Implementaciones realizadas:**
  - **Capa de Consultas Públicas del CMS (`src/lib/cms-queries.ts`):**
    - Métodos para Server Components: `getArtistProfileData`, `getSiteSettingsData`, `getPublishedReleasesData`, `getPublishedVideosData`, `getPublishedEventsData`, `getPublishedArticlesData`, y agregador unificado `getHomePageCmsData`.
    - Respeto estricto a RBAC (`overrideAccess: false`) y filtrado estricto por `_status: 'published'` y `verification.status: 'verified'` para releases y contenidos.
  - **Reescritura de la Landing Page Oficial (`src/app/(public)/page.tsx`):**
    - Dany Glock como protagonista con tipografía póster editorial de impacto (`text-6xl` a `text-9xl`) y origen en Pasto, Nariño, Colombia.
    - Cero referencias a scaffolding, misiones técnicas, fases o falsas locaciones de Guatemala.
    - Spotlight automático del último lanzamiento oficial (*Cicatrices feat. Maick Records*).
    - Catálogo dinámico de los 4 lanzamientos publicados con tratamiento gráfico para artes en sincronización y distinción explícita de "Artista Invitado" en *EXCESO*.
    - Galería audiovisual interactiva con reproductor modal accesible HTML5 `<dialog>` y embeds privacy-enhanced (`youtube-nocookie.com`).
    - Estados vacíos editoriales de alta calidad visual para Tours ("Nuevas Presentaciones en Vivo por Anunciar") y Journal ("Comunicados Oficiales en Preparación").
    - Formulario interactivo de Booking y Prensa conectado a `/api/contacts` con honeypot anti-spam.
  - **Limpieza de Scaffolding y Endurecimiento de Migraciones:**
    - `src/components/layout/EditorialMenu.tsx` y `src/components/layout/SiteFooter.tsx` saneados (enlaces limpios a `#contacto`, redes verificadas, sin correos inventados).
    - `push: false` añadido a `src/payload.config.ts`, permitiendo builds de Next.js desatendidos sin prompts interactivos de migraciones.
  - **Pruebas y Calidad:**
    - `src/tests/public-views.test.tsx`: 16 pruebas automatizadas cubriendo consultas CMS, renderizado de componentes, ausencia de placeholders y estados vacíos.
    - Total de pruebas en repositorio: 6 suites, 55 pruebas pasando al 100%.
    - `pnpm typecheck`: 0 errores.
    - `pnpm lint`: 0 errores, 0 advertencias.
    - `pnpm build`: 100% exitoso con generación estática de ruta `/` (13 kB).
    - Verificación visual browser: Capturas desktop (1440x900) y mobile (390x844) confirmadas.

---

### [2026-10-23] — Misión 006-A.1: Retomar Trabajo Interrumpido y Sembrar Contenido Real en Payload CMS
- **Misión:** Misión 006-A.1
- **Implementaciones realizadas:**
  - **Trazabilidad y Verificación de Fuentes (`src/fields/verification.ts`):**
    - Grupo reutilizable con campos `status` (`verified`, `to_confirm`, `editorial_proposal`), `sourceUrl`, `consultedAt`, y `notes` protegido con permisos RBAC (solo legible por usuarios autenticados).
    - Integrado transversalmente en `Releases`, `Tracks`, `Videos`, `Events`, `Articles`, `ArtistProfile` y `SiteSettings`.
  - **Expansión y Corrección de Esquema CMS:**
    - `Releases`: añadidos `artistRole` (`main`, `featured`, `collaborator`), `coverStatus`, enlaces streaming extendidos (`spotifyEmbedUrl`, `amazonMusic`).
    - `Tracks`: añadidos `artistRole`, `appleMusicUrl`.
    - `Videos`: añadido tipo `trailer`, `youtubeId` (11 caracteres), `duration`.
    - `Events`: versión con borradores activada (`versions: { drafts: true }`), control de acceso público condicional (`authenticatedOrPublished`), campo `slug` único, galería multimedia (`gallery`), enlaces de video e Instagram.
    - `ArtistProfile`: eliminación definitiva de placeholders ficticios de Guatemala; origen corregido a Pasto, Nariño, Colombia; `bioStatus` (`editorial_draft`), grupo de traducciones `translations.en`.
    - `SiteSettings`: perfiles oficiales verificados de Instagram, canal oficial de YouTube con ID `UCf-4AJMV8QZz1jj4OVBzaxg`, Apple Music; sin correos inventados.
  - **Migración Segura en PostgreSQL 17:**
    - Generada y aplicada migración versionada `20261023_150557_add_artist_data_and_verification.ts` con sentencias protegidas e idempotentes (`DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;`, `IF NOT EXISTS`).
    - Adaptador de base de datos en `payload.config.ts` configurado con `prodMigrations: migrations`.
    - Eliminado registro dev residual (`batch: -1`) garantizando compilaciones y migraciones desatendidas sin bloqueos interactivos.
  - **Siembra Real e Idempotente (`src/scripts/seed-artist-data.ts`):**
    - 4 lanzamientos verificados publicados (`sig-sauer`, `so-fresh-so-clean`, `cicatrices`, `exceso` con rol `featured`).
    - 1 lanzamiento en borrador protegido (`sig-sauer-remix`).
    - 5 canciones correspondientes vinculadas a sus lanzamientos y créditos de producción (Nick Montana Beatmen, Dark Pro).
    - 6 producciones audiovisuales en YouTube con metadatos y clasificación oficial.
    - 1 evento regional en borrador (`pasto-vive-flow-2026`).
    - Idempotencia probada al 100%: ejecutar el script sucesivamente produce 0 filas duplicadas.
  - **Utilidades de Contenido Reforzadas (`src/lib/content-utils.ts`):**
    - Extracción y validación estricta de IDs de YouTube, control de whitelist de hosts, rechazo de protocolos inseguros, y generación de miniaturas y slugs limpios.
  - **Pruebas y Calidad:**
    - `src/lib/content-utils.test.ts`: 9 pruebas unitarias pasando.
    - `src/tests/artist-data-seed.test.ts`: 7 pruebas de integración y seguridad de borradores pasando.
    - `pnpm test`: 39/39 pruebas pasando (5 suites de test).
    - `pnpm typecheck`: 0 errores.
    - `pnpm lint`: 0 errores, 0 advertencias.
    - `pnpm build`: compilación de producción exitosa al 100%.
- **Recuento Real en PostgreSQL:**
  - `Releases`: 7 (4 verificados + 1 borrador + 2 demos previos).
  - `Tracks`: 6 (5 sembrados + 1 demo previo).
  - `Videos`: 6 (todos verificados en YouTube).
  - `Events`: 1 (`pasto-vive-flow-2026` en borrador).
  - `Articles`: 0 (listo para notas editoriales oficiales).
  - `Media`: 1 (arte temporal referenciado sin duplicación innecesaria).
  - `Contacts`: 57 (mensajes de contacto y pruebas de seguridad preservados).
  - `Users`: 1 (`admin@danyglock.com`).
- **Arquitectura y decisiones:** Registrado ADR-013 en `05-technical-decisions.md`.

---

### [2026-10-23] — Misión 005: Cinematic Layout & Kinetic Navigation
- **Misión:** Misión 005
- **Implementaciones realizadas:**
  - **SiteHeader (`src/components/layout/SiteHeader.tsx`):**
    - Wordmark tipográfico cinematográfico DANY GLOCK con subtítulo 'Artist Digital Experience'.
    - Navegación principal desktop (`Música`, `Videos`, `Shows`, `Journal`, `Press Kit`) con tracking editorial y transiciones de acento carmesí.
    - Adaptación al scroll: efecto scrim/glassmorphism dinámico (`bg-ink/85 backdrop-blur-md border-b border-white/10`) al superar 40px de scroll vertical.
    - Enlace directo a Booking y botón activador de menú con pulso crimson e indicador de estado `aria-expanded`.
  - **EditorialMenu (`src/components/layout/EditorialMenu.tsx`):**
    - Implementación con elemento `<dialog>` nativo y método `showModal()`, garantizando top layer y atrapamiento de foco accesible.
    - Tipografía póster a gran escala con índices mono (`01 Música`, `02 Videografía`, `03 Tour & Shows`, etc.).
    - Atajos de teclado: cierre con tecla `Escape`, retorno de foco al activador y bloqueo automático de scroll (`overflow: hidden`).
    - Bloque inferior de plataformas oficiales de streaming, redes sociales y contacto directo.
  - **SiteFooter (`src/components/layout/SiteFooter.tsx`):**
    - Server Component conectado directamente a Payload CMS mediante Local API (`payload.findGlobal({ slug: 'artist-profile', overrideAccess: false })` y `site-settings`).
    - Bloque de contratación y prensa directa con tarjetas de contacto profesional.
    - Cuadrícula de 4 columnas (Manifiesto Artístico, Navegación, Canales de Streaming, Redes Oficiales).
    - Wordmark tipográfico monumental recortado con sangrado visual (`15vw`) al fondo del footer.
    - Enlace seguro al panel administrativo `/admin` y botón "Volver arriba ↑".
  - **Layout Público & Scaffold Editorial (`src/app/(public)/layout.tsx` & `page.tsx`):**
    - Integración de `<SiteHeader>`, skip link accesible (`#main-content`), y `<SiteFooter>`.
    - Hero tipográfico editorial de sustitución temporal con manifiesto oficial, ubicación (`Quetzaltenango, Guatemala`) y secciones de anclaje para validar navegación y scroll.
    - Botón polimórfico `Button` (`src/components/ui/Button.tsx`) con soporte transparente para `href` y enlaces de navegación accesibles.
  - **Pruebas y Verificación:**
    - Creado `src/tests/layout-navigation.test.tsx` con pruebas unitarias para `SiteHeader`, `EditorialMenu` y `Button` polimórfico.
    - Verificación visual completa en navegador con agente de navegación (Desktop 1440x900 y Mobile 390x844).
    - Verificación de aislamiento estricto del panel `/admin` sin interferencia de estilos públicos.
- **Arquitectura y decisiones:** Registrado ADR-012 en `05-technical-decisions.md`.
- **Pruebas ejecutadas:**
  - `pnpm typecheck` (`tsc --noEmit`): 0 errores.
  - `pnpm lint` (`next lint`): 0 errores, 0 advertencias.
  - `pnpm test` (`vitest run`): 23/23 tests pasados en 3 archivos (100% verde).
  - `pnpm build` (`next build`): compilación exitosa (código 0).
- **Pendientes y bloqueos:** Ninguno.
- **Próximos pasos:** Misión 006 — Home Experience & Architectural Scenes (detenerse para revisión humana previa).

### [2026-10-23] — Misión 004-B: Security Hardening & CMS Regression Tests
- **Misión:** Misión 004-B
- **Implementaciones realizadas:**
  - **Rotación Criptográfica y Mitigación P0:** Se invalidó la contraseña inicial anterior y se rotó la clave del administrador en PostgreSQL sin registrar credenciales en texto plano.
  - **Limpieza de Código:** Se refactorizó `src/scripts/seed-admin.ts` para eliminar cualquier credencial incrustada, condicionando la creación a variables de entorno (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).
  - **Script de Rotación Segura:** Se creó `src/scripts/rotate-admin-password.ts` para permitir rotaciones continuas de contraseñas con validación de complejidad (mínimo 14 caracteres) sin fugas de secretos.
  - **Hardening de Configuración:** `src/payload.config.ts` valida obligatoriamente `PAYLOAD_SECRET` en producción, rechazando arranques inseguros.
  - **Blindaje del Formulario de Contacto:**
    - Campo Honeypot anti-spam (`websiteHoneypot`).
    - Limitador de tasa en memoria por IP/email con ventana deslizante (`src/lib/rate-limiter.ts`, máximo 5 envíos en 10 min).
    - Restricción de campo `status.access.create` para impedir inyección anónima de estados internos.
    - Validaciones de longitud mínima y máxima en servidor.
  - **Migración de Base de Datos:** Generada y aplicada migración `20261023_060207_add_contact_honeypot.ts`.
  - **Suite Automatizada de Regresión:** Creado `src/tests/cms-security.test.ts` con 14 casos de prueba automatizados con Vitest (aislamiento de borradores, privacidad de contactos, honeypot, rate limiting, RBAC, globals y protección de usuarios).
  - **Auditoría de GraphQL:** Verificado que `/api/graphql` aplica exactamente los mismos filtros de seguridad que la REST API (403 en contactos, borradores ocultos).
- **Arquitectura y decisiones:** Registrado ADR-011 en `05-technical-decisions.md`.
- **Pruebas ejecutadas:**
  - `pnpm test` (`vitest run`): 17/17 tests pasados (100% verde).
  - `pnpm typecheck` (`tsc --noEmit`): 0 errores.
  - `pnpm lint` (`next lint`): 0 errores, 0 advertencias.
  - `pnpm build` (`next build`): compilación limpia en 20s.
- **Pendientes y bloqueos:** Ninguno.
- **Próximos pasos:** Misión 005 — Core Layout, Smooth Scroll & Kinetic Navigation.

### [2026-10-23] — Misión 004: Payload CMS & Content Architecture
- **Misión:** Misión 004
- **Implementaciones realizadas:**
  - Creación de base de datos exclusiva `dany_glock_dev` en PostgreSQL 17.6 local.
  - Instalación de `payload@3.91.0`, `@payloadcms/next@3.91.0`, `@payloadcms/db-postgres@3.91.0`, `@payloadcms/richtext-lexical@3.91.0`, `graphql@16.14.2` y `sharp@0.35.5`.
  - Configuración central en `src/payload.config.ts` y envoltura `withPayload` en `next.config.ts`.
  - Implementación de colecciones:
    - `Users`: Autenticación de administradores, RBAC (`admin`, `editor`), acceso restringido.
    - `Media`: Almacenamiento local, redimensionado con Sharp, validación de MIME, alt y categorías.
    - `Releases`: Álbumes, EPs y Singles con slugs únicos, enlaces de streaming, relación con Media, SEO y control de borradores.
    - `Tracks`: Pistas vinculadas con clave foránea a Releases, créditos, audio preview y metadata ISRC.
    - `Videos`: Videoteca oficial con soporte de YouTube, metadatos y miniaturas personalizadas.
    - `Events`: Agenda de conciertos, recintos, ciudades y estado de venta de tickets.
    - `Articles`: Journal editorial con editor Lexical, categorías, extractos y borradores.
    - `Contacts`: Solicitudes privadas de contratación y prensa.
  - Implementación de Globals: `ArtistProfile` y `SiteSettings`.
  - Políticas de seguridad estrictas:
    - Contactos: `read` denegado para anónimos (403 Forbidden); `create` abierto para formularios web.
    - Borradores: documentos `draft` filtrados para visitantes anónimos (404 al consultar por ID directo).
    - Usuarios: administración restringida con autenticación JWT.
    - Globals: lectura pública, modificación autenticada (403 para anónimos).
  - Migración inicial generada y ejecutada en PostgreSQL (`src/migrations/20261023_054057_initial_setup.ts`), creando 20 tablas relacionales.
  - Tipos TypeScript autogenerados en `src/payload-types.ts` e importMap en `src/app/(payload)/admin/importMap.js`.
  - Rutas de App Router configuradas en `src/app/(payload)/admin/` y `src/app/(payload)/api/`.
- **Arquitectura y decisiones:** Registrado ADR-010 en `05-technical-decisions.md`.
- **Pruebas ejecutadas:**
  - `pnpm typecheck` (`tsc --noEmit`): 0 errores.
  - `pnpm test` (`vitest run`): 3/3 tests unitarios pasados.
  - `pnpm lint` (`next lint`): 0 errores, 0 advertencias.
  - `pnpm build` (`next build`): compilación exitosa en 55s; rutas estáticas y dinámicas (`/admin`, `/api`) generadas.
  - Pruebas HTTP en dev server:
    - Anon GET `/api/contacts` -> 403 Forbidden.
    - Anon POST `/api/contacts` -> 201 Created (doc id: 1 creado).
    - Anon GET `/api/releases` -> Solo 1 release publicado (`Noctámbulo`), el borrador permanece invisible.
    - Anon GET `/api/releases/3` (borrador) -> 404 Not Found.
    - Admin Login POST `/api/users/login` -> 200 OK con token JWT.
    - Admin GET `/api/contacts` con JWT -> 200 OK (retorna solicitud creada).
    - Admin GET `/api/releases?draft=true` con JWT -> 200 OK (retorna tanto publicados como borradores).
    - Anon POST `/api/globals/artist-profile` -> 403 Forbidden.
    - Anon GET `/` (Home pública) -> 200 OK con scaffold e identidad `DANY GLOCK` intactos.
- **Pendientes y bloqueos:** Ninguno.
- **Próximos pasos:** Misión 005 — Core Layout, Smooth Scroll & Kinetic Navigation.

### [2026-10-23] — Misión 003: Project Bootstrap & Engineering Foundation
- **Misión:** Misión 003
- **Implementaciones realizadas:**
  - Diagnóstico de compatibilidad y resolución de incompatibilidad de motor Node (`payload@latest` requería `^22.23.4`, mientras que `payload@3.91.0` requiere `>=20.18.1`, perfectamente compatible con Node `v22.12.0`).
  - Creación de configuración unificada: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `.env.example`.
  - Instalación limpia con `pnpm install` generando `pnpm-lock.yaml` determinista.
  - Implementación de design tokens reales en `src/app/globals.css` (escalas ink, graphite, carbon, steel, bone, ash, smoke, crimson, ember, grano SVG estático, focus visible WCAG 2.2 y reduced motion).
  - Configuración de tipografías autoalojadas con Next.js Font (`Archivo`, `Instrument_Serif`, `JetBrains_Mono` en `src/app/fonts.ts`).
  - Creación del componente accesible `src/components/ui/Button.tsx` (variantes primary, secondary, ghost y tamaños sm, md, lg).
  - Scaffold de verificación técnica en `src/app/(public)/layout.tsx` y `src/app/(public)/page.tsx`.
- **Arquitectura y decisiones:** Registrado ADR-009 en `05-technical-decisions.md` (Fijación de Payload CMS 3.91.0 para compatibilidad estricta con Node 22.12.0 y Next.js 15.4.11).
- **Dependencias agregadas:** `next@15.4.11`, `react@^19.0.0`, `react-dom@^19.0.0`, `clsx`, `tailwind-merge`, `lucide-react`, `tailwindcss@^3.4.17`, `postcss`, `autoprefixer`, `typescript@^5.7.3`, `vitest@^3.0.7`, `jsdom`, `@testing-library/react`, `eslint@^9.0.0`, `eslint-config-next@15.4.11`.
- **Pruebas ejecutadas:**
  - `pnpm typecheck` (`tsc --noEmit`): 0 errores.
  - `pnpm test` (`vitest run`): 3/3 tests unitarios pasados (100%).
  - `pnpm lint` (`next lint`): 0 errores, 0 advertencias.
  - `pnpm build` (`next build`): compilación estática exitosa en 15.0s, First Load JS compartido 101 kB.
  - Servidor de desarrollo `pnpm dev` probado en puerto 3001: HTTP 200 OK en 63ms sin errores de hidratación.
- **Pendientes y bloqueos:** Ninguno.
- **Próximos pasos:** Misión 004 — Payload CMS 3 Integration & Core Data Models.

### [2026-10-22] — Misión 002: Design System & Cinematic Art Direction
- **Misión:** Misión 002 / 002-B
- **Implementaciones realizadas:**
  - Definición completa del Design System *Dark Cinematic Editorial* en `04-design-system-strategy.md`.
  - Especificación conceptual de 10 componentes clave, anatomía y estados en `10-components.md`.
  - Definición del sistema de movimiento (CSS-first + GSAP, descarte de Motion y aplazamiento de Lenis) en `11-motion-system.md`.
  - Arquitectura visual de la Home estructurada en 8 escenas narrativas en `12-home-visual-architecture.md`.
  - Creación de script de validación matemática de luminancia WCAG `local/design-preview/contrast.mjs`.
  - Construcción del tablero visual aislado `local/design-preview/style-tile.html` (sin fotos ni datos no oficiales).
- **Arquitectura y decisiones:** Registrados ADR-006 (Paleta carmesí), ADR-007 (Tipografía Archivo/Instrument) y ADR-008 (Movimiento CSS-first / GSAP) en `05-technical-decisions.md`.
- **Dependencias agregadas:** Ninguna en `package.json` (desarrollo limpio en Markdown, HTML y JS nativo).
- **Pruebas ejecutadas:**
  - `node local/design-preview/contrast.mjs` certificó ratios WCAG 2.2 AA (bone/ink 16.48:1, crimson-text/ink 6.33:1, bone/crimson 5.75:1).
  - Pruebas en navegador con subagente validaron renderizado responsive (desktop y 390px móvil), ausencia de scroll horizontal, foco por teclado visible y accesibilidad de `<dialog>`.
- **Pendientes y bloqueos:** Validación visual humana final del Style Tile. Ningún bloqueo técnico activo.
- **Próximos pasos:** Misión 003 — Inicialización del proyecto y tooling.

### [2026-10-22] — Misión 001: Investigación técnica, arquitectura y preparación del proyecto
- **Misión:** Misión 001
- **Implementaciones realizadas:**
  - Diagnóstico completo del entorno de desarrollo y herramientas disponibles.
  - Creación de reglas de operación permanente en [AGENTS.md](file:///c:/Users/DUCKER/Documents/dany-glock/AGENTS.md) y [AGENT-RULES.md](file:///c:/Users/DUCKER/Documents/dany-glock/AGENT-RULES.md).
  - Configuración del Project Brain en `local/_ai-workspace/` con visión, arquitectura, stack, tokens de diseño, ADRs, estado, roadmap, backlog e inventario de skills.
  - Investigación profunda de compatibilidad entre Next.js 15, React 19, Payload CMS 3.x, PostgreSQL 17, Tailwind CSS v3.4, GSAP 3 y Motion.
  - Análisis comparativo exhaustivo con arquitectura alternativa (Astro + CMS desacoplado).
  - Definición del modelo conceptual de contenido (Colecciones y Globals) para el artista.
- **Arquitectura y decisiones:** Registrados ADR-001 al ADR-005 en `05-technical-decisions.md`.
- **Dependencias agregadas:** Ninguna en esta fase (cero contaminación de node_modules hasta la Misión 003).
- **Pruebas ejecutadas:** Verificación de versiones por CLI y validación de sintaxis de documentación.
- **Pendientes y bloqueos:** Ninguno.
- **Próximos pasos:** Misión 002 — Design System y Dirección Visual (Dark Cinematic Editorial).

