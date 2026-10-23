# 03 — Stack Tecnológico y Matriz de Compatibilidad

Este documento consolida la investigación técnica, versiones estables verificadas, compatibilidades y requisitos de ejecución para la plataforma **Dany Glock — Artist Digital Experience**.

---

## 1. Matriz de Tecnologías y Versiones

| Capa | Tecnología | Versión Verificada | Requisitos Oficiales & Compatibilidad |
| :--- | :--- | :--- | :--- |
| **Entorno de Ejecución** | Node.js | Instalado: `v22.12.0` | **HALLAZGO CRÍTICO:** `payload@latest` (3.92.0) exige `^22.23.4 || >=24.22.1`. La versión actual `22.12.0` **NO CUMPLE** con `payload@latest`. Cumple únicamente hasta `payload@3.91.0` (`>=20.18.1`). Requiere decisión arquitectónica (ADR-009). |
| **Gestor de Paquetes** | `pnpm` | `10.34.4` (instalado en sistema) | Soporte nativo para workspaces, resolución estricta de peer-dependencies y lockfile reproducible. |
| **Framework Core** | Next.js (App Router) | `15.2.9` / `15.4.11` (o Next 16) | Requisito explícito de `@payloadcms/next@3.91+`: `>=15.2.9 <15.3.0 \|\| >=15.3.9 <15.4.0 \|\| >=15.4.11 <15.5.0 \|\| >=16.3.3 <17.0.0`. |
| **Librería UI** | React | `19.0.x` / `19.3.x` | Base nativa de Next.js 15. Soporte de React Server Components (RSC) y Server Actions. |
| **Lenguaje** | TypeScript | `^5.7.3` / `^5.8.x` | Modo estricto (`strict: true`). Tipos compartidos vía `payload-types.ts`. |
| **CMS Integrado (M004)** | Payload CMS 3 | `3.91.0` (o `3.92.0` si se actualiza Node) | Integración nativa dentro del App Router de Next.js. |
| **Base de Datos & ORM** | PostgreSQL + Drizzle ORM | PostgreSQL 17.4 (`psql` verificado) | Adaptador oficial `@payloadcms/db-postgres`. Drizzle ORM nativo. |
| **Estilos & Tokens** | Tailwind CSS | `v3.4.17` (o `v4.3.x` con `@tailwindcss/postcss`) | Compatible con los Design Tokens de M002. En Next 15 con App Router, v3.4 garantiza cero incompatibilidad con plugins heredados; v4 requiere arquitectura `@theme`. |
| **Testing Unitario** | Vitest | `^3.x` / `^5.x` | Ejecución ultra-rápida de pruebas en TypeScript y emulación DOM para componentes. |
| **Animación (M005)** | GSAP 3 | `3.15.0` (`@gsap/react`) | Gratuito y plugins desbloqueados para uso comercial. |

---

## 2. Requisitos de Ejecución y Hallazgo Crítico de Motores

### Diagnóstico de Motores de Payload CMS 3.x:
- `payload@3.25.0` hasta `3.90.0`: `engines: { node: "^18.20.2 || >=20.9.0" }`
- `payload@3.91.0`: `engines: { node: ">=20.18.1" }` *(Compatible con Node 22.12.0)*
- `payload@3.92.0` (`@latest`): `engines: { node: "^22.23.4 || >=24.22.1" }` *(Incompatible con Node 22.12.0)*

### Estado del Sistema Local:
- **Node.js actual:** `v22.12.0` (Incompatible con `payload@3.92.0`).
- **Gestor de versiones:** `fnm` y `nvm` disponibles en el sistema. `fnm list-remote --lts` confirma existencia de `v22.23.4` y `v24.22.1`.
- **Acción requerida:** Conforme a la regla de la Misión 003, la instalación de dependencias se detiene hasta que el usuario decida si actualizar Node.js en la máquina a `>=22.23.4` o fijar Payload en `3.91.0`.

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
