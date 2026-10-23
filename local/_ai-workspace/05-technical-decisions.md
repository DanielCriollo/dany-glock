# 05 — Registro de Decisiones Arquitectónicas (ADRs)

Este documento registra las decisiones arquitectónicas fundamentales tomadas para el proyecto **Dany Glock — Artist Digital Experience**, siguiendo el formato estándar ADR (Architectural Decision Record).

---

## ADR-001: Adopción del Monolito Unificado (Next.js 15 App Router + Payload CMS 3.x) frente a Astro + CMS Desacoplado

- **Estado:** Aceptado
- **Fecha:** Octubre 2026
- **Contexto:**  
  Se requería evaluar la arquitectura óptima para una experiencia web musical inmersiva con panel administrativo integrado, excelente SEO y capacidad de despliegue futuro en un único VPS de OVHcloud sin sobrecargar infraestructura ni incurrir en sobreingeniería. Se evaluaron dos modelos:
  1. Monolito unificado con Next.js 15 y Payload CMS 3.0 ejecutándose dentro de la misma aplicación.
  2. Frontend estático con Astro conectado a un CMS desacoplado (Headless CMS independiente como Strapi o Directus).
- **Decisión:**  
  Adoptar el **Monolito Unificado de Next.js 15 App Router con Payload CMS 3.x nativo**.
- **Consecuencias:**  
  - *Positivas:*
    - Un solo proyecto, un solo repositorio, un solo proceso Node.js a gestionar y monitorear en el VPS.
    - La consulta de datos en Server Components se realiza mediante la Local API de Payload (`getPayload`), eliminando el 100% de la latencia de red HTTP interna.
    - Generación automática de tipos TypeScript (`payload-types.ts`) compartidos de extremo a extremo sin herramientas intermedias.
    - Soporte nativo para previsualización en vivo (Live Preview) en tiempo real con Next.js Draft Mode.
    - Facilidad total para mantener un reproductor de audio persistente e ininterrumpido en el cliente mientras se navega entre rutas.
  - *Negativas / Mitigaciones:*
    - Requiere un servidor con entorno Node.js activo en lugar de un alojamiento estático puro (resuelto: el despliegue final previsto es un VPS de OVHcloud con Docker o PM2).

---

## ADR-002: Estrategia Híbrida de Animación y Scroll (GSAP + ScrollTrigger + Lenis + Motion)

- **Estado:** Aceptado
- **Fecha:** Octubre 2026
- **Contexto:**  
  La experiencia Dark Cinematic Editorial requiere animaciones complejas: scroll suave cinematográfico, revelados sincronizados por scroll (*scrubbing* y *pinning*), pero también micro-interacciones ágiles y fluidas en componentes React (reproductor de música, botones magnéticos, acordeones de letras y modales).
- **Decisión:**  
  Implementar una **estrategia de animación por capas especializadas**:
  1. **Lenis (`lenis/react`):** Motor de smooth scroll global inercial.
  2. **GSAP + ScrollTrigger (`@gsap/react`):** Animaciones dependientes de la posición del scroll (línea de tiempo de la discografía, efectos de carátula anclada, paralaje cinematográfico). Se sincroniza el tick de Lenis dentro del ticker de GSAP.
  3. **Motion (`motion`):** Animaciones declarativas de interfaz (transición entre canciones, modales, menú móvil desplegable y estados hover elásticos).
- **Consecuencias:**  
  - *Positivas:* Lo mejor de ambos mundos: máxima potencia y precisión en scroll editorial con GSAP, y facilidad de uso declarativa en React con Motion.
  - *Mitigaciones:* Para evitar fugas de memoria o desalineaciones en transiciones de ruta, se obliga al uso estricto del hook `useGSAP()` con scope y llamada a `ScrollTrigger.refresh()` en los cambios de página.

---

## ADR-003: Motor de Persistencia Relacional (PostgreSQL + Drizzle ORM)

- **Estado:** Aceptado
- **Fecha:** Octubre 2026
- **Contexto:**  
  Payload CMS 3 soporta adaptadores para MongoDB, SQLite y PostgreSQL. Se requería una base de datos robusta, escalable, con integridad relacional fuerte para conectar canciones, lanzamientos, eventos y archivos de prensa, que pueda correr tanto en local como en un VPS.
- **Decisión:**  
  Utilizar **PostgreSQL 16/17** a través del adaptador oficial `@payloadcms/db-postgres` (basado en Drizzle ORM).
