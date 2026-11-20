# 18 — Trayectoria en escenarios: archivo de flyers y eventos (Misión 006-C / 006-C.1)

**Fecha:** 2026-11-19 · **Estado:** cierre de seguridad (M006-C.1) **completado en local y lista para despliegue** (sin commit, push ni despliegue todavía). Los 18 eventos permanecen en **borrador** y todos los flyers sin autorización pública.

---

## 1. Material recibido y política de privacidad en Git

- 18 imágenes JPEG originales en `flyers/` (raíz del repo, nombres originales intactos) excluidas de Git (`/flyers/` en `.gitignore`).
- 18 copias **idénticas byte a byte** (SHA-256 verificado: 18/18 coinciden, 0 duplicados) con nombres descriptivos en `storage/flyers/`.
- **Auditoría de repositorio remoto (M006-C.1):** verificado directamente contra GitHub API (`GET https://api.github.com/repos/DanielCriollo/dany-glock` → HTTP 200, `"private": false`, `"visibility": "public"`): el repositorio `DanielCriollo/dany-glock` es **PÚBLICO**.
- **Política aplicada (M006-C.1):** `storage/flyers/` también queda **excluida de Git en `.gitignore`** (y nunca debe versionarse, incluso si el repositorio se convierte a privado). Se auditó el historial completo (`git log --all --stat -- storage/ flyers/ media/`) confirmando **0 archivos de flyers en el historial de Git**. Todos los archivos locales en `flyers/` y `storage/flyers/` se conservan intactos.

## 2. Inventario (texto legible únicamente)

Orden = `sortOrder` del inventario (`src/data/stage-history.ts`). «Años candidatos» se calcula por el día de la semana impreso; **no es un dato confirmado** y solo vive en notas internas.

| # | Archivo (`storage/flyers/`) | Evento | Fecha legible | Lugar / ciudad legibles | Participación | Años candidatos | Brochure |
|:--|:--|:--|:--|:--|:--|:--|:--|
| 10 | pasto-vive-flow-vol-1.jpg | Pasto Vive Flow Vol. 1 | **01 agosto 2026** | Centro de Eventos Andino | Artista del cartel | **2026 (legible)** | — (evento ya registrado) |
| 20 | baby-nico-party-estreno-exceso.jpg | Baby Nico Party — estreno video «EXCESO» (Sebas BP × Dany Glock × Nick Montana) | Sábado 26 sep | Tayndala | Lanzamiento | 2020 / **2026** (EXCESO: 2026-07-07) | — |
| 30 | macondo-bye-bye-cicatrices.jpg | Macondo Bye Bye — lanzamiento video «Cicatrices» (Frili) | 25 julio · 7 PM | — | Lanzamiento | 2026 probable (Cicatrices: 2026-07-01) | — |
| 40 | flow-fest-vol-01-ipiales.jpg | Flow Fest Vol. 01 — Magnate en concierto | Viernes 31 julio | A Toda Madre Club, Ipiales | Invitado especial («Danny Glock») | 2020 / 2026 | — |
| 50 | panti-y-colale-camino-a-fronteo.jpg | Panti y Colale — Camino a Fronteo | Viernes 23 oct | Santo Perreo, Pasto | Invitado especial («Danny Glock») | 2020 / 2026 | — |
| 60 | luna-roja-halloween-party.jpg | Luna Roja — Halloween Party | 31 oct | Rey Arlequín (rótulo) | «Artista local» | — | — |
| 70 | aniversario-atm.jpg | Aniversario ATM — Noche de Perreo Clásico (Mishell Master Boys) | Viernes 26 dic | A Toda Madre Club | Special guest | **2025** (único) | F13 |
| 80 | lanzamiento-sig-sauer-remix.jpg | Lanzamiento «SIG Sauer Remix» | **22.NOV.24** | Plaza Norte | Lanzamiento | **2024 (legible)** | F7 |
| 90 | alfombra-dance-hall.jpg | Alfombra Dance Hall XXX (Frili, intro miniserie Amenrap) | Viernes 14 feb · 8 PM | — | Show en vivo | 2020 / 2025 | F2 |
| 95 | urban-fusion-quest-vol-4.jpg | Urban Fusion Quest Vol. 4 — La última del año | 16 dic · 7 PM | Gastrobar El Calavera | Artista destacado | — | — |
| 110 | urban-fusion-quest-season-2.jpg | Urban Fusion Quest Season #2 | 12 ago · 7 PM | Selva Negra | En el cartel | — | F9 |
| 120 | ghetto-dynasty.jpg | Ghetto Dynasty — show central ft. Cinco Ribo | Sábado 6 abril · 7 PM | Teatro San Felipe Neri | Show central | 2019 / 2024 | F3 |
| 130 | lanzamiento-cristales-tintiados.jpg | Lanzamiento «Cristales Tintiados» | Sábado 13 abr · 8 PM | El Faro | Artista invitado | 2019 / 2024 | F5 |
| 140 | club-xilon.jpg | Dany Glock en Club Xilón | Sábado 15 junio | Club Xilón, Pasto | Show central | 2019 / 2024 | F6 |
| 150 | dancehall-selekta.jpg | Dancehall Selekta — Live Session | 31 oct · 8 PM | Pasto (Av. Los Estudiantes) | Presentado | — | F1 |
| 160 | nejo-el-broko-telonero.jpg | Ñejo «El Broko» | 25 abril | Centro de Eventos Andino | Telonero oficial | — | — |
| 170 | colorado-fest.jpg | Colorado Fest | — | Pasto (ilustración) | Artista invitado | — | — |
| 180 | show-fin-de-ano-inpec.jpg | Show urbano — despedida de fin de año | — | INPEC, Pasto | Show central | — | F10 |

