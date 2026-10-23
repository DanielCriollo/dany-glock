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

---

### ADR-015 — Rediseño Cinematográfico de la Home & Experiencia Editorial de Dany Glock (Misión 006-B.1)
- **Fecha:** 2026-10-23
- **Estado:** Aprobado e Implementado
- **Contexto:**
  1. La Misión 006-B.1 requirió transformar la Home en una experiencia digital cinematográfica, editorial y auténtica para el artista urbano Dany Glock, superando la estructura de landing funcional previa hacia una composición asimétrica de alto impacto visual.
  2. La fuente de verdad estricta debe ser Payload CMS 3.91 y PostgreSQL 17, sin arrays estáticos hardcodeados en componentes ni alteración de registros existentes.
  3. Era mandatorio erradicar de la vista pública cualquier jerga técnica o de desarrollo (`Artist Digital Experience`, `Dark Cinematic Editorial`, `Fase 005`, `Misión`, `Scaffold`, `Arte Oficial en Sincronización`).
  4. La arquitectura requería preparar campos editables en Payload CMS para medios protagonistas (Hero desktop 16:9, Hero mobile 9:16, video URL, imagen de retrato vertical 4:5, títulos y CTAs) mediante migraciones formales versionadas sin operaciones destructivas sobre PostgreSQL.
  5. Se requería diseñar secciones independientes: Single Spotlight para el lanzamiento más reciente, discografía asimétrica con distinción artista principal vs. invitado, sección editorial "El Artista — Biografía" en Home y una ruta `/biografia` funcional, videografía con jerarquía visual (video principal spotlight + cuadrícula) y modal accesible, presentación editorial de shows vacíos sin inventar giras, formulario de contacto unificado anti-spam y simplificación radical del footer eliminando el enlace público a `/admin`.
- **Decisión:**
  1. **Expansión del Modelo de Contenido & Migración Segura (`ArtistProfile`):**
     - Añadidos a `src/globals/ArtistProfile.ts`: `heroDesktopMedia` (relación a `media`), `heroMobileMedia` (relación a `media`), `heroVideoUrl` (campo de texto para video de fondo), `portraitImage` (relación a `media` para retrato editorial 4:5), `heroTitle`, `heroSubtitle`, `heroCtaPrimary`, `heroCtaSecondary`.
     - Creada y ejecutada la migración `src/migrations/20261023_180000_add_hero_and_portrait_media.ts` mediante `payload.db.migrate()`, integrando las columnas `hero_desktop_media_id`, `hero_mobile_media_id`, `hero_video_url`, `portrait_image_id`, `hero_title`, `hero_subtitle`, `hero_cta_primary`, `hero_cta_secondary` en la tabla `artist_profile` y registrándola formalmente en `payload_migrations` (batch 4).
     - Regenerados los tipos TypeScript de Payload CMS (`pnpm payload generate:types`) en `src/payload-types.ts`.
  2. **Hero Cinematográfico Asimétrico:**
     - Composición editorial de gran impacto: Wordmark `DANY GLOCK` tipográfico (`text-6xl` a `text-9xl`), origen territorial (*Pasto, Colombia · Plataforma Oficial*), género (*Música Urbana & Trap Latino*), y canvas visual cinematográfico con proporción adaptable (16:10 en desktop, 4:5 en viewports amplios, responsive para móviles).
     - CTAs directos: "Explorar Discografía ↓" y "Videografía Oficial →", más acceso directo a "El Artista ↗".
  3. **Single Spotlight para Último Lanzamiento (`src/components/music/LatestReleaseSpotlight.tsx`):**
     - Sección dedicada independiente para el lanzamiento más reciente verificado (*Cicatrices feat. Maick Records*).
     - Arte de vinilo concéntrico a gran escala 1:1, metadatos editoriales de catálogo, créditos de producción (Nick Montana x Dark Pro) y botones de streaming hacia Apple Music y YouTube.
  4. **Discografía Asimétrica & Distinción de Roles:**
     - Cuadrícula editorial responsiva eliminando el texto `Arte Oficial en Sincronización` y reemplazándolo por fichas sobrias con año, catálogo y badges de rol (*Artista Principal* vs. *Artista Invitado* en *EXCESO*).
  5. **Sección Editorial "El Artista" & Ruta Completa `/biografia` (`src/app/(public)/biografia/page.tsx`):**
     - Sección en Home que destaca la identidad territorial, visión artística y enlace a `/biografia`.
     - Ruta `/biografia` implementada como Server Component consumiendo `getArtistProfileData` y `getPublishedReleasesData`, estructurada en 3 bloques editoriales verificados: *01 / Trayectoria y Origen*, *02 / Visión Artística*, y *03 / Discografía de Referencia*, con ficha técnica del artista sin inventar premios, colaboraciones ficticias ni giras.
  6. **Jerarquía Visual en Videografía (`src/components/video/VideoGallery.tsx`):**
     - Spotlight visual para el video destacado principal (formato 16:9 con badge de tipo `Videoclip Oficial` y duración) acompañado de cuadrícula para el resto de entregas audiovisuales.
     - Modal accesible HTML5 `<dialog>` con overlay `backdrop-blur-2xl`, cierre por teclado (`Escape`), botón de cierre con foco accesible y reproductor `youtube-nocookie.com`.
  7. **Shows & Presentaciones:**
     - Estado editorial elegante sin fechas inventadas: *"Temporada en Programación — Nuevas Presentaciones en Vivo por Anunciar"* con CTA a la sección de contacto para contratación.
  8. **Simplificación Radical del Footer (`src/components/layout/SiteFooter.tsx`):**
     - Eliminación del enlace visible a `/admin` (conservando el acceso administrativo legítimo mediante su URL directa).
     - Eliminación de correos no verificados; inclusión de wordmark del artista, navegación esencial, redes verificadas (YouTube, Instagram, Apple Music), copyright oficial y botón "Volver Arriba".
  9. **Limpieza Editorial Estricta:**
     - Eliminados de la interfaz pública: `Artist Digital Experience`, `Dark Cinematic Editorial`, `Fase 005`, `Misión`, `Scaffold`, y `Arte Oficial en Sincronización`. Sustituidos por terminología limpia en español editorial.
  10. **Alineación de Pruebas & Calidad:**
      - Actualizada la suite `src/tests/public-views.test.tsx` a 18 pruebas integrales cubriendo Hero, Single Spotlight, Discografía, Biografía, Videografía, Contacto y Footer.
      - 57 de 57 pruebas superadas en `vitest`.
      - 0 errores en `pnpm typecheck`.
      - 0 errores y 0 warnings en `pnpm lint`.
      - Build de producción `next build` exitoso con generación estática de Home (`/`) y Biografía (`/biografia`).
