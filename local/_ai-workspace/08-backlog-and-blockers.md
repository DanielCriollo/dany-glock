# 08 — Registro de Pendientes y Bloqueos (Backlog & Blockers)

## 1. Bloqueos Activos

- **[BLK-01 — RESUELTO] Incompatibilidad de versión de Node.js con `payload@latest` (3.92.0):**
  - **Resolución:** Conforme a la aprobación del usuario, se fijó la versión de Payload CMS en `3.91.0` (cuyo requisito es `node >=20.18.1`), permitiendo mantener de forma estable el runtime `Node.js v22.12.0` sin requerir modificaciones en el sistema operativo local ni afectar otros entornos.
  - **Estado:** Resuelto (ver ADR-009). Cero bloqueos activos para la Misión 003.



---

## 2. Riesgos Técnicos Monitoreados y Mitigaciones

| Riesgo Técnico | Severidad | Probabilidad | Estrategia de Mitigación |
| :--- | :--- | :--- | :--- |
| **Peer Dependencies entre React 19 y Librerías de Terceros** | Media | Baja | Usar `pnpm` como gestor de paquetes (gestiona dependencias peer de forma estricta). La última versión estable de Payload 3.25+ ya está optimizada para React 19. |
| **Desalineación de Coordenadas de Scroll en GSAP al cambiar de ruta** | Media | Media | Implementar un listener centralizado en el layout que invoque `ScrollTrigger.refresh()` tras cada evento de navegación de Next.js. |
| **Fricción de Migraciones de Base de Datos en PostgreSQL** | Alta (en producción) / Baja (en local) | Baja | Usar `push: true` en el adaptador local para máxima agilidad durante el desarrollo. En la Misión 010 se generarán scripts de migración formales y versionados con `payload migrate`. |
| **Pesos de Fuentes Display y Tiempos de Carga (FOUT/FOIT)** | Baja | Media | Utilizar `next/font/google` o fuentes locales auto-hospedadas con formato WOFF2 optimizado y la propiedad `display: 'swap'`. |

---

## 3. Registro de Tareas de Misión 002 (Completadas Técnicamente)

- [x] **DS-01:** Definir la matriz completa de tokens de diseño semánticos en formato CSS Custom Properties y Tailwind Theme. *(Evidencia: `04-design-system-strategy.md`)*
- [x] **DS-02:** Diseñar la paleta de contrastes validada WCAG 2.1/2.2 AA para escala oscura (`ink`, `graphite`, `carbon`, `steel`) y jerarquía `crimson` / `ember`. *(Evidencia: script `local/design-preview/contrast.mjs` con ratios certificados > 4.5:1)*
- [x] **DS-03:** Seleccionar y documentar las tipografías definitivas (`Archivo` variable + `Instrument Serif` + `JetBrains Mono`) con escalas, interlineados y trackings editoriales. *(Evidencia: `04-design-system-strategy.md` y `ADR-007`)*
- [x] **DS-04:** Diseñar la especificación técnica de las animaciones cinemáticas (curvas Bézier, duraciones, estados de hover, enfoque CSS-first + GSAP y accesibilidad `prefers-reduced-motion`). *(Evidencia: `11-motion-system.md` y `ADR-008`)*
- [x] **DS-05:** Especificar los estados y anatomía accesible del reproductor de audio flotante persistente. *(Evidencia: `10-components.md §10`)*
- [x] **DS-06:** Crear la guía de diseño para el Electronic Press Kit (EPK), ficha de lanzamiento musical y recorrido narrativo de la Home. *(Evidencia: `10-components.md` y `12-home-visual-architecture.md`)*

> **Nota de Aprobación Humana:** La conformidad estética del Style Tile (`local/design-preview/style-tile.html`) queda abierta a revisión humana del usuario/director creativo antes de la maquetación final en producción.

---

## 4. Registro de Tareas de Misión 003 (Project Bootstrap & Engineering Foundation)

- [x] **TL-01:** Inicializar proyecto base con Next.js 15 App Router y TypeScript estricto mediante `pnpm`. *(Evidencia: `package.json`, `tsconfig.json`, `next.config.ts`, `pnpm-lock.yaml`)*
- [x] **TL-02:** Configurar Tailwind CSS v3.4 mapeando los tokens semánticos aprobados en `src/app/globals.css` y `tailwind.config.ts`. *(Evidencia: `globals.css` con variables CSS y tema Tailwind)*
- [x] **TL-03:** Configurar fuentes autoalojadas con `next/font/google` (`Archivo`, `Instrument Serif`, `JetBrains Mono`) con fallback métrico anti-CLS. *(Evidencia: `src/app/fonts.ts`)*
- [x] **TL-04:** Configurar entorno de pruebas con Vitest y React Testing Library. *(Evidencia: `vitest.config.ts`, `src/lib/utils.test.ts` con 3 tests unitarios pasados)*
- [x] **TL-05:** Establecer la estructura de directorios modular (`src/app/(public)`, `src/components/`, `src/lib/`), scaffold de prueba y scripts de verificación (`pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build`). *(Evidencia: build exitoso en 15s)*