### Duplicados y calidad
- **Archivos:** 0 duplicados exactos entre los 18 (SHA-256). Ningún flyer coincide byte a byte con medios ya existentes.
- **Eventos repetidos:** 1 evento ya registrado en Payload (`pasto-vive-flow-2026`, M006-A.1) → se completó, no se duplicó.
- **Brochure (M006-B.2):** 9 flyers son el mismo evento que F1, F2, F3, F5, F6, F7, F9, F10 y F13 de `15-brochure-audit.md`. Las copias del brochure son recortes de menor resolución (720–1050 px); las de `storage/flyers/` son mejores (898–1284 px). Se usan las nuevas; los medios del brochure quedan intactos y ocultos (limpieza opcional desde el admin).
- **Solo en el brochure (sin flyer nuevo):** Premios Kiwid Line 2025, Sig Sauer Gang (7 dic 2024), Partyton Amor y Amistad, arte «Artista del año».
- **Calidad media:** `aniversario-atm`, `alfombra-dance-hall`, `lanzamiento-cristales-tintiados` son capturas de Instagram con iconos superpuestos; `dancehall-selekta` es captura de historia con franjas negras. Pedir los originales a los promotores si se aprueban.
- **Sensible:** `show-fin-de-ano-inpec` (centro penitenciario): requiere autorización expresa del artista y del INPEC.
- **Grafía:** dos flyers escriben «Danny Glock» (Panti y Colale, Flow Fest).
- **Diseño propio:** los dos Urban Fusion Quest llevan la firma «Ducker Design» (crédito registrado).

## 3. Modelo de datos (Payload)

Se **reutiliza `events`** (ya tenía borradores, verificación, venue, ciudad y póster). No se crea colección nueva. Justificación de la ampliación: los flyers históricos no tienen año legible (la fecha exacta era obligatoria) y hacía falta separar archivo y agenda y registrar la autorización del flyer.

| Campo nuevo | Tipo | Uso |
|:--|:--|:--|
| `listing` | select `upcoming` / `archive` | Agenda vs. «Trayectoria en escenarios» |
| `sortOrder` | number (100) | Orden de visualización del archivo |
| `dateLabel` | text | Fecha tal como aparece en el flyer (sin inferir año) |
| `artistRole` | select | Show central, invitado especial, telonero, cartel, lanzamiento, sin especificar |
| `summary` | textarea ≤ 280 | Descripción breve pública |
| `usageRights{status, source, credit, approvalNote}` | group | Autorización del flyer (`pending`/`approved`/`third_party_consent`/`rejected`); `approvalNote` solo admin |