- **Consecuencias:**
  - *Positivas:* Experiencia artística a la altura de estándares internacionales (Travis Scott / The Weeknd); narrativa visual sólida y cinematográfica; responsividad completa en desktop (1440x900) y móvil (390x844); fidelidad estricta al CMS sin datos hardcodeados; 100% de quality gates verdes.







---

### ADR-016 — Despliegue Manual en VPS Compartido (Nginx existente + systemd + PostgreSQL existente)
- **Fecha:** 2026-10-23
- **Estado:** Aprobado e Implementado
- **Contexto:** El VPS `51.83.75.178` ya aloja ~14 dominios (Laravel, WordPress, n8n, phpMyAdmin) servidos por Nginx 1.24 con PHP-FPM 8.3/8.4, MySQL 8 y PostgreSQL 16. Apache está instalado pero inactivo. Solo 1.9 GB de RAM y sin swap. El despliegue no debía afectar a ningún proyecto existente ni introducir CI/CD.
- **Decisión:**
  1. Reutilizar Nginx (vhost exclusivo, enlazado como `zz-dany.forcefilters.com` para no convertirse en *default server*) y PostgreSQL 16 (BD y rol propios, `reject` remoto solo para `danyglock_db`).
  2. `next start` bajo systemd como usuario sin privilegios `danyglock`, ligado a `127.0.0.1:3100`, sin Docker ni PM2.
  3. Certificado vía `certbot certonly --webroot` para que Certbot no edite configuraciones de Nginx.
  4. Swap de 2 GB para que el build no dispare el OOM killer sobre servicios ajenos.
  5. Migraciones con `payload migrate` (respaldo `pg_dump` previo); `prodMigrations` sigue activo como red de seguridad al arrancar.
  6. Admin inicial creado vía túnel SSH con `/admin` bloqueado públicamente hasta su creación.
  7. Actualizaciones manuales: `git pull --ff-only` → `pnpm install --frozen-lockfile` → migrate → stop → build → start.
- **Consecuencias:**
  - *Positivas:* Aislamiento total respecto a otros proyectos (línea base HTTP idéntica), cero servicios nuevos expuestos, reversible deshabilitando un symlink y un servicio.
  - *Negativas:* Interrupción de 1–2 min por actualización; la Home estática requiere rebuild para reflejar cambios del CMS (DEPLOY-01); sin backups automáticos (DEPLOY-03).

---