- **Consecuencias:**  
  - *Positivas:*
    - Integridad referencial nativa (relaciones 1:N y N:M estrictas entre álbumes, pistas y artistas colaboradores).
    - Consultas SQL fuertemente optimizadas y con cero latencia mediante Drizzle ORM.
    - Herramienta `psql` ya disponible e instalada en el entorno local del desarrollador (PostgreSQL 17 verificado).
    - Facilidad absoluta para respaldos automatizados (`pg_dump`) y migración hacia el VPS de OVHcloud.
  - *Mitigaciones:* En desarrollo local se utilizará la opción `push: true` en el adaptador para agilidad. En fases posteriores a la producción, se generarán migraciones versionadas.

---

## ADR-004: Capa de Estilos (Tailwind CSS v3.4 + Variables CSS Custom para Tokens)

- **Estado:** Aceptado
- **Fecha:** Octubre 2026
- **Contexto:**  
  Se requería un sistema de estilos ágil, ultra-optimizado para producción, altamente mantenible y compatible con el panel de administración de Payload 3 y los componentes accesibles de Radix UI.
- **Decisión:**  
  Adoptar **Tailwind CSS v3.4** complementado con **Variables CSS Semánticas** en `globals.css` para los tokens de diseño (colores Void/Obsidian/Amber, fuentes, curvas bézier).
- **Consecuencias:**  
  - *Positivas:* Estabilidad absoluta comprobada con Next.js 15, PostCSS y Payload 3. Cero CSS no utilizado en producción.
  - *Mitigaciones:* Se evita temporalmente Tailwind v4 en esta fase inicial para evitar incompatibilidades con librerías del ecosistema de componentes headless y plugins de terceros.

---

## ADR-005: Gestión de Medios y Electronic Press Kit (EPK)

- **Estado:** Aceptado
- **Fecha:** Octubre 2026
- **Contexto:**  
  El artista maneja activos pesados: portadas de álbumes en alta definición, fotografías de prensa de gran tamaño, audios de preview y dossiers en PDF.
- **Decisión:**  
  Gestionar los archivos multimedia mediante la colección `media` de Payload CMS, respaldada por la librería de procesamiento de imagen de alto rendimiento `sharp`. Los audios de previa se almacenarán localmente optimizados en formato MP3/AAC con bitrate controlado (192 kbps), mientras que los videoclips completos se alojarán e incrustarán desde YouTube para maximizar la velocidad de carga y no consumir ancho de banda innecesario del VPS.
- **Consecuencias:**  
  - *Positivas:* Carga ultra-rápida, generación automática de miniaturas y formatos modernos (WebP/AVIF), descargas organizadas para la prensa en el EPK.

---

## ADR-006: Paleta Carmesí Nocturna y Sustitución del Acento Oro Festivo

- **Estado:** Aceptado (Sustituye la paleta preliminar de la Misión 001)
- **Fecha:** Octubre 2026 (Misión 002)
- **Contexto:**  
  En la Misión 001 se propuso un acento primario ámbar/oro (`#e5a93c`) y un acento secundario carmesí (`#e0283c`). Al evaluar la identidad visual completa *Dark Cinematic Editorial*, la combinación de negro, oro y rojo evocaba una estética festiva o de lujo corporativo tradicional que chocaba con la crudeza sofisticada de la música urbana contemporánea. Además, los cálculos de luminancia revelaron que usar carmesí puro (`#B3122E`) como color de texto sobre fondo negro produce un contraste de apenas 2.87:1, violando el criterio WCAG 2.2 AA (mínimo 4.5:1).
- **Decisión:**  
  Adoptar una paleta de negros profundos y superficies neutras (`ink` `#0A0A0B`, `graphite` `#141416`, `carbon` `#1C1C1F`, `steel` `#2A2A2E`) combinada con textos en blanco hueso cálido (`bone` `#EDEAE4`, `ash` `#A8A49E`, `smoke` `#8A8680`) y una jerarquía cromática carmesí estricta:
  1. `crimson` (`#B3122E`): Color de marca oficial. Usado **únicamente como relleno sólido** en botones primarios y bloques destacados. Con texto `bone` alcanza un contraste de 5.75:1 (pasa AA). Prohibido su uso como color de texto sobre fondo oscuro.
  2. `crimson-signal` (`#E1243F`): Destinado a elementos gráficos no textuales, halos luminosos y puntos de estado "en vivo" (contraste ≥ 3.66:1 sobre superficies oscuras).
  3. `crimson-text` (`#FF5468`): Carmesí calibrado para tipografía, enlaces y anillo de foco por teclado, con un contraste certificado de 6.33:1 sobre `ink` (supera holgadamente el requisito de 4.5:1).
  4. `ember` (`#C8A27A`): Color secundario (luz de tungsteno/sodio) con uso **estrictamente restringido** a etiquetas de estado temporal ("Preventa" / "Próximamente"). 8.39:1 sobre `ink`.