Cambios de validación: `date` solo es obligatoria en la agenda; `city`, `venue` y `ticketStatus` opcionales (`city` pierde el valor por defecto «Pasto», que inventaba ciudades). Campos de boletería ocultos en el admin para eventos del archivo.

**Migración:** `20261120_010900_add_event_archive_fields` — solo `CREATE TYPE` + `ADD COLUMN` (+ `DROP DEFAULT` de `city`). Aditiva y sin pérdida de datos; `down` reforzado en M006-C.1 con `IF EXISTS` en todos los `DROP COLUMN` / `DROP TYPE` (reversibilidad e idempotencia verificadas en BD temporal aislada desde la línea base de producción 1..5 → `up` → `down` → `down` → `up`, preservando fila previa `pasto-vive-flow-2026`). Aplicada en local (lote 6). Respaldo previo: `local/backups/pre-m006c-20261119-200657.dump`.

**Privacidad de archivos (Media, Events y `/_next/image`):**
- `Media.access.read` (`publicMediaRead`): los anónimos **no** pueden leer `event_flyer` ni `live_photo` salvo `gallery.rightsStatus = approved` (aplica a `/api/media`, `/api/graphql` y `/api/media/file/*`, tanto originales como variantes redimensionadas `thumbnail`/`card`/`tablet`/`desktop`).
- `Events.ts` (endurecido en M006-C.1): `syncFlyerRights` exige **ambas condiciones** (`_status === 'published'` **y** `usageRights.status === 'approved'`) para habilitar la lectura del flyer; aprobar derechos en un borrador, despublicar un evento, cambiar `posterImage` o eliminar el evento (`revokeFlyerRightsOnDelete`) revoca el acceso al medio inmediatamente (salvo si otro evento publicado+aprobado lo usa o está marcado visible en la galería de `/booking`).
- `usageRights.source` y `usageRights.approvalNote` tienen `access.read` restringido a usuarios autenticados (no se filtran rutas ni notas internas en `GET /api/events`).
- **Mitigación de caché `/_next/image` (M006-C.1):** durante el E2E se detectó que el optimizador de imágenes de Next.js 15 servía copias cacheadas en `.next/cache/images/` con HTTP 200 incluso después de revocar el flyer (cuando `/api/media/file/*` ya devolvía 403). Se añadió `purgeNextImageCache()` en `src/lib/revalidate.ts`, invocado en los hooks de revocación/borrado de `Events` y `Media`, garantizando bloqueo inmediato en `/_next/image`.

## 4. Diseño e integración

- **Ruta dedicada `/escenarios` — «Trayectoria en escenarios»** (18 eventos justifican página propia; la home no se sobrecarga). Responde **404 mientras no haya eventos publicados** (mismo patrón que el EPK).
- Galería responsive (1 → 2 → 3 columnas), flyers **completos** (`object-contain`, sin recortes), fecha transcrita, participación y lugar. Eventos publicados sin flyer aprobado se muestran como ficha tipográfica.
- Visor ampliado con `<dialog>` nativo: flyer a resolución completa, ficha del evento, navegación con flechas/teclado, Escape, foco devuelto al disparador, `prefers-reduced-motion` respetado.
- Integración: entrada «Trayectoria» en el menú editorial (solo si hay publicados), bloque en `/biografia` (3 flyers + enlace) y enlace discreto bajo «Shows & Presentaciones» en la home.
- La agenda de la home ahora muestra solo eventos `upcoming` con fecha futura.
- **Revalidación (M006-B.3):** `events` pasa a invalidar todo el sitio (`'*'`) porque alimenta agenda, archivo, biografía y menú. `/escenarios` añadida a `PUBLIC_PATHS`, ISR 1 h.

## 5. Importador y transferencia privada al VPS