### ADR-017 — Identidad Visual Multimedia, Carga Responsiva y Fallbacks Cinemáticos (M006-B.2)
- **Fecha:** 2026-10-23
- **Estado:** Aprobado e Implementado
- **Contexto:** La plataforma requería elevar la experiencia visual del artista Dany Glock sin depender de plantillas ni placeholders ficticios. Era indispensable soportar imágenes de alta resolución administrables desde Payload CMS (`Media`), selección responsiva (desktop vs. móvil), video de fondo con soporte de accesibilidad estricto (`prefers-reduced-motion`), carátulas 1:1 consistentes, retratos verticales 4:5 y videografía sin sobrecargar la red ni violar WCAG 2.2.
- **Decisión:**
  1. **Configuración de Imágenes y Dominios Remotos (`next.config.ts`):** Habilitar formatos modernos `image/avif` e `image/webp`. Declarar `images.remotePatterns` para `i.ytimg.com` e `img.youtube.com` permitiendo la optimización nativa con `<Image>` de miniaturas de YouTube.
  2. **Profundidad de Relaciones en Payload (`src/lib/cms-queries.ts`):** Configurar `depth: 2` en las consultas de `ArtistProfile`, `Releases` y `Videos` para garantizar la población completa de los objetos `Media` vinculados (`heroDesktopMedia`, `heroMobileMedia`, `portraitImage`, `coverImage`, `customThumbnail`), incluyendo dimensiones, URLs y textos alternativos.
  3. **Hero Multimedia Cinemático (`src/components/hero/HeroMedia.tsx`):**
     - Soporte opcional para loop de video (`heroVideoUrl`) silenciado (`muted`), en bucle (`loop`) y sin controles intrusivos (`playsInline`).
     - Botón accesible flotante para alternar Pausar / Reanudar el video de fondo con indicación ARIA (`aria-label`, `aria-pressed`).
     - Detección activa de `prefers-reduced-motion` que pausa automáticamente el video de fondo respetando la preferencia del usuario.
     - Selección responsiva con `<picture>` / imágenes optimizadas para Desktop (`16:10` / `16:9`) y Móvil (`9:16` / `4:5`).
     - Fallback de póster y canvas Dark Cinematic Editorial generado con gradientes y tipografía monumental en caso de ausencia de medios en el CMS.
  4. **Componente Estandarizado de Carátulas (`src/components/music/ReleaseCover.tsx`):**
     - Proporción cuadrada 1:1 consistente en todo el sitio (Single Spotlight y catálogo).
     - Priorización de carga (`priority={true}`) para el lanzamiento destacado (LCP optimizado) y lazy-loading nativo para el resto de la discografía.
     - Fallback gráfico elegante de vinilo concéntrico con badge de catálogo para lanzamientos pendientes de arte o artes en sincronización, preservando el layout sin CLS.
  5. **Retratos Verticales del Artista (`src/components/artist/ArtistPortrait.tsx`):**
     - Formato editorial 4:5 consistente tanto en la sección Home como en `/biografia`.
     - Soporte completo para objeto `Media` poblado de Payload y fallback editorial de textura tonal oscura con wordmark monumental del artista.
  6. **Videoteca Optimizada y Accesible (`src/components/video/VideoGallery.tsx`):**
     - Priorización de `customThumbnail` (Media de Payload) sobre miniaturas automáticas de YouTube con `<Image>` optimizado de Next.js.
     - Eliminación del iframe en la carga inicial (cero bytes de YouTube embebido hasta la interacción del usuario).
     - Reproductor en modal nativo `<dialog>` con atrapamiento de foco accesible por teclado, cierre con tecla Escape y foco restaurado al elemento activador.
  7. **Calidad y Calibración en Pruebas:**
     - 63 pruebas automatizadas pasando en Vitest (100% verde en 6 suites).
     - Mock de `window.matchMedia` en entorno JSDOM para pruebas unitarias de accesibilidad de movimiento.
     - `pnpm typecheck`: 0 errores.
     - `pnpm lint`: 0 errores, 0 warnings.
     - `pnpm build`: compilación de producción exitosa.
- **Consecuencias:**
  - *Positivas:* Calidad visual y editorial de primer nivel internacional sin dependencias externas de pago; control editorial 100% administrable desde Payload CMS; rendimiento óptimo (LCP/CLS) con Next.js Image y formatos AVIF/WebP; accesibilidad WCAG 2.2 AA completa.
  - *Negativas:* Ninguna identificada; la arquitectura de fallbacks garantiza integridad visual incluso ante bases de datos vacías.


---