---

## 5. Registro de Tareas de Misión 004 (Payload CMS 3 Integration & Core Data Models)

- [x] **CMS-01:** Instalar paquetes core de Payload CMS versión `3.91.0` (`payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `graphql`, `sharp`). *(Evidencia: `package.json`, `pnpm-lock.yaml`)*
- [x] **CMS-02:** Configurar base de datos PostgreSQL local (`dany_glock_dev`) con credenciales en `.env.local` y conexión verificada en puerto 5432. *(Evidencia: Docker `my_postgres`, tablas creadas y consultadas)*
- [x] **CMS-03:** Crear `src/payload.config.ts` y configurar `withPayload()` en `next.config.ts`. *(Evidencia: `src/payload.config.ts`, `next.config.ts`)*
- [x] **CMS-04:** Configurar rutas del panel de administración en `src/app/(payload)/admin/` y endpoints de API en `src/app/(payload)/api/`. *(Evidencia: rutas `page.tsx`, `layout.tsx`, `route.ts` REST y GraphQL operativas)*
- [x] **CMS-05:** Implementar colecciones esenciales de datos: `Users`, `Media`, `Releases`, `Tracks`, `Videos`, `Events`, `Articles`, `Contacts` con validaciones e integridad referencial. *(Evidencia: `src/collections/*.ts`, migración SQL ejecutada)*
- [x] **CMS-06:** Implementar configuraciones globales: `ArtistProfile` y `SiteSettings` con control de acceso. *(Evidencia: `src/globals/*.ts`)*
- [x] **CMS-07:** Generar archivo de tipos TypeScript `src/payload-types.ts`, importMap y verificar compilación estricta sin errores (`tsc`, `lint`, `test`, `build` todos en PASS). *(Evidencia: `src/payload-types.ts`, `next build` exitoso)*

---

## 5-B. Registro de Tareas de Misión 004-B (Security Hardening & CMS Regression Tests)

- [x] **SEC-01:** Invalidación y rotación criptográfica de contraseña administrativa; eliminación de credenciales en texto plano en `seed-admin.ts`. *(Evidencia: `src/scripts/seed-admin.ts`, `src/scripts/rotate-admin-password.ts`)*
- [x] **SEC-02:** Protección integral del formulario de contacto: honeypot `websiteHoneypot`, rate limiting en memoria (`src/lib/rate-limiter.ts`), restricción de inyección de `status` y límites de longitud en servidor. *(Evidencia: `src/collections/Contacts.ts`, migración SQL)*
- [x] **SEC-03:** Creación y ejecución de suite automatizada de pruebas de regresión con Vitest (`src/tests/cms-security.test.ts`) certificando 14 casos críticos de seguridad (100% pasando).
- [x] **SEC-04:** Verificación y paridad de seguridad en GraphQL (`/api/graphql` rechaza consultas de contactos anónimos con GraphQLError 403 y oculta borradores).
- [x] **SEC-05:** Cero fallos en compilación estricta: `typecheck`, `lint`, `test` y `build` pasando en verde. *(Evidencia: build exitoso en 20s)*

---

## 6. Registro de Tareas de Misión 005 (Cinematic Layout & Kinetic Navigation)

- [x] **LAY-01:** Implementar Shell estructural público (`src/app/(public)/layout.tsx`) conectando tipografías, metadatos dinámicos, skip link accesible y tokens visuales. *(Evidencia: `src/app/(public)/layout.tsx`)*
- [x] **LAY-02:** Diseñar e integrar la Barra de Navegación Cinematográfica (`SiteHeader`) con detección de scroll (>40px), glassmorphism scrim y estados reactivos. *(Evidencia: `src/components/layout/SiteHeader.tsx`)*
- [x] **LAY-03:** Construir el Menú Editorial (`EditorialMenu`) mediante elemento `<dialog>` nativo accesible, atrapamiento de foco, soporte para tecla Escape, tipografía póster gigante y compatibilidad con `prefers-reduced-motion`. *(Evidencia: `src/components/layout/EditorialMenu.tsx`)*
- [x] **LAY-04:** Implementar el Footer Cinematográfico (`SiteFooter`) conectado al CMS mediante Payload Local API (`findGlobal`), bloque de booking/prensa, enlaces de plataformas, manifiesto y wordmark gigante con sangrado visual. *(Evidencia: `src/components/layout/SiteFooter.tsx`)*
- [x] **LAY-05:** Evaluación de scroll nativo y movimiento cinematográfico (conforme a ADR-008, se priorizó CSS nativo sin instalar Lenis ni secuestrar el scroll, respetando navegación por anclas y accesibilidad). *(Evidencia: ADR-008 y ADR-012)*
- [x] **LAY-06:** Conectar el layout público y la página temporal (`src/app/(public)/page.tsx`) con la Local API de Payload (`getPayload({ config })`, `overrideAccess: false`) para alimentar datos reales del perfil del artista en Server Components. *(Evidencia: `page.tsx`, `layout.tsx`, `SiteFooter.tsx`)*
- [x] **LAY-07:** Creación de suite automatizada de pruebas para el layout y navegación (`src/tests/layout-navigation.test.tsx`), pasando el 100% de tests (23/23).

---

## 6-B. Registro de Tareas de Misión 006-A.1 (Real Artist Data Seeding & CMS Expansion)

- [x] **DATA-01:** Implementar grupo de trazabilidad y verificación de fuentes (`src/fields/verification.ts`) con estados `verified`, `to_confirm`, `editorial_proposal` y campo de notas interno protegido por RBAC. *(Evidencia: `src/fields/verification.ts`)*
- [x] **DATA-02:** Ampliar esquemas de colecciones (`Releases`, `Tracks`, `Videos`, `Events`, `Articles`) y Globals (`ArtistProfile`, `SiteSettings`) con roles de artista, YouTube IDs, duraciones, galerías y versión con borradores. *(Evidencia: `src/collections/*.ts`, `src/globals/*.ts`)*
- [x] **DATA-03:** Generar y aplicar migración versionada no destructiva en PostgreSQL 17 (`20261023_150557_add_artist_data_and_verification.ts`) con sentencias idempotentes y seguras contra tipos existentes. *(Evidencia: `payload migrate:status` con 3 lotes completados)*
- [x] **DATA-04:** Crear script de siembra reproducible e idempotente (`src/scripts/seed-artist-data.ts`) alimentado exclusivamente de `13-research-inventory.md` (4 lanzamientos verificados, 1 borrador, 5 canciones, 6 videos oficiales de YouTube, globals en Pasto/Colombia y 1 evento borrador). *(Evidencia: ejecución doble con 0 duplicados)*
- [x] **DATA-05:** Proteger estrictamente los borradores (`sig-sauer-remix`, `pasto-vive-flow-2026`) para que no se publiquen accidentalmente ni sean legibles por usuarios anónimos. *(Evidencia: `src/tests/artist-data-seed.test.ts`)*
- [x] **DATA-06:** Fortalecer utilidades de contenido `src/lib/content-utils.ts` con validación estricta de dominios de YouTube, URLs de miniaturas y slugs normalizados con 9 pruebas unitarias. *(Evidencia: `src/lib/content-utils.test.ts`)*
- [x] **DATA-07:** Certificación total de calidad: 39/39 pruebas pasando en Vitest, `typecheck` en 0 errores, `lint` en 0 errores, `build` de Next.js 15 completado al 100%.

---

## 7. Backlog Preparado para Misión 006-A.2 (Conexión de Vistas Públicas con Datos Reales del CMS)

- [ ] **PUB-01:** Conectar el Hero de la Home al último lanzamiento oficial (`Cicatrices` / `SO FRESH, SO CLEAN`) consumido desde Payload Local API en Server Components.
- [ ] **PUB-02:** Renderizar enlaces oficiales verificados de YouTube, Apple Music e Instagram en el header y footer desde `site-settings`.
- [ ] **PUB-03:** Validar que los borradores del CMS (`sig-sauer-remix`, `pasto-vive-flow-2026`) devuelvan 404 para peticiones públicas anónimas.
- [ ] **PUB-04:** Configurar estados visuales elegantes (*empty states*) para secciones sin contenido publicado (Shows, Journal).

---

## 8. Backlog Preparado para Misión 006-B (Discografía, Reproductor y Lanzamientos)

- [ ] **HOM-01:** Escena 1 — Hero Cinematográfico con soporte de video loop (WCAG 2.2.2 control de pausa), tipografía póster sangrada y CTA dinámico de último lanzamiento.
- [ ] **HOM-02:** Escena 2 — Último Lanzamiento (Single Spotlight) con arte de portada, ficha técnica, enlaces a plataformas y micro-reproductor de preescucha.
- [ ] **HOM-03:** Escena 3 — Manifiesto Editorial & Biografía de autor con tipografía `Instrument Serif` y composición asimétrica controlada.
- [ ] **HOM-04:** Escena 4 — Discografía & Catálogo Filtrable (Singles, EPs, Álbumes) conectado a colección `Releases` y `Tracks`.
- [ ] **HOM-05:** Escena 5 — Galería Audiovisual (Videoclips & Directos) con modales accesibles y badges de dirección de arte.
- [ ] **HOM-06:** Escena 6 — Tour & Próximos Shows con estado dinámico de boletería (`sold-out`, `tickets`, `anuncio`) conectado a `Events`.
- [ ] **HOM-07:** Escena 7 — Journal Editorial & Notas de Prensa conectado a colección `Articles`.
- [ ] **HOM-08:** Escena 8 — Direct Booking & Contact Form con validación en servidor, protección honeypot y rate limiting.