- **Consecuencias:**  
  - *Positivas:* Coherencia estética cinematográfica, foco visual contundente y cumplimiento matemático estricto de accesibilidad WCAG 2.2 AA.
  - *Mitigaciones:* Los componentes deben consumir exclusivamente tokens semánticos (ej. `--color-fg-accent`, `--color-focus`), impidiendo el uso accidental de `#B3122E` en textos.

---

## ADR-007: Sistema Tipográfico Editorial con Autoalojamiento OFL (Archivo + Instrument Serif + JetBrains Mono)

- **Estado:** Aceptado (Sustituye las propuestas exploratorias de Syne y Clash Display)
- **Fecha:** Octubre 2026 (Misión 002)
- **Contexto:**  
  La Misión 001 consideró tipografías como `Syne` y `Clash Display`. Sin embargo, `Clash Display` depende de Fontshare (requiere gestión externa de fuentes y no se integra nativamente en el pipeline de `next/font/google`), mientras que `Syne` posee un uso saturado en sitios web genéricos y carece de eje condensado para titulares tipo póster.
- **Decisión:**  
  Consolidar el sistema en tres familias de código abierto bajo licencia SIL Open Font License (OFL), garantizando autoalojamiento automático y cero peticiones externas en producción:
  1. **`Archivo` (Fuente Variable):** Ejes `wdth` (62 a 125) y `wght` (100 a 900). Resuelve en una sola fuente los titulares gigantes extra-condensados de póster (`wdth 62`, `wght 850`), los subtítulos y el texto corrido de lectura (`wdth 100`, `wght 400`). Minimiza descargas y previene Layout Shifts (CLS) mediante ajuste métrico de fallback.
  2. **`Instrument Serif` (Regular + Italic):** Utilizada como contrapunto editorial de revista para citas de prensa, capitulares y números destacados (solo en tamaños ≥ 24px).
  3. **`JetBrains Mono` (400, 500):** Utilizada con moderación para metadatos técnicos, duraciones `03:42`, códigos ISRC y fechas en formato claqueta.
- **Consecuencias:**  
  - *Positivas:* Máximo rendimiento (menos archivos WOFF2), flexibilidad compositiva total con una tipografía variable y cero deuda de licenciamiento comercial.

---

## ADR-008: Estrategia de Movimiento CSS-First y GSAP (Aplazamiento de Motion y Lenis)

- **Estado:** Aceptado (Actualiza y precisa el ADR-002 de la Misión 001)
- **Fecha:** Octubre 2026 (Misión 002)
- **Contexto:**  
  El ADR-002 planteó la integración simultánea de Lenis + GSAP + Motion. En la Misión 002 se verificó el soporte moderno de navegadores (CSS scroll-driven animations disponible en Chrome/Edge 115+, Safari 26+ y Firefox 160+) y la capacidad del elemento nativo `<dialog>` de HTML5 con `@starting-style` para transiciones de modales y menús sin librerías.
- **Decisión:**  
  Reorganizar el sistema de animación bajo una jerarquía **CSS-First**:
  1. **CSS Puro:** Microinteracciones (hover, focus, pressed), animación de entrada del hero (garantiza render inmediato del titular y protege el LCP antes de hidratación de JavaScript) y revelados estándar por scroll mediante `animation-timeline: view()` como mejora progresiva.
  2. **GSAP 3.15 + ScrollTrigger:** Reservado exclusivamente para scroll complejo en desktop (`lg+`), específicamente pinning de carátulas discográficas y revelados tipográficos sincronizados (*scrub*). Todos los plugins de GSAP son gratuitos y comerciales desde v3.13.
  3. **Descarte de Motion (`motion`):** No se incorpora en esta fase. Los modales y transiciones de estado se resuelven con CSS y `<dialog>`, evitando duplicar herramientas de animación y ahorrando sobrecarga en el bundle de cliente.
  4. **Aplazamiento de Lenis (`lenis`):** El smooth scroll forzado altera el comportamiento nativo del navegador, navegación por teclado y atajos. Se aplaza su evaluación a la Misión 005 como prueba opcional sujeta a medición de INP y accesibilidad.
  5. **Accesibilidad Obligatoria:** Todo movimiento se desactiva o sustituye por estados estáticos legibles cuando el usuario tiene activo `prefers-reduced-motion: reduce`.