`src/scripts/import-stage-history.ts` (`--dry-run`, `--dir <ruta>` y variable `STAGE_FLYERS_DIR` disponibles; por defecto `storage/flyers/`), datos en `src/data/stage-history.ts`.
- **Independiente de Git:** no requiere que los flyers estén versionados. Si la carpeta privada no existe (p. ej. tras un `git clone` limpio o en CI), termina sin error con instrucciones de transferencia privada.
- Idempotente: eventos por `slug`; medios por nombre (`escenario-*.jpg`) o SHA-256 de los archivos existentes.
- No sobrescribe: en registros existentes solo completa campos vacíos; no toca registros publicados; nunca publica.
- Todo nuevo entra como borrador, `verification = to_confirm`, `usageRights = pending`, medio oculto.
- Resultado local: 17 creados + 1 completado; re-ejecución `--dry-run`: **18 sin cambios, 0 creados, 0 faltantes**. Con carpeta inexistente (`--dir`): salida limpia sin error (`missingDir: true`).

### Procedimiento de transferencia privada de flyers al VPS (cuando se autorice el despliegue)

Los flyers **no viajan por Git**. Se transfieren por canal cifrado SSH/SCP (mismo patrón validado en M006-B.4, detallado también en `14-vps-deployment.md` §11):

1. **En Windows (PowerShell):** generar `SHA256SUMS` en formato compatible con `sha256sum -c` y transferir a un directorio temporal privado (`700`) en el VPS:
   ```powershell
   Get-ChildItem storage\flyers\*.jpg | ForEach-Object {
     "$((Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLower())  $($_.Name)"
   } | Set-Content -Encoding ascii storage\flyers\SHA256SUMS

   ssh dany-vps 'mkdir -p -m 700 /tmp/dany-m006c-flyers'
   scp storage\flyers\*.jpg storage\flyers\SHA256SUMS dany-vps:/tmp/dany-m006c-flyers/
   Remove-Item storage\flyers\SHA256SUMS
   ```
2. **En el VPS:** verificar integridad SHA-256, mover con permisos restrictivos (`750`/`640`, propietario `danyglock:danyglock`, fuera de `public/` y no servido por Nginx) y limpiar `/tmp`:
   ```bash
   ssh dany-vps '
     cd /tmp/dany-m006c-flyers &&
     sha256sum -c SHA256SUMS &&
     sudo install -d -o danyglock -g danyglock -m 750 /var/www/dany-glock/storage /var/www/dany-glock/storage/flyers &&
     sudo install -o danyglock -g danyglock -m 640 *.jpg /var/www/dany-glock/storage/flyers/ &&
     rm -rf /tmp/dany-m006c-flyers
   '
   ```
3. **Despliegue y carga en el VPS (como `danyglock`):**
   - `git pull --ff-only origin wip/mision-006a`
   - Respaldo `pg_dump -Fc` + `tar czf` de `media/` **antes** de cualquier comando `payload`
   - `pnpm payload migrate` (aplica `20261120_010900_add_event_archive_fields`, lote 4 en producción)
   - `node node_modules/.pnpm/tsx@*/node_modules/tsx/dist/cli.mjs src/scripts/import-stage-history.ts --dry-run` (revisión previa)
   - `node node_modules/.pnpm/tsx@*/node_modules/tsx/dist/cli.mjs src/scripts/import-stage-history.ts` (importa los 18 eventos en **borrador** y los 18 flyers **ocultos/pendientes** en `media/`)
   - Opcional tras confirmar `18 sin cambios` en una 2.ª corrida: eliminar `/var/www/dany-glock/storage/flyers/*.jpg` para no duplicar binarios en disco (Payload ya los almacena en `media/`), o conservarlos con permisos `750`/`640`.
   - Stop → `pnpm build` → start. No hace falta llamar a `POST /api/revalidate` tras importar (todo entra en borrador); cuando management apruebe y publique en `/admin`, los hooks revalidan automáticamente.

## 6. Cómo publicar un evento (admin)

1. Confirmar datos con el equipo (año, lugar, participación).
2. `Trazabilidad → Estado de verificación = Verificado`; completar `date` si el año está confirmado.
3. `Fuente y autorización → Aprobado para la web` (solo si el promotor/diseñador lo autoriza) y anotar quién aprobó.
4. Publicar. La página y el menú se actualizan solos.

