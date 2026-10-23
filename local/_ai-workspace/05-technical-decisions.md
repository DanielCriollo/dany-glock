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
