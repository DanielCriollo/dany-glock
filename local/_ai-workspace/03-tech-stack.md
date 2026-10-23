# 03 — Stack Tecnológico y Matriz de Compatibilidad

Este documento consolida la investigación técnica, versiones estables verificadas, compatibilidades y requisitos de ejecución para la plataforma **Dany Glock — Artist Digital Experience**.

---

## 1. Matriz de Tecnologías y Versiones

| Capa | Tecnología | Versión Objetivo | Justificación Técnica & Compatibilidad |
| :--- | :--- | :--- | :--- |
| **Entorno de Ejecución** | Node.js | `v22.x LTS` (v22.12.0 verificado) | Cumple con creces el requisito de Payload 3 (`>= 20.18.1`). Soporte nativo para fetch, WebCrypto y rendimiento V8 moderno. |
| **Gestor de Paquetes** | `pnpm` | `10.x` (instalado en el sistema) | Recomendado oficialmente por el equipo de Payload CMS para evitar conflictos de peer dependencies y duplicación de módulos en React 19 / Next.js 15. |
| **Framework Core** | Next.js (App Router) | `15.2.x` / `15.3.x` | Base nativa sobre la que corre Payload 3. Soporta React Server Components (RSC), Server Actions, Turbopack en desarrollo y optimización de imágenes (`next/image`). |
| **Librería UI** | React | `19.0.x` | Emparejado nativamente con Next.js 15. Manejo eficiente de transiciones concurrentes y streaming de componentes. |
| **Lenguaje** | TypeScript | `5.7.x+` | Tipado estricto (`strict: true`). Sincronización automática de contratos de datos con `payload-types.ts`. |
| **CMS Integrado** | Payload CMS 3 | `3.25.x+` (última estable 3.x) | Ejecución nativa sin servidor Express separado. Incluye panel de control en `/admin`, editor de texto enriquecido Lexical (`@payloadcms/richtext-lexical`) y autenticación lista para producción. |
| **Base de Datos & ORM** | PostgreSQL + Drizzle ORM | PostgreSQL 16 o 17 (v17 instalada) | Adaptador oficial `@payloadcms/db-postgres`. Drizzle ORM proporciona consultas SQL de bajísima latencia, esquema tipado estricto y sistema de migraciones reproducible. |
| **Estilos & Diseño** | Tailwind CSS | `v3.4.x` | Máxima estabilidad y compatibilidad con el ecosistema de componentes headless y plugins de animación. Evitamos Tailwind v4 temporalmente debido a cambios recientes en la API de configuración `@theme` que pueden generar fricción con componentes de terceros. |
| **Animación Cinematográfica** | GSAP + ScrollTrigger | `3.12.x` (`@gsap/react`) | Estándar de la industria para animaciones de scroll complejas (scrubbing, timeline pinning, revelados tipográficos y parallax cinematográfico). |
| **Animación UI / Microestados** | Motion (Framer Motion) | `motion` `v11.x` / `v12.x` | Manejo declarativo de estados en componentes React (modales, tooltips, transiciones de layout, gestos táctiles y springs fluidos). |
| **Smooth Scrolling** | Lenis | `lenis/react` `1.1.x+` | Scroll suave inercial de alta gama sincronizado con el ticker de GSAP mediante `gsap.ticker.add()`. Evita tirones y unifica la experiencia en Windows, macOS y dispositivos móviles. |
| **Primitivas Accesibles** | Radix UI | `@radix-ui/react-*` | Primitivas headless sin estilos (Diálogos, Menús desplegables, Tabs, Sliders para volumen del reproductor). Garantiza cumplimiento WCAG 2.1 AA nativo. |
| **Iconografía** | Lucide React | `0.475.x+` | Iconografía minimalista, ultra-ligera y con soporte de Server Components sin impacto en el bundle del cliente. |
| **Testing Unitario / Integración** | Vitest + Testing Library | `3.x` | Ejecución instantánea de pruebas unitarias en TypeScript, emulación rápida de DOM y compatibilidad natural con componentes React. |
| **Testing E2E & Accesibilidad** | Playwright + `@axe-core/playwright` | `1.50.x+` | Pruebas de navegación en navegadores reales (Chromium, Firefox, WebKit), verificación visual responsive y auditoría automatizada de accesibilidad (a11y). |

---

## 2. Compatibilidad y Arquitectura de Paquetes de Payload 3

Payload 3 revolucionó su arquitectura al convertirse en un paquete de Next.js. Los paquetes esenciales que se configurarán en la Misión 004 son:

```json
{
  "dependencies": {
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "payload": "^3.25.0",
    "@payloadcms/next": "^3.25.0",
    "@payloadcms/db-postgres": "^3.25.0",
    "@payloadcms/richtext-lexical": "^3.25.0",
    "tailwindcss": "^3.4.17",
    "gsap": "^3.12.7",
    "@gsap/react": "^2.1.2",
    "motion": "^12.4.7",
    "lenis": "^1.1.20",
    "lucide-react": "^0.475.0"
  }
}
```

---

## 3. Requisitos de Ejecución y Limitaciones Reales

### Requisitos Locales:
- **Node.js:** Versión instalada en el sistema `v22.12.0` (compatible).
- **PostgreSQL:** Versión instalada en el sistema `PostgreSQL 17` (compatible y verificada en `C:\Program Files\PostgreSQL\17\bin\psql.exe`).
- **Package Manager:** `pnpm` disponible en `C:\Users\DUCKER\AppData\Roaming\npm\pnpm.ps1`.

### Limitaciones Identificadas y Estrategia de Mitigación:
1. **Conflicto entre Ticker de GSAP y RequestAnimationFrame de Lenis:**
   - *Riesgo:* Desincronización y micro-tirones durante el scroll.
   - *Mitigación:* Integrar el método `lenis.raf()` dentro del ticker global de GSAP (`gsap.ticker.add`) y desactivar el auto-RAF de Lenis (`autoRaf={false}`).
2. **Hidratación en Next.js con Animaciones:**
   - *Riesgo:* Errores de hidratación de React 19 si se leen propiedades del DOM (`window.innerWidth`, scroll position) en el ciclo de render inicial.
   - *Mitigación:* Envolver toda animación GSAP dentro del hook `@gsap/react` `useGSAP()` con scope asignado a una referencia de contenedor, ejecutándose exclusivamente tras el montaje del cliente.
3. **Migraciones de Base de Datos en PostgreSQL:**
   - *Riesgo:* En desarrollo local, la opción `push: true` en el adaptador de Postgres sincroniza tablas automáticamente, pero en producción puede causar pérdida de datos si no se controlan las migraciones.
   - *Mitigación:* Usar `push: true` exclusivamente en desarrollo local. Para el despliegue posterior en VPS, generar scripts explícitos con `npx payload migrate:create` y aplicarlos con `npx payload migrate`.
4. **Almacenamiento de Archivos Multimedia (Uploads):**
   - *Riesgo:* Subida de imágenes o audios muy pesados que degraden el rendimiento del servidor.
   - *Mitigación:* Configurar Payload con optimización automática de imágenes vía `sharp` (redimensionamiento a diferentes breakpoints y conversión a formato WebP/AVIF).