### ADR-018 — Contenido del Brochure: Trayectoria Tipada, Booking con Contacto Privado por Campo y EPK Opt-in (M006-B.2 Brochure)
- **Fecha:** 2026-10-23
- **Estado:** Aprobado e Implementado (local, sin desplegar)
- **Contexto:** El brochure oficial (`local/DANY-GLOCK (2).pdf`) aporta trayectoria, premios, escenarios compartidos, formato del show, flyers y datos de management, pero mezcla hechos verificables con afirmaciones promocionales y datos personales. El repositorio de GitHub es **público**.
- **Decisión:**
  1. Una sola colección `career-highlights` tipada por `category` (en lugar de colecciones separadas para premios/colaboraciones), con drafts: lo no confirmado queda en borrador y lo publicado sin verificar se rotula con su fuente. `shared_stage` se separa explícitamente de `collaboration`.
  2. Global `booking` con control de acceso **a nivel de campo**: el contacto de management solo es legible sin sesión con `publishContact = true`. Los datos de contacto no se versionan (ni en seed ni en documentación).
  3. Global `press-kit` con `isPublic = false` por defecto; la página web compone datos ya publicados y solo hitos verificados; versión PDF preparada vía `downloadablePdf` + `downloadStatus`.
  4. Galería reutilizando `media` (categorías `event_flyer`/`live_photo` + grupo `gallery`) en vez de una colección nueva; publicación con doble llave `visible` + `rightsStatus = approved`.
  5. Seeds **solo-creación**; material fuente (PDF, imágenes extraídas) excluido de Git.
  6. La migración generada se depuró para no duplicar la 20261023_180000 y su snapshot cubre el hueco de esa migración.
- **Consecuencias:**
  - *Positivas:* ninguna afirmación no verificada se publica por defecto; management decide desde el admin; sin datos personales en el repositorio público; esquema sin deriva.
  - *Negativas:* `/booking`, `/biografia` y `/epk` son estáticas: activar el EPK o aprobar flyers requiere rebuild hasta resolver DEPLOY-01. La galería de producción requiere subir los archivos manualmente.

---

### ADR-019 — Una sola versión de sharp (alineada con Next.js)
- **Fecha:** 2026-10-23
- **Estado:** Aprobado e Implementado
- **Contexto:** Next 15.4.11 depende de `sharp ^0.34.3` (optimizador `next/image`) y el proyecto declaraba `sharp ^0.35.5` para Payload. Con la adopción de `next/image` en M006-B ambas se cargan en el mismo proceso. En Windows comparten el nombre `libvips-42.dll`: si Next carga primero, Payload falla (`ERR_DLOPEN_FAILED`). En Linux no se reproduce.
- **Decisión:** fijar `sharp` del proyecto a `^0.34.5` (la versión que resuelve Next), dejando una sola copia en el lockfile. Las plantillas oficiales de Payload 3 también usan sharp 0.34.x.
- **Consecuencias:** desarrollo estable en Windows; producción recibe sharp 0.34.5 (libvips 8.17.3) para Payload — verificado con subida y generación de tamaños. Al actualizar Next.js, revisar que ambas dependencias sigan alineadas (`pnpm why sharp` debe mostrar una sola versión).

---

### ADR-020 — ISR con revalidación bajo demanda desde hooks de Payload (M006-B.3)
- **Fecha:** 2026-10-23
- **Estado:** Aprobado e Implementado (local, sin desplegar)
- **Contexto:** Las páginas públicas eran estáticas sin revalidación (DEPLOY-01): cualquier cambio del CMS exigía `pnpm build` + reinicio (≈ 1–2 min de corte).
- **Alternativas descartadas:** `dynamic = 'force-dynamic'` (renuncia a la caché y consulta PostgreSQL en cada visita en un VPS de 1.9 GB); webhook/endpoint con token compartido (superficie expuesta innecesaria, Payload ya corre en el mismo proceso); solo revalidación por tiempo (cambios con hasta 1 h de retraso, publicar/retirar no inmediato).
- **Decisión:** ISR (`revalidate = 3600` como red de seguridad) + `revalidatePath` en `afterChange`/`afterDelete` de colecciones y globals según un mapa de dependencias (`src/lib/revalidate.ts`), siguiendo el patrón de la plantilla oficial de Payload. Consultas que propagan errores para no cachear páginas vacías. Endpoint `POST /api/revalidate` solo para administradores.
- **Consecuencias:** cambios editoriales visibles en la siguiente visita sin build; HTML sigue sirviéndose desde caché; seeds por CLI requieren revalidación manual o esperar 1 h; diseño válido para una sola instancia (caché en disco local).

> **Nota ADR-020 (2026-10-23, producción):** desplegado en `329157f`. Confirmado que los scripts CLI (Local API en un proceso aparte) no pueden invalidar la caché del servidor Next.js; tras importaciones o seeds se usa `POST /api/revalidate` con sesión admin.