## 7. Pendientes de aprobación

Los 18 eventos (ver tabla §2). Prioridad sugerida: los de año legible o muy probable (Pasto Vive Flow 2026, SIG Sauer Remix 2024, Baby Nico/EXCESO, Macondo/Cicatrices, Aniversario ATM 2025). Colorado Fest e INPEC no tienen fecha; INPEC requiere autorización especial.

## 8. Pruebas y auditoría de privacidad (M006-C + M006-C.1 — 2026-11-19)

- **Repositorio y Git:** remoto verificado **público** (`DanielCriollo/dany-glock`, GitHub API HTTP 200); `storage/flyers/` y `/flyers/` ignorados en `.gitignore`; 0 archivos de flyers en `git status` y 0 en historial completo de Git; 18/18 originales y copias locales conservados con SHA-256 idéntico.
- **Escaneo de datos sensibles:** 117 archivos versionables revisados (código, fixtures, migraciones, Project Brain): 0 teléfonos reales, 0 direcciones privadas, 0 enlaces WhatsApp/Nequi, 0 secretos/claves.
- **Migración (`20261120_010900_add_event_archive_fields`):** verificada en BD temporal aislada (`prod baseline 1..5` + fila previa `pasto-vive-flow-2026` → `up` → `down` → `down` idempotente → `up`, 0 pérdida de datos, compatible con PostgreSQL 16/17).
- **Calidad:** `tsc --noEmit` 0 errores · `next lint` 0 errores/warnings · Vitest **116/116** (9 suites; `src/tests/stage-history.test.tsx`: 20 pruebas, incluyendo exclusión en `.gitignore`, importador sin carpeta en Git, borrador con derechos aprobados bloqueado, despublicación revoca flyer, campos `usageRights.source`/`approvalNote` ocultos a anónimos) · `next build` OK (`/escenarios` ISR 1 h).
- **E2E contra `next start` local (`127.0.0.1:3007`):**
  - `verify-stage-history.ts` **25/25** (404 sin publicados; rutas estáticas `/storage/flyers/*`, `/flyers/*`, `/media/*` 404; archivo original y 3 variantes redimensionadas 403; `/_next/image` rechazado para no aprobados; `/api/media` y `/api/graphql` anónimos sin flyers ni borradores; borrador con derechos aprobados bloqueado; publicación temporal de 3 eventos con 2 flyers aprobados y 1 pendiente; `/_next/image` 200 mientras aprobado; API `/api/events?depth=2` sin `source`, `approvalNote`, notas ni flyer pendiente; restauración automática; flyer bloqueado y **caché `/_next/image` purgada inmediatamente tras revocar**).
  - `verify-revalidation.ts` **13/13** (regresión verde).
- **QA visual (M006-C):** desktop ~800–1440 px y móvil 375 px con publicación temporal y restauración automática, sin overflow horizontal y visor `<dialog>` validado.
- **Estado final verificado en BD local:** 18/18 eventos en borrador (`listing=archive`, `to_confirm`, `usageRights=pending`), 32/32 medios `event_flyer`/`live_photo` ocultos (`visible=false`, `rightsStatus=pending`), 0 eventos/flyers legibles por anónimos, 1 único usuario (`admin@danyglock.com`), 6 migraciones limpias.

---

## 9. Auditoría y corrección de estados editoriales (Misión 006-C.4)