- **Consecuencias:**  
  - *Positivas:* Bundle JavaScript ultra-ligero, respeto riguroso a Core Web Vitals y compatibilidad total con Server Components.

---

## ADR-009: Gestión de Compatibilidad de Motores (Node.js vs Payload CMS 3.x) y Estrategia de Fijación

- **Estado:** Aceptado (Aprobado por el usuario en Misión 003)
- **Fecha:** Octubre 2026
- **Contexto:**  
  Durante la investigación obligatoria de compatibilidad previa a la instalación de dependencias en la Misión 003, se contrastaron las versiones del registro npm:
  - Versión instalada en el sistema local: `Node.js v22.12.0`.
  - Versión `@latest` de Payload: `payload@3.92.0`.
  - Requisito de motor (`engines.node`) en `payload@3.92.0`: `^22.23.4 || >=24.22.1`.
  - Requisito en versiones anteriores (`payload@3.91.0` y menores): `>=20.18.1` (totalmente compatible con Node 22.12.0).
  - Regla mandatoria del proyecto: *"Condición crítica: la instalación actual detectada en M001 fue Node.js 22.12.0. Verificar si cumple los requisitos actuales de Payload. Si no cumple, documentar la actualización necesaria y detener la instalación hasta resolverla de manera segura."*
- **Alternativas Evaluadas:**
  1. **Alternativa A (Fijar Payload en `3.91.0` - SELECCIONADA):** Permite continuar el desarrollo en el entorno actual sin requerir cambios de permisos ni alterar el binario global de Node.js en Windows. `3.91.0` es una versión estable y madura de Payload 3 con soporte completo de App Router y compatibilidad con `next@15.4.11`.
  2. **Alternativa B (Actualizar Node.js en el sistema a `>=22.23.4` o `>=24.22.1`):** Permite usar la versión de corte más reciente (`payload@3.92.0`). El sistema dispone de `fnm` (`fnm install 22.23.4` o `fnm install 24.22.1`), pero modificar el runtime del sistema operativo no fue necesario al contar con la alternativa A.
- **Decisión:**  
  Fijar Payload CMS en `3.91.0` y emparejar con `next@15.4.11`, `react@^19.0.0` y Node.js `22.12.0`. El bloqueo BLK-01 queda resuelto de forma segura.
- **Consecuencias:**  
  - Se previene contaminación de `node_modules` y fallos silenciosos de compilación de Drizzle/Payload en Next.js.
  - Cero deuda técnica generada.

---

## ADR-010: Arquitectura de Seguridad, Modelo Relacional y Control de Acceso en Payload CMS 3 con PostgreSQL 17

- **Estado:** Aceptado (Implementado en Misión 004)
- **Fecha:** Octubre 2026
- **Contexto:**  
  La integración de Payload CMS 3 en Next.js App Router requiere definir el modelo relacional, las políticas de seguridad (Principio de Mínimo Privilegio) y la persistencia de datos en PostgreSQL 17:
  1. Los mensajes de contacto y solicitudes de booking contienen información comercial confidencial.
  2. Los borradores editoriales y lanzamientos inéditos no deben filtrarse a visitantes anónimos bajo ninguna circunstancia.
  3. Las relaciones entre entidades (`releases` <-> `tracks`, `media` <-> `releases`) deben contar con integridad referencial a nivel de base de datos.
