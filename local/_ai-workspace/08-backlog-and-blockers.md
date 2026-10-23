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

## 3. Backlog Preparado para Misión 002 (Design System & Dirección Visual)

- [ ] **DS-01:** Definir la matriz completa de tokens de diseño semánticos en formato CSS Custom Properties y Tailwind Theme.
- [ ] **DS-02:** Diseñar la paleta de contrastes validada WCAG 2.1 AA para escala de grises oscuros (*Void, Obsidian, Elevated*) y acentos cromáticos (*Amber Gold, Crimson*).
- [ ] **DS-03:** Seleccionar y documentar las tipografías definitivas (Display vs Sans vs Mono) con especificación de tamaños, interlineados y trackings editoriales.
- [ ] **DS-04:** Diseñar la especificación técnica de las animaciones cinemáticas (curvas Bézier, duraciones, estados de hover magnéticos).
- [ ] **DS-05:** Especificar los estados y anatomía accesible del reproductor de audio flotante persistente.
- [ ] **DS-06:** Crear la guía de diseño para el Electronic Press Kit (EPK) y ficha de lanzamiento musical.
