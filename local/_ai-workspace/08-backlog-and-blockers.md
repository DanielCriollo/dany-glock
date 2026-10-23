# 08 — Registro de Pendientes y Bloqueos (Backlog & Blockers)

## 1. Bloqueos Activos

Actualmente **NO hay bloqueos técnicos, de entorno ni de dependencias**.
El entorno local dispone de Node.js v22.12.0, npm 10.9.0, pnpm, PostgreSQL 17 y Git instalados y operativos.

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

## 4. Backlog Preparado para Misión 003 (Inicialización del Proyecto y Tooling)

- [ ] **TL-01:** Inicializar proyecto base con Next.js 15 App Router y TypeScript estricto mediante `pnpm`.
- [ ] **TL-02:** Configurar Tailwind CSS v3.4 mapeando los tokens semánticos aprobados en `globals.css` y `tailwind.config.ts`.
- [ ] **TL-03:** Configurar fuentes autoalojadas con `next/font/google` (`Archivo`, `Instrument Serif`, `JetBrains Mono`) con fallback métrico anti-CLS.
- [ ] **TL-04:** Configurar entorno de pruebas con Vitest y React Testing Library.
- [ ] **TL-05:** Establecer la estructura de directorios modular (`src/app/(public)`, `src/components/`, `src/lib/`, `src/styles/`) y scripts de verificación (`pnpm lint`, `pnpm test`).