- **Decisión:**  
  1. **Control de Acceso Estricto (RBAC + Contextual):**
     - `Contacts`: Lectura restringida exclusivamente a usuarios autenticados (`req.user`). La creación permanece abierta públicamente para procesar formularios del sitio web.
     - `Releases`, `Articles`, `Videos`: Acceso público condicionado a `_status === 'published'`. Los documentos en estado `draft` son invisibles para usuarios anónimos (retornan 404 por ID o se filtran en listas).
     - `Users`: Creación y borrado restringidos a `admin`. Auto-edición permitida para el propio usuario.
     - `Globals` (`ArtistProfile`, `SiteSettings`): Lectura pública, actualización autenticada.
  2. **Persistencia e Integridad Referencial:**
     - Uso de base de datos exclusiva `dany_glock_dev` en PostgreSQL 17 local.
     - Migraciones versionadas mediante Payload CLI (`src/migrations/20261023_054057_initial_setup.ts`).
     - Llaves foráneas y restricciones ON DELETE gestionadas por el adaptador `@payloadcms/db-postgres`.
  3. **Tipado Estricto:**
     - Generación automatizada de tipos TypeScript en `src/payload-types.ts` mediante `payload generate:types`.
- **Consecuencias:**  
  - *Positivas:* Seguridad verificada mediante tests HTTP (403 en contactos y usuarios anónimos, 404 en borradores sin autenticación). Cero exposición de datos sensibles. Integridad referencial garantizada.

---

## ADR-011: Blindaje de Seguridad, Mitigación Anti-Spam y Pruebas de Regresión para Payload CMS

- **Estado:** Aceptado (Implementado en Misión 004-B)
- **Fecha:** Octubre 2026
- **Contexto:**  
  La auditoría de seguridad post-Misión 004 identificó áreas críticas de endurecimiento:
  1. Necesidad de eliminar credenciales por defecto de los scripts de inicialización (`seed-admin.ts`) e implementar rotación criptográfica.
  2. Blindaje de formularios de contacto públicos contra bots automatizados y ataques de denegación de servicio (DoS) sin requerir servicios externos de terceros (como reCAPTCHA o Cloudflare Turnstile).
  3. Protección a nivel de campo: impedir que solicitudes anónimas inyecten valores en campos de gestión interna como `status` en la colección `contacts`.
  4. Garantizar paridad de seguridad en la capa GraphQL frente a REST y Local API.
- **Decisión:**  
  1. **Higiene Criptográfica y Credenciales Dinámicas:**
     - `src/scripts/seed-admin.ts` refactorizado para leer credenciales estrictamente desde variables de entorno (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).
     - Creación de script `src/scripts/rotate-admin-password.ts` que permite rotar contraseñas administrativas sin registrar texto plano en terminales ni logs.
     - `payload.config.ts`: Obligatoriedad de `PAYLOAD_SECRET` en producción con fallo inmediato si no está definida.
  2. **Protección Multi-Capa en Formulario de Contacto:**
     - **Honeypot:** Campo oculto `websiteHoneypot` en `Contacts` con rechazo inmediato si contiene datos.
     - **Rate Limiting:** Implementación en memoria (`src/lib/rate-limiter.ts`) de ventana deslizante (máximo 5 envíos por ventana de 10 min por IP/correo).
     - **Control de Creación de Campo:** `status.access.create` restringido a usuarios autenticados.
     - **Validación Estricta:** Longitudes mínimas y máximas en nombre (2-100), mensaje (10-3000) y teléfono (30).
  3. **Suite Automatizada de Pruebas de Regresión:**
     - Creación de `src/tests/cms-security.test.ts` con 14 casos de prueba automatizados en Vitest que evalúan aislamiento de borradores, permisos RBAC de usuarios/editores, protección de Globals y rechazo de spam.
- **Consecuencias:**  
  - *Positivas:* Eliminación de cualquier vector de inyección en formularios públicos, 17 pruebas unitarias y de regresión pasando en verde, paridad total de seguridad en REST y GraphQL.

---

## ADR-012: Arquitectura del Layout Cinemático, Kinetic Navigation y Menú Modal Nativo (`<dialog>`)

- **Estado:** Aceptado (Implementado en Misión 005)
- **Fecha:** Octubre 2026
- **Contexto:**  
  La experiencia pública de Dany Glock requiere una interfaz editorial cinematográfica de alto impacto visual (Dark Cinematic Editorial) que garantice:
  1. Navegación fluida y adaptable al scroll tanto en desktop como en dispositivos móviles.
  2. Un menú lateral/overlay con composición tipográfica expresiva a gran escala (`display-lg`), con numeración mono (`01–06`).
  3. Cero dependencias pesadas innecesarias (no instalar Motion, no instalar Lenis por defecto per ADR-008).
  4. Accesibilidad total (WCAG 2.1 AA): atrapamiento de foco, soporte nativo para tecla `Escape`, retorno de foco al elemento activador y compatibilidad con `prefers-reduced-motion`.
  5. Consumo de metadatos globales (`artist-profile` y `site-settings`) en el Footer mediante Server Components utilizando la Local API de Payload CMS con reglas de acceso público estrictas (`overrideAccess: false`).
  6. Aislamiento absoluto de las rutas administrativas de Payload (`/admin`) y endpoints de API (`/api/`).