### Diagnóstico de causa raíz (Payload CMS 3.91)
- Al inspeccionar `payload@3.91.0` (`createOperation`, `updateByIDOperation`, `utilities/update.js`, `saveVersion`) y reproducir el flujo en una BD PostgreSQL aislada con `NODE_ENV=production`:
  1. `payload.create({ collection: 'events', draft: true, data: { _status: 'draft', ... } })` **sí** crea 1 único registro en `events` (`_status = 'draft'`) y 1 única versión en `_events_v` (`version__status = 'draft', latest = true`). `createOperation` llama a `saveVersion` una sola vez.
  2. La existencia simultánea en producción de **17 versiones `draft` (`latest=false`) + 17 versiones `published` (`latest=true`)** y `events._status = 'published'` implica necesariamente una **segunda operación `update`** con `_status = 'published'` posterior a la creación inicial.
  3. **Brechas detectadas en el código:**
     - En `src/scripts/import-stage-history.ts`, la rama de actualización de borradores existentes (`payload.update`) omitía `draft: true`, lo que hacía que Payload ejecutara `utilities/update.js` con `isSavingDraft = false` (semántica de guardado completo en lugar de borrador); además, ni `create` ni `update` validaban `_status === 'draft'` en el documento retornado.
     - Aunque `/escenarios` devuelve `404` cuando `verification.status = 'to_confirm'` (filtrado en `getStageHistoryData()`), `Events.access.read` (`authenticatedOrPublished`) solo exige `_status = 'published'`: cualquier evento con `_status = 'published'` queda expuesto en `GET /api/events` y `POST /api/graphql` aunque no esté verificado.
- **Corrección y endurecimiento implementados:**
  - `src/scripts/import-stage-history.ts`: añadido `draft: true` en `payload.update` de borradores existentes y verificación estricta post-escritura (`created._status === 'draft'` y `updated._status === 'draft'`).
  - `src/scripts/repair-stage-history-drafts.ts`: script idempotente que usa exclusivamente la Local API oficial (`payload.find`, `payload.update` sin `draft: true` con `data: { _status: 'draft' }` para actualizar tabla principal e historial) sobre el lote cerrado de 17 slugs de archivo (`listing: 'archive'`, `verificationStatus: 'to_confirm'`, `usageRights.status: 'pending'`), excluyendo explícitamente `pasto-vive-flow-2026`. Valida precondiciones completas antes de escribir (aborta con 0 escrituras si el conteo !== 17 o si el estado es mixto), detiene inmediatamente ante fallo parcial sin rollback destructivo automático y verifica post-reparación que los 17 queden en `draft` y `pasto-vive-flow-2026` conserve `id`, `_status`, `listing` y `updatedAt`.
  - `src/scripts/verify-stage-history.ts`: separación explícita entre chequeos anónimos HTTP reales (`GET /api/events?limit=100` y `POST /api/graphql` sin cookies, autenticación ni `draft=true`) y consultas Local API (`overrideAccess: false, draft: false`).
  - `src/tests/stage-history.test.tsx`: aserciones directas sobre `events` y `_events_v` (`latest = true`) y suite §6 probando aborto seguro sin escrituras con lote incompleto, `--dry-run`, reparación completa de los 17, verificación post-reparación, preservación de `Media`/`usageRights`, intangibilidad de `pasto-vive-flow-2026`, ocultamiento anónimo `draft: false` e idempotencia.

### Procedimiento de reparación en producción (ver `14-vps-deployment.md` §12)
1. **Respaldo previo obligatorio:** verificación de directorio, permisos, `pg_dump -Fc` de `danyglock_db`, `chmod 600`, `test -s` y `pg_restore --list`.
2. **Simulación (`--dry-run`):** `pnpm dlx tsx src/scripts/repair-stage-history-drafts.ts --dry-run` (compatible con VPS sin `tsx` local) debe inspeccionar 17 candidatos sin escrituras.
3. **Ejecución controlada:** `pnpm dlx tsx src/scripts/repair-stage-history-drafts.ts`, seguido de una 2.ª corrida idempotente (`repaired: 0`, `alreadyDraft: 17`, `verifiedAllDraftAfter: true`, `protectedEventIntact: true`).
4. **Verificación pública anónima HTTP real (sin cookies, sin auth y sin `draft=true`):** `GET /api/events?limit=100` (solo `pasto-vive-flow-2026`, `totalDocs: 1`), `POST /api/graphql`, `/escenarios` (`404`), `/api/media/file/escenario-*.jpg` (`403`).
5. **Contingencia sin rollback destructivo automático:** ante fallo parcial, detener ejecución, diagnosticar estado en BD y reintentar o restaurar manualmente desde el dump validado. Ninguna operación toca otros proyectos del VPS compartido.
