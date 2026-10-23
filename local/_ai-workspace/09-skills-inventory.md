# 09 — Inventario y Evaluación de Skills en Antigravity

Este documento presenta la auditoría, análisis de procedencia y recomendaciones de adopción de **Skills** dentro del entorno de desarrollo Google Antigravity para el proyecto **Dany Glock — Artist Digital Experience**.

---

## 1. Regla Mandatoria de Seguridad
> **Restricción estricta:** Conforme a las directrices de la Misión 001, **no se instalan automáticamente skills externas sin autorización expresa del usuario**. Se prioriza el uso de capacidades nativas y el desarrollo de skills internas versionadas en el propio repositorio (`.agents/skills/`).

---

## 2. Diagnóstico de Skills Nativas en el Entorno

Se inspeccionó el directorio nativo de skills de Antigravity (`builtin/skills`):

| Skill Nativa | Estado | Utilidad para el Proyecto | Recomendación |
| :--- | :--- | :--- | :--- |
| `agy-customizations` | Verificada y activa | Explica la estructura de reglas jerárquicas, progressive disclosure, plugins y creación de skills en `.agents/skills/`. | **Adoptar:** Marco de referencia obligatorio para gobernar el proyecto. |
| `antigravity_guide` | Verificada y activa | Referencia completa de comandos CLI, atajos y funcionamiento del motor del agente. | **Adoptar como consulta:** Útil para resolución de dudas operativas del IDE. |
| `permissioned-github`| Verificada y disponible | Gestión de PRs, ramas y commits autenticados. | **Mantener en reserva:** Se activará cuando se configure el repositorio remoto en GitHub/GitLab. |

---

## 3. Evaluación por Especialidades Requeridas

Analizamos cada una de las 8 especialidades solicitadas para determinar si conviene buscar una skill externa, apoyarse en reglas nativas o desarrollar una skill interna personalizada:

### 3.1. Diseño Frontend Premium & Dirección de Arte
- **Necesidad:** Evitar que los agentes generen interfaces genéricas de estilo SaaS corporativo o tarjetas prediseñadas planas.
- **Riesgo:** Los modelos de IA tienden por defecto a paletas de color estándar (azul empresarial, blanco plano o morado genérico).
- **Recomendación:** **Desarrollar Skill Interna:** `.agents/skills/dark-cinematic-ui`.
  - *Contenido:* Guía de tokens de contraste alto para entornos oscuros, directrices de composición editorial asimétrica, tipografía display brutalista/cinematográfica y uso de texturas de grano.

### 3.2. UX/UI y Accesibilidad (WCAG 2.1 AA)
- **Necesidad:** Garantizar contraste cromático riguroso en fondos oscuros (`#070708`), navegación accesible por teclado y compatibilidad total con lectores de pantalla.
- **Recomendación:** **Codificar en Reglas Permanentes (`AGENT-RULES.md`) y Pruebas Automatizadas:**
  - No requiere una skill externa compleja; se implementa integrando `@axe-core/playwright` en la suite de pruebas y aplicando las primitivas sin estilos de Radix UI (`@radix-ui/react-*`), que resuelven ARIA y foco de manera nativa.

### 3.3. Arquitectura Next.js 15, React 19 & TypeScript
- **Necesidad:** Garantizar el uso estricto de Server Components por defecto, aislamiento limpio de Client Components (`'use client'`) y streaming con `Suspense`.
- **Recomendación:** **Capacidad Nativa del Modelo + Reglas de Proyecto:**
  - El modelo posee conocimiento profundo de Next.js 15. Las restricciones quedan blindadas en `AGENT-RULES.md` sin necesidad de sobrecargar el contexto con skills externas redundantes.

### 3.4. Payload CMS 3.x Nativo en App Router
- **Necesidad Crítica:** Payload 3.x modificó radicalmente su arquitectura respecto a Payload 2.x (ya no es un servidor Express independiente, sino que corre dentro de Next.js App Router, usa Drizzle ORM con PostgreSQL y consulta datos mediante la Local API `getPayload({ config })`). Muchos agentes confunden la API de v2 con la de v3.
- **Recomendación:** **Desarrollar Skill Interna:** `.agents/skills/payload-3-architect`.
  - *Contenido:* Patrones oficiales de configuración de `payload.config.ts`, definición de colecciones con campos tipados, acceso mediante Server Components y manejo de migraciones con Drizzle. Aporta un valor inmenso para evitar alucinaciones de sintaxis obsoleta.

### 3.5. Animaciones Web (GSAP ScrollTrigger, Lenis y Motion)
- **Necesidad:** Coordinar scroll inercial suave con Lenis, animaciones de pinning/scrub con GSAP y transiciones de componentes con Motion, previniendo fugas de memoria y errores de hidratación.
- **Recomendación:** **Desarrollar Skill Interna:** `.agents/skills/kinetic-motion-experience`.
  - *Contenido:* Patrón de sincronización del ticker GSAP con Lenis, uso obligatorio del hook `useGSAP()` con scope de limpieza y respeto a `prefers-reduced-motion`.

### 3.6. SEO y Rendimiento (Core Web Vitals)
- **Necesidad:** Metadatos dinámicos para música (`MusicGroup`, `MusicAlbum`), generación de Open Graph images y optimización de LCP < 2s.
- **Recomendación:** **Integrar en la Misión 009:**
  - Aprovechar la API nativa de `Metadata` de Next.js 15 y el componente `next/image` con procesamiento Sharp. No requiere skill externa.

### 3.7. Seguridad y Testing (Vitest & Playwright)
- **Necesidad:** Pruebas unitarias de componentes con Vitest y pruebas E2E en múltiples navegadores con Playwright.
- **Recomendación:** **Integrar mediante configuración y scripts estándar:**
  - Se configurarán en las Misiones 003 y 009 con comandos reproducibles (`pnpm test:unit` y `pnpm test:e2e`).

---

## 4. Matriz de Decisión y Próximos Pasos de Skills

| Skill Propuesta | Tipo | Origen | Cuándo Implementar | Valor Aportado |
| :--- | :--- | :--- | :--- | :--- |
| `dark-cinematic-ui` | Workspace Skill | Interno (`.agents/skills/`) | Misión 002 | **Crítico:** Garantiza la excelencia estética y dirección visual sin desviaciones corporativas. |
| `payload-3-architect` | Workspace Skill | Interno (`.agents/skills/`) | Misión 004 | **Crítico:** Previene confusión entre Payload 2 y Payload 3, garantizando esquemas limpios en Next.js 15. |
| `kinetic-motion-experience` | Workspace Skill | Interno (`.agents/skills/`) | Misión 005 | **Alto:** Asegura sincronización técnica perfecta entre GSAP, Lenis y React sin fugas de memoria. |
| *Skills Externas de Internet* | Externa | Ecosistema público | No recomendadas actualmente | **Bajo:** Riego de incompatibilidad, alucinación y falta de mantenimiento. No se autoriza su instalación. |