- **Decisión:**  
  1. **Uso del elemento `<dialog>` nativo de HTML5 para `EditorialMenu`:**
     - En lugar de instalar bibliotecas pesadas de modal o portal (`@radix-ui/react-dialog`, `framer-motion`), se utiliza `<dialog>` nativo controlado con `showModal()`.
     - Proporciona nativamente apilamiento en la capa superior (*top layer* del navegador), atrapamiento automático del foco accesible y captura del evento `cancel` (tecla `Escape`).
     - Al abrirse, bloquea el scroll del documento (`document.body.style.overflow = 'hidden'`) y devuelve el foco al botón disparador al cerrarse.
  2. **Efecto de Navegación Adaptativa al Scroll en `SiteHeader`:**
     - Detección reactiva pasiva de desplazamiento (`window.scrollY > 40`).
     - Al desplazarse, aplica un efecto scrim/glassmorphism (`bg-ink/85 backdrop-blur-md border-b border-white/10 shadow-2xl`), asegurando contraste y legibilidad impecables sobre cualquier contenido de fondo.
  3. **Footer Cinemático Server Component con Local API:**
     - `SiteFooter` se implementa como Server Component asíncrono que consulta en paralelo `artist-profile` y `site-settings` con `overrideAccess: false`.
     - Incorpora fallbacks elegantes y neutrales en caso de indisponibilidad de la base de datos.
     - Incluye bloque de booking/prensa, cuadrícula de 4 columnas, y wordmark de sangrado visual con escala responsiva `15vw`.
  4. **Preservación del Scroll Nativo (Respeto estricto a ADR-008):**
     - No se instala Lenis por defecto ni se secuestra el scroll de la ventana. La navegación entre anclas (`#musica`, `#videos`, `#tour`, `#journal`, `#press-kit`, `#contacto`) funciona de forma estándar, rápida y accesible con `scroll-behavior: smooth` nativo y clases de utilidad Tailwind `scroll-mt-24`.
  5. **Primitiva `Button` Polimórfica:**
     - `Button` soporta tanto `<button>` nativo como enlaces `<a>` / `<Link>` al pasar la propiedad `href`, unificando estilos y accesibilidad de CTAs.
- **Consecuencias:**  
  - *Positivas:* 0 kB añadidos por bibliotecas de modales o animaciones pesadas; accesibilidad nativa y robusta; bundle de primer carga ultraligero (106 kB First Load JS); aislamiento garantizado para `/admin`; 23/23 pruebas automatizadas pasando.

---

## ADR-013: Modelo de Trazabilidad de Fuentes, Idempotencia de Datos del Artista y Sincronización en Payload CMS

- **Estado:** Aceptado (Implementado en Misión 006-A.1)
- **Fecha:** Octubre 2026
- **Contexto:**
  1. Durante la evolución del proyecto, los scaffolds iniciales contenían placeholders inventados (Quetzaltenango/Guatemala, correos falsos `@danyglock.com`, datos de booking no confirmados).
  2. La investigación real (documentada en `local/_ai-workspace/13-research-inventory.md`) demostró que Dany Glock es un artista de música urbana y trap originario de Pasto, Nariño, Colombia, con discografía en Apple Music (`1739565666`), canal oficial en YouTube (`@danyglock` / `UCf-4AJMV8QZz1jj4OVBzaxg`) e Instagram (`@danyglock_`).
  3. No se debe publicar información no corroborada como un hecho en la web pública. Se requerían estados estrictos de trazabilidad (`verified`, `to_confirm`, `editorial_proposal`).
  4. Los lanzamientos o eventos no confirmados formalmente (p. ej., `SIG Sauer (Remix)` y el evento `Pasto Vive Flow 2026`) deben persistir en PostgreSQL como borradores (`_status: 'draft'`) protegidos de consultas públicas anónimas.
  5. La siembra de datos debe ser estrictamente idempotente: ejecutarla múltiples veces no debe generar filas duplicadas en PostgreSQL ni sobreescribir datos existentes.
