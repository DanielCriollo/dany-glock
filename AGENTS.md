# AGENTS.md — Protocolo de Inteligencia Artificial para Dany Glock

Este archivo es el punto de entrada normativo para cualquier agente de inteligencia artificial (incluyendo Antigravity, Claude, ChatGPT u otros modelos) que interactúe con el repositorio **Dany Glock — Artist Digital Experience**.

---

## 1. Identidad y Propósito del Proyecto

- **Proyecto:** Dany Glock — Artist Digital Experience.
- **Tipo:** Plataforma web artística interactiva, editorial y administrable para el artista de música urbana Dany Glock.
- **Estética Mandatoria:** **Dark Cinematic Editorial**. Inspirada en sitios web de artistas internacionales (Travis Scott, The Weeknd, Rosalía, A$AP Rocky). Prohibido el uso de plantillas corporativas genéricas, dashboards estándar o layouts planos sin dirección artística.
- **Estado Actual:** Fase de cimentación y arquitectura (Misión 001 completada). No construir código funcional ni alterar despliegues sin que la misión correspondiente lo indique.

---

## 2. Lectura Obligatoria Previa

Antes de proponer o ejecutar cualquier cambio de código, arquitectura o documentación, el agente **DEBE**:

1. Leer [AGENT-RULES.md](file:///c:/Users/DUCKER/Documents/dany-glock/AGENT-RULES.md) para conocer las reglas permanentes operativas.
2. Consultar el **Project Brain** en [local/_ai-workspace/](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/):
   - [06-project-status.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/06-project-status.md) — Estado actual y última misión completada.
   - [08-backlog-and-blockers.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/08-backlog-and-blockers.md) — Bloqueos activos y tareas pendientes.
   - [02-architecture.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/02-architecture.md) — Arquitectura y flujos del sistema.
   - [03-tech-stack.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/03-tech-stack.md) — Stack aprobado y versiones.
   - [04-design-system-strategy.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/04-design-system-strategy.md) — Dirección visual Dark Cinematic Editorial.
   - [07-roadmap.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/07-roadmap.md) — Misión en curso y siguientes pasos.

---

## 3. Principios Innegociables de Desarrollo

1. **Sin Sobreingeniería:** Resolver cada necesidad con la solución más limpia, directa y mantenible. No introducir microservicios, cloud computing innecesario ni capas abstractas artificiales.
2. **Server Components First:** En Next.js App Router, todos los componentes son Server Components por defecto. El directivo `'use client'` solo se utiliza en hojas interactivas que requieran estado local, hooks del navegador o animación (GSAP / Motion).
3. **Payload Local API:** Las páginas públicas deben consumir datos usando la Local API de Payload (`getPayload({ config })`) directamente en Server Components, sin overhead HTTP fetch ni latencia de red.
4. **Respeto a la Accesibilidad y Core Web Vitals:** Cada animación debe contemplar `prefers-reduced-motion`. Mantener puntaje Lighthouse 90+ en SEO, Accesibilidad y Rendimiento.
5. **Tipado Estricto:** TypeScript estricto. Prohibido `any`. Los tipos de datos provienen de `payload-types.ts` autogenerados por Payload CMS.
6. **No Modificar Despliegue en Fases Iniciales:** El desarrollo actual es 100% local. No crear pipelines productivos ni contratar servicios externos sin autorización.

---

## 4. Registro y Mantenimiento del Project Brain

Al concluir cualquier tarea, módulo o misión:
- Actualizar inmediatamente [06-project-status.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/06-project-status.md).
- Si surge una duda o decisión estructural, crear un ADR en [05-technical-decisions.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/05-technical-decisions.md).
- Actualizar [08-backlog-and-blockers.md](file:///c:/Users/DUCKER/Documents/dany-glock/local/_ai-workspace/08-backlog-and-blockers.md) eliminando ítems resueltos y añadiendo nuevos pendientes.
