# AGENT-RULES.md — Reglas Permanentes de Operación para Agentes

Este documento establece las directrices operativas, estándares de calidad y restricciones inmutables para el proyecto **Dany Glock — Artist Digital Experience**.

---

## 1. Reglas Generales de Comportamiento

1. **Verificación Previa Obligatoria:**  
   Antes de escribir código o proponer cambios, comprueba la existencia de archivos clave y el estado del proyecto en `local/_ai-workspace/`. Si un archivo existe, léelo y respeta sus convenciones previas.
2. **Contraste con Código y Documentación Oficial:**  
   Nunca asumas versiones o APIs obsoletas. Toda recomendación sobre Next.js, Payload CMS, GSAP, Lenis o PostgreSQL debe estar validada contra la documentación oficial vigente.
3. **Cero Alucinación de Dependencias o Contratos:**  
   No importes paquetes npm ficticios ni agregues dependencias masivas sin justificación explícita y aprobación contextual.
4. **Respeto a las Restricciones de Misión:**  
   Si una misión estipula "No implementar la Home todavía" o "No configurar despliegue", acátalo rigurosamente. Trabajar por etapas garantiza cero deuda técnica y calidad artesanal.

---

## 2. Estándares Técnicos y de Código

### Frontend & React
- **Next.js App Router:** Emplear la estructura de carpetas estándar de Next.js 15 (`app/(public)/...` y `app/(payload)/...`).
- **Arquitectura de Componentes:**  
  - Server Components por defecto para optimización de bundle, streaming con `Suspense` y SEO inmediato.
  - Client Components (`'use client'`) aislados exclusivamente en hojas interactivas (reproductor de audio, botones animados, modales, canvas interactivo).
- **TypeScript:**  
  - Modo estricto habilitado (`strict: true`).
  - Prohibido el uso de `any`. Utilizar tipos genéricos, uniones discriminadas y tipos derivados de `payload-types.ts`.

### Diseño y Estética: "Dark Cinematic Editorial"
- **Paleta de Color:** Fondos oscuros profundos (Void Black `#070708`, Obsidian `#0E0F12`), textos en escala tipográfica cuidada (Silver/Platinum `#E5E7EB`), y acentos vibrantes calculados (Acid Ember / Gold Champagne).
- **Tipografía:** Jerarquía editorial audaz. Tipografías Display para títulos con carácter urbano/cinematográfico; fuentes limpias y geométricas para lectura fluida.
- **Micro-interacciones:** Cada elemento interactivo (hover, click, focus) debe tener feedback visual fluido con transiciones suaves (curvas bézier cinematográficas).
- **Animaciones y Rendimiento:**  
  - Animaciones de scroll sincronizadas mediante Lenis y GSAP ScrollTrigger.
  - Transiciones de componentes y estados mediante Motion (`motion`).
  - Cumplir estrictamente con la consulta `prefers-reduced-motion` desactivando movimientos agresivos si el usuario lo solicita.

### CMS y Backend
- **Payload CMS 3.x:** Integración nativa dentro del App Router de Next.js.
- **Acceso a Datos:**  
  - En Server Components públicos: usar Local API (`getPayload({ config })`).
  - Prohibido hacer llamadas HTTP internas tipo `fetch('http://localhost:3000/api/...')` para obtener datos de Payload desde el propio servidor Next.js.
- **Base de Datos:** PostgreSQL administrado vía `@payloadcms/db-postgres` (respaldado por Drizzle ORM). Utilizar migraciones reproducibles para entornos no locales.

---

## 3. Criterios de Aceptación y Quality Gates

Cada entrega o misión debe satisfacer:
1. **Compilación Limpia:** `pnpm build` (o comando equivalente) debe completarse sin errores de TypeScript ni advertencias bloqueantes.
2. **Testing Proporcional:**  
   - Pruebas unitarias en lógica crítica y utilidades con Vitest.
   - Pruebas de integración visual y de accesibilidad con Playwright y axe-core.
3. **Core Web Vitals:**  
   - LCP (Largest Contentful Paint) < 2.0s.
   - CLS (Cumulative Layout Shift) < 0.05.
   - INP (Interaction to Next Paint) < 150ms.
4. **Accesibilidad (a11y):** Nivel WCAG 2.1 AA mínimo. Estructura semántica HTML5 (`<main>`, `<header>`, `<nav>`, `<article>`, `<section>`), contrastes de color validados (mínimo 4.5:1 en texto regular) y navegación accesible por teclado.

---

## 4. Gestión del Project Brain (`local/_ai-workspace/`)

El Project Brain es la memoria persistente del proyecto. Cada agente debe actualizarlo sistemáticamente:

| Archivo | Cuándo actualizarlo |
| :--- | :--- |
| `06-project-status.md` | Al finalizar cada misión o módulo relevante. |
| `08-backlog-and-blockers.md` | Al detectar un nuevo requerimiento, deuda técnica o resolver una tarea. |
| `05-technical-decisions.md` | Al adoptar una decisión de diseño arquitectónico (ADR). |
| `07-roadmap.md` | Al completar una misión y preparar la siguiente. |

### Plantilla de Cierre de Misión en `06-project-status.md`:
```markdown
### [Fecha / Misión] — Resumen de Avance
- **Misión:** Misión XXX — [Nombre]
- **Implementaciones realizadas:** [Lista concisa]
- **Arquitectura y decisiones:** [Referencia a ADR si aplica]
- **Dependencias agregadas:** [Lista con versiones y motivos]
- **Pruebas ejecutadas:** [Resultados de tests]
- **Pendientes y bloqueos:** [Cero o lista]
- **Próximos pasos:** [Misión siguiente]
```