- **Decisión:**
  1. **Grupo de Campo Reutilizable `verificationField`:**
     - Implementado en `src/fields/verification.ts` e integrado en `Releases`, `Tracks`, `Videos`, `Events`, `Articles`, `ArtistProfile` y `SiteSettings`.
     - Incluye `status` (`verified`, `to_confirm`, `editorial_proposal`), `sourceUrl`, `consultedAt` y `notes` (campo privado con control RBAC visible únicamente para usuarios autenticados).
  2. **Ampliación de Colecciones y Esquema:**
     - `Releases`: añadidos `artistRole` (`main`, `featured`, `collaborator`), `coverStatus`, enlaces streaming extendidos (`spotifyEmbedUrl`, `amazonMusic`).
     - `Tracks`: añadidos `artistRole`, `appleMusicUrl`.
     - `Videos`: añadido tipo `trailer`, `youtubeId` (11 caracteres), `duration`.
     - `Events`: migrado a control de versiones con borradores (`versions: { drafts: true }`), control de acceso público condicional (`authenticatedOrPublished`), campo `slug` único, galería multimedia (`gallery`), enlaces sociales y videos relacionados.
     - `ArtistProfile`: eliminación total de placeholders de Guatemala; origen establecido en Pasto, Nariño, Colombia; `bioStatus` (`editorial_draft`), grupo de traducciones `translations.en`.
     - `SiteSettings`: enlaces verificados de Instagram, YouTube, ID de canal oficial, Apple Music; campos Spotify y booking mantenidos vacíos/nulos sin inventar.
  3. **Migraciones Seguras e Idempotentes:**
     - Creación de migración versionada `20261023_150557_add_artist_data_and_verification.ts` con sentencias protegidas contra tipos/tablas existentes (`DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;`, `IF NOT EXISTS`).
     - Inclusión de `prodMigrations` en `payload.config.ts` y saneamiento de registros `batch: -1` residuales del modo dev.
  4. **Script de Siembra Idempotente (`src/scripts/seed-artist-data.ts`):**
     - Población de los 4 lanzamientos verificados (`sig-sauer`, `so-fresh-so-clean`, `cicatrices`, `exceso`), 1 lanzamiento en borrador (`sig-sauer-remix`), 5 canciones vinculadas, 6 videos oficiales de YouTube, globals `ArtistProfile` y `SiteSettings`, y 1 evento en borrador (`pasto-vive-flow-2026`).
     - Búsqueda previa por `slug` o combinación `(title, release)` antes de inserción. Ejecución repetida produce 0 duplicados.
  5. **Validación de Utilidades y Seguridad:**
     - Refuerzo de `src/lib/content-utils.ts` con validación estricta de dominios YouTube (whitelist de hosts, regex de 11 caracteres, protocolo HTTPS).
     - Creación de suite `src/tests/artist-data-seed.test.ts` con 7 pruebas que validan aislamiento de borradores y consistencia de relaciones en PostgreSQL.
- **Consecuencias:**
  - *Positivas:* PostgreSQL es ahora la fuente de verdad inmutable y estructurada con datos reales; cero contenido inventado en producción; pruebas pasando al 100% (39/39); build de producción pasando con cero errores de tipo o lint.

---

## ADR-014: Capa de Consultas Públicas del CMS, Eliminación de Placeholders y Transformación de la Landing a Experiencia Artística Oficial

- **Estado:** Aceptado (Implementado en Misión 006-A.2)
- **Fecha:** Octubre 2026
- **Contexto:**
  1. La landing page pública (`src/app/(public)/page.tsx`) conservaba textos de scaffolding heredados de la Fase 005 ("Fase 005 — Cinematic Layout", "Quetzaltenango / Guatemala", "booking@danyglock.com", falsas giras y comunicados inventados).
  2. Misión 006-A.1 preparó la base de datos PostgreSQL con datos reales investigados (4 lanzamientos verificados, 1 borrador, 6 videos oficiales de YouTube, globals de Pasto, Colombia y evento borrador).
  3. Era imperativo transformar la experiencia pública en un sitio musical profesional, cinematográfico y administrable, donde Payload CMS sea la única fuente de verdad consumida directamente desde Server Components (`overrideAccess: false`).
  4. Los borradores y registros en proceso de verificación debían permanecer rigurosamente aislados del frontend público, mostrando estados vacíos editoriales de alta calidad visual donde correspondiera (Shows y Journal).
- **Decisión:**
  1. **Capa Unificada de Consultas Públicas (`src/lib/cms-queries.ts`):**
     - Funciones asíncronas para Server Components: `getArtistProfileData`, `getSiteSettingsData`, `getPublishedReleasesData`, `getPublishedVideosData`, `getPublishedEventsData`, `getPublishedArticlesData`, y `getHomePageCmsData` unificada en paralelo (`Promise.all`).
     - Consultas configuradas con `overrideAccess: false` para respetar la seguridad RBAC de Payload.
     - Filtrado estricto por `_status: 'published'` y verificación editorial `verification.status: 'verified'` en Releases, garantizando la exclusión de borradores (`sig-sauer-remix`) y registros de prueba locales.
  2. **Hero Cinematográfico Oficial:**
     - Dany Glock como protagonista central con tipografía editorial de gran escala (`text-6xl` a `text-9xl`) y subtítulo en `font-serif italic`.
     - Origen verificado en Pasto, Nariño, Colombia.
     - Spotlight automático del lanzamiento oficial más reciente (*Cicatrices feat. Maick Records*), con enlaces directos hacia la discografía y videografía.
     - Cero referencias a fases de desarrollo, nombres de misiones o tecnologías.
  3. **Catálogo de Discografía Real:**
     - Consumo directo de `Releases` con tratamiento visual de vinilo concéntrico para artes en sincronización (`coverStatus: 'pending'`).
     - Distinción visual explícita entre lanzamientos principales (`artistRole: 'main'`) y participaciones como artista invitado (`artistRole: 'featured'`) como en *EXCESO*.
     - Enlaces directos a plataformas de streaming verificadas (Apple Music, YouTube, Amazon Music).
  4. **Videografía Oficial Interactiva (`src/components/video/VideoGallery.tsx`):**
     - Galería responsiva con miniaturas de YouTube (`i.ytimg.com/vi/<id>/hqdefault.jpg`), badges de tipo (`Video Oficial`, `Trailer`, `Visualizer`), y etiquetas de duración.
     - Reproductor modal accesible utilizando el elemento nativo `<dialog>`, captura de foco, cierre con teclado (`Escape`) y modo privacy-enhanced (`youtube-nocookie.com/embed/<id>`).
     - Sin reproducción automática con sonido.
  5. **Estados Vacíos Editoriales de Shows y Journal:**
     - Eliminación total de giras inventadas y falsas notas de prensa sobre Guatemala.
     - Diseño de tarjetas vacías editoriales elegantes: *"Temporada en Programación — Nuevas Presentaciones en Vivo por Anunciar"* y *"Archivo Editorial — Comunicados Oficiales en Preparación"*, dirigiendo el interés hacia el canal de booking y prensa.
  6. **Canal Oficial de Contacto y Booking (`src/components/contact/ContactForm.tsx`):**
     - Formulario accesible conectado al endpoint `/api/contacts` con honeypot anti-spam (`websiteHoneypot`), validaciones de tipo, estados visuales de carga, éxito y error.
     - Reemplazo de enlaces `mailto:` hardcodeados por navegación hacia `#contacto` cuando no existan correos confirmados en `SiteSettings`.
  7. **Limpieza de Scaffolding y Endurecimiento de Migraciones:**
     - Saneamiento completo de `EditorialMenu.tsx` y `SiteFooter.tsx`.
     - Establecimiento de `push: false` en `payload.config.ts` para evitar la inserción del registro dev con `batch: '-1'` en `payload_migrations`, permitiendo que `next build` ejecute limpiamente sin requerir confirmación interactiva.
  8. **Suite de Pruebas de Integración (`src/tests/public-views.test.tsx`):**
     - 16 pruebas que verifican: consultas públicas, exclusión de borradores, distinción de roles de artista, presencia de videos, estados vacíos, ausencia total de referencias a Guatemala, falsos emails y textos de misiones.
- **Consecuencias:**
  - *Positivas:* Sitio 100% oficial, profesional e inmersivo; navegación y renderizado rápidos (First Load JS 119 kB); 55/55 pruebas automatizadas pasando; build de producción Next.js 15 compilando exitosamente con generación estática de la Home.





