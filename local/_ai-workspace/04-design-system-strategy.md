# 04 — Design System: Dark Cinematic Editorial

> **Estado:** Aprobado en Misión 002 (sustituye la versión preliminar de la Misión 001).
> **Fuente de verdad** para identidad visual y tokens. Componentes en [10-components.md](./10-components.md), movimiento en [11-motion-system.md](./11-motion-system.md), Home en [12-home-visual-architecture.md](./12-home-visual-architecture.md).
> Ratios de contraste **calculados** con la fórmula de luminancia relativa WCAG 2.x (script versionado: `node local/design-preview/contrast.mjs`). No son estimaciones.

---

## 1. Concepto

**Dark Cinematic Editorial** = *póster de cine nocturno* × *revista editorial impresa* × *calle urbana*.

| Principio | Qué significa en pantalla | Qué evitamos |
| :--- | :--- | :--- |
| **La tipografía es la protagonista** | Titulares gigantes condensados, en mayúsculas, que se salen del margen como en los créditos de un póster. | Titulares tímidos de 32 px centrados en un "hero" con botón. |
| **La oscuridad es el lienzo** | El negro es espacio negativo con intención; la luz (foto, carmesí) se usa poco y con fuerza. | El "modo oscuro" de un dashboard: gris medio y tarjetas por todas partes. |
| **Composición editorial** | Grilla de 12 columnas con asimetría deliberada, sangrados, números de índice, pies de foto. | Bloques simétricos de 3 tarjetas con icono, título y texto. |
| **Bordes rectos** | Radio 0 por defecto. Líneas finas (hairlines) para estructurar. | Tarjetas redondeadas de 12–16 px con sombra suave (estética SaaS). |
| **Movimiento de cámara** | Revelados lentos y precisos, como un *dolly* o una cortina. | Rebotes, *springs* juguetones, animaciones en todo. |
| **Carmesí = señal** | El rojo marca lo importante: CTA principal, "en vivo", lanzamiento nuevo. | Rojo decorativo en fondos, iconos, bordes, etc. |

### Política de material visual (obligatoria)
- **Ninguna fotografía genérica, de stock ni generada por IA se presenta como Dany Glock.** Mientras no existan fotos oficiales con derechos confirmados (ver [DANY-GLOCK-RESEARCH-BRAIN.md](./DANY-GLOCK-RESEARCH-BRAIN.md)), se usan **placeholders tipográficos/abstractos** con la etiqueta visible *"Fotografía oficial pendiente"*.
- **Las portadas de lanzamientos no se alteran** (sin duotono, recortes agresivos ni overlays sobre el arte). Se respeta el arte del artista.
- Los textos de muestra en prototipos usan marcadores (`Título del lanzamiento`, `AAAA`), no datos sin validar.

### Dirección fotográfica (brief para la sesión oficial)
- Iluminación *low-key*, alto contraste, sombras profundas; luces prácticas rojas o de sodio como acento.
- Encuadres horizontales 16:9 / 21:9 para hero y verticales 4:5 para editorial y móvil. **Pedir siempre ambas orientaciones del mismo set** (el hero móvil necesita vertical).
- Espacio negativo en el tercio inferior o lateral para tipografía superpuesta.
- Grano analógico permitido en postproducción; evitar filtros de color que maten los negros.

---

## 2. Color

### 2.1 Paleta base

| Token | Hex | Rol |
| :--- | :--- | :--- |
| `ink` | `#0A0A0B` | Fondo primario. Negro casi puro (evita el `#000` absoluto, que produce *smearing* en OLED). |
| `graphite` | `#141416` | Superficie elevada (secciones alternas, tarjetas de video, menú). |
| `carbon` | `#1C1C1F` | Superficie interactiva / hover de filas, skeletons. |
| `steel` | `#2A2A2E` | Superficie máxima (tooltips, player expandido). Hairlines sólidas. |
| `bone` | `#EDEAE4` | Texto principal. Blanco hueso cálido (menos fatiga que `#FFF` sobre negro). |
| `ash` | `#A8A49E` | Texto secundario. |
| `smoke` | `#8A8680` | Texto terciario / metadatos. Borde de inputs. |
| `iron` | `#4A4845` | **Solo decorativo/deshabilitado.** Nunca para texto informativo. |
| `crimson` | `#B3122E` | **Color de marca.** Relleno de CTA primario, bloques de acento. |
| `crimson-hover` | `#C8152F` | Hover del relleno carmesí. |
| `crimson-press` | `#8F0E25` | Estado *active/pressed*. |
| `crimson-signal` | `#E1243F` | Puntos "en vivo", líneas de progreso, glows. Solo elementos gráficos ≥3:1. |
| `crimson-text` | `#FF5468` | Carmesí **para texto y anillo de foco** sobre fondos oscuros. |

### 2.2 Colores secundarios evaluados

| Opción | Hex | Evaluación | Decisión |
| :--- | :--- | :--- | :--- |
| **Ember (tungsteno/sodio)** | `#C8A27A` | Cálido, evoca la luz de las farolas urbanas y la película de tungsteno. No compite con el carmesí si se limita. 8.39:1 sobre `ink`. | ✅ **Aprobado con uso restringido:** solo estado *Preventa / Próximamente* y datos temporales. Nunca CTA ni fondos. |
| Acero frío | `#8FA3B8` | Aporta un tono "noche azul", pero enfría la identidad y la acerca a una estética tech. | ❌ Rechazado. |
| Ámbar/oro (propuesta de M001) | `#E5A93C` | Bonito, pero con el carmesí como color de marca forma una pareja "rojo + oro" con connotación festiva/lujo genérico. | ❌ Sustituido por carmesí (ver ADR-006). |
| Verde éxito funcional | `#7BC59A` | Necesario solo para la confirmación del formulario de booking. 9.70:1. | ✅ Solo feedback funcional. |

### 2.3 Tokens semánticos (lo que usan los componentes)

```css
/* Los componentes NUNCA usan la paleta base directamente: usan semánticos. */
--color-bg:              var(--ink);
--color-bg-raised:       var(--graphite);
--color-bg-interactive:  var(--carbon);
--color-bg-overlay:      rgb(10 10 11 / 0.92);   /* menú móvil, modales */
--color-bg-glass:        rgb(20 20 22 / 0.72);   /* navbar tras scroll + backdrop-blur */

--color-fg:              var(--bone);
--color-fg-muted:        var(--ash);
--color-fg-subtle:       var(--smoke);
--color-fg-disabled:     var(--iron);
--color-fg-on-accent:    var(--bone);
--color-fg-accent:       var(--crimson-text);

--color-accent:          var(--crimson);
--color-accent-hover:    var(--crimson-hover);
--color-accent-press:    var(--crimson-press);
--color-signal:          var(--crimson-signal);
--color-upcoming:        var(--ember);

--color-border:          rgb(237 234 228 / 0.12); /* hairline decorativa */
--color-border-strong:   rgb(237 234 228 / 0.24);
--color-border-input:    var(--smoke);           /* ≥3:1, límite de control interactivo */
--color-focus:           var(--crimson-text);

--color-success:         #7BC59A;
--color-error:           var(--crimson-text);
```

### 2.4 Matriz de contraste verificada

| Primer plano | sobre `ink` | sobre `graphite` | sobre `carbon` | Uso permitido |
| :--- | :--- | :--- | :--- | :--- |
| `bone` #EDEAE4 | **16.48** | 15.32 | 14.16 | Todo texto. |
| `ash` #A8A49E | **7.98** | 7.42 | 6.86 | Todo texto. |
| `smoke` #8A8680 | **5.47** | 5.08 | 4.70 | Texto ≥14 px, metadatos, bordes de input. |
| `crimson-text` #FF5468 | **6.33** | 5.89 | 5.44 | Enlaces, etiquetas, errores, anillo de foco. |
| `ember` #C8A27A | **8.39** | 7.80 | 7.21 | Badge "Preventa". |
| `crimson-signal` #E1243F | 4.26 | 3.97 | 3.66 | Solo gráficos y texto ≥24 px. |
| `crimson` #B3122E | 2.87 ❌ | 2.67 ❌ | 2.46 ❌ | **Nunca como texto sobre oscuro.** Solo relleno. |
| `iron` #4A4845 | 2.17 ❌ | — | — | Decorativo / deshabilitado. |

| Combinación de relleno | Ratio | Resultado |
| :--- | :--- | :--- |
| `bone` sobre `crimson` (CTA) | **5.75** | AA ✅ |
| `bone` sobre `crimson-hover` | 4.85 | AA ✅ |
| `bone` sobre `crimson-press` | 7.75 | AAA ✅ |
| `ink` sobre `bone` (botón secundario hover) | 16.48 | AAA ✅ |
| `crimson-text` sobre `crimson` | 2.21 ❌ | Por eso el anillo de foco **siempre lleva offset** sobre el fondo, nunca pegado al botón. |

> Corrección M001: los ratios de la paleta anterior (`#f4f4f6`/`#070708`) eran 18.33 y 7.98, no 18.7 y 7.8 como se documentó. Se cambió el valor de `smoke` (de `#7A7772` a `#8A8680`) porque el primero daba 4.44:1 y no cumplía AA.

---

## 3. Tipografía

### 3.1 Familias (verificadas en Google Fonts, licencia OFL, se autoalojan con `next/font`)

| Rol | Familia | Ejes / estilos | Por qué |
| :--- | :--- | :--- | :--- |
| **Display + UI + lectura** | **Archivo** (variable) | `wdth 62–125`, `wght 100–900` | Una sola fuente variable cubre el titular *extra-condensed* tipo póster (wdth 62, wght 800+) **y** el texto de lectura (wdth 100, wght 400). Menos peticiones, más coherencia. Grotesca con raíz tipográfica de prensa. |
| **Acento editorial** | **Instrument Serif** | 400 regular + *italic* | Contrapunto de revista para citas, números grandes y palabras destacadas. Solo tiene un peso, por eso se usa **solo en tamaños ≥24 px**. |
| **Datos / timecode** | **JetBrains Mono** | 400, 500 | Duraciones, códigos, coordenadas y fechas en formato "claqueta de cine". Uso mínimo. |

Descartadas: *Syne* y *Clash Display* (propuestas en M001). Syne es muy reconocible por su uso en portafolios de agencias. Clash Display está en Fontshare, no en Google Fonts, y no se integra con `next/font/google`. Space Grotesk, Inter y Plus Jakarta Sans tampoco entran: Archivo cubre esos roles y nos ahorramos familias.

### 3.2 Escala tipográfica (mobile-first, fluida con `clamp`)

| Token | Tamaño | Line-height | Tracking | Familia / ajustes | Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xl` | `clamp(3.5rem, 1.6rem + 10vw, 13rem)` | 0.84 | -0.02em | Archivo `wdth 62` `wght 850`, MAYÚSCULAS | Nombre del artista en el hero, *statement* de Booking. Un uso por vista. |
| `display-lg` | `clamp(2.75rem, 1.4rem + 6.5vw, 8rem)` | 0.88 | -0.015em | Archivo `wdth 68` `wght 800`, MAYÚSCULAS | Título de lanzamiento destacado, títulos de sección. |
| `display-md` | `clamp(2rem, 1.4rem + 3vw, 4.5rem)` | 0.94 | -0.01em | Archivo `wdth 75` `wght 750`, MAYÚSCULAS | Filas de discografía, ciudades de la agenda. |
| `heading` | `clamp(1.5rem, 1.25rem + 1.1vw, 2.25rem)` | 1.1 | -0.005em | Archivo `wdth 87.5` `wght 700` | Títulos de artículos y tarjetas grandes. |
| `title` | `1.25rem` | 1.25 | 0 | Archivo `wdth 100` `wght 600` | Títulos de tarjetas, nombres de pista. |
| `quote` | `clamp(1.75rem, 1.2rem + 2.4vw, 3.5rem)` | 1.08 | -0.01em | Instrument Serif *italic* | Citas de prensa, manifiesto. |
| `body-lg` | `1.125rem` | 1.6 | 0 | Archivo `wght 400` | Entradillas, bio. |
| `body` | `1rem` (16 px, mínimo para lectura) | 1.65 | 0.005em | Archivo `wght 400` | Texto corrido. Ancho máx. `68ch`. |
| `small` | `0.875rem` | 1.5 | 0.01em | Archivo `wght 450` | Pies de foto, créditos. |
| `label` | `0.75rem` | 1.2 | 0.14em | Archivo `wdth 100` `wght 600`, MAYÚSCULAS | Eyebrows, categorías, botones. **Nunca menor de 12 px.** |
| `mono` | `0.8125rem` | 1.4 | 0.04em | JetBrains Mono 400, `tnum` | Duraciones `03:42`, fechas `22.10.26`, índices `01`. |

### 3.3 Reglas tipográficas
1. Máximo **un `display-xl` por pantalla**.
2. Los titulares display pueden **sangrar** fuera del contenedor (`margin-inline: calc(var(--gutter) * -0.5)`), pero nunca generar scroll horizontal (`overflow-x: clip` en la sección).
3. El texto corrido es siempre `bone` o `ash`, nunca `smoke`.
4. Mezcla editorial permitida: una palabra en Instrument Serif *italic* dentro de un titular de Archivo (por ejemplo "LA *noche* ES NUESTRA"), como máximo una por sección.
5. `text-wrap: balance` en titulares y `text-wrap: pretty` en párrafos.
6. `font-display: swap` + *fallback* métrico ajustado (`adjustFontFallback` de `next/font`) para evitar CLS.

---

## 4. Espaciado, contenedores y grilla

```css
/* Base 4 px */
--space-0: 0;      --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem;
--space-4: 1rem;   --space-6: 1.5rem;  --space-8: 2rem;    --space-12: 3rem;
--space-16: 4rem;  --space-24: 6rem;   --space-32: 8rem;   --space-48: 12rem;

/* Ritmo fluido */
--gutter:          clamp(1.25rem, 0.8rem + 2.2vw, 3rem);   /* margen lateral */
--space-section:   clamp(5rem, 3rem + 8vw, 12rem);         /* entre secciones */
--space-stack:     clamp(1.5rem, 1rem + 2vw, 3rem);        /* entre bloques internos */

/* Contenedores */
--container-text:  42rem;   /* ~68ch: lectura */
--container-main:  80rem;   /* contenido estándar */
--container-wide:  96rem;   /* editorial amplio */
/* full-bleed: 100% sin gutter (hero, rail de videos) */
```

| Viewport | Columnas | Gap |
| :--- | :--- | :--- |
| < 768 px | 4 | `--space-4` |
| 768–1023 px | 8 | `--space-6` |
| ≥ 1024 px | 12 | `--space-6` |

**Container queries** (`@container`) para las tarjetas: cambian de layout según su contenedor, no según el viewport, y así son reutilizables en cualquier sección.

---

## 5. Breakpoints (mobile-first, `min-width`)

| Token | Valor | Objetivo |
| :--- | :--- | :--- |
| *(base)* | 0 | Móvil 360–430 px. **Se diseña primero aquí.** |
| `sm` | 40rem (640 px) | Móvil grande / horizontal. |
| `md` | 48rem (768 px) | Tablet vertical. |
| `lg` | 64rem (1024 px) | Tablet horizontal / laptop. Activa hover-reveal y pinning. |
| `xl` | 80rem (1280 px) | Desktop. |
| `2xl` | 96rem (1536 px) | Pantallas grandes. |

Coinciden con los valores por defecto de Tailwind v4: no hace falta sobrescribirlos.
Además de breakpoints se usan **media features**: `(hover: hover) and (pointer: fine)` para efectos de cursor, `prefers-reduced-motion`, `prefers-reduced-data`/`Save-Data` para el video del hero.

---

## 6. Bordes, radios y líneas

```css
--radius-none: 0;        /* POR DEFECTO: tarjetas, imágenes, botones, menú */
--radius-xs:   2px;      /* inputs, tags */
--radius-pill: 999px;    /* solo: botón play del reproductor, badge "en vivo" */

--border-hairline: 1px solid var(--color-border);
--border-strong:   1px solid var(--color-border-strong);
--border-input:    1px solid var(--color-border-input);
--border-accent:   2px solid var(--color-accent);
```
Sin sombras (`box-shadow`) para dar elevación: en el lenguaje oscuro la elevación se expresa con **superficie más clara + hairline**. Excepción: el glow carmesí (`0 0 48px rgb(225 36 63 / 0.25)`) en el CTA principal al hacer hover.

---

## 7. Capas y overlays

### Z-index
```css
--z-base: 0;  --z-raised: 10;  --z-sticky: 100;  --z-header: 200;
--z-player: 300;  --z-overlay: 400;  --z-menu: 500;  --z-modal: 600;
--z-toast: 700;  --z-grain: 900;  --z-skip-link: 1000;
```
`<dialog>` modal usa el *top layer* del navegador, por encima de cualquier z-index.

### Overlays (scrims) para texto sobre imagen
```css
--scrim-top:    linear-gradient(to bottom, rgb(10 10 11 / 0.7) 0%, transparent 100%);  /* navbar sobre hero */
--scrim-bottom: linear-gradient(to top, rgb(10 10 11 / 0.94) 0%, rgb(10 10 11 / 0.6) 38%, transparent 72%);
--scrim-left:   linear-gradient(to right, rgb(10 10 11 / 0.9) 0%, rgb(10 10 11 / 0.4) 45%, transparent 70%);
--scrim-full:   rgb(10 10 11 / 0.55);
--vignette:     radial-gradient(ellipse at center, transparent 55%, rgb(10 10 11 / 0.7) 100%);
```
**Regla:** todo texto sobre fotografía va sobre un scrim cuya opacidad bajo el texto sea ≥ 0.85 (equivale a un fondo efectivo de ~`#2A2A2A` en el peor caso → `bone` 11.95:1). Se verifica imagen por imagen en QA.

### Grano de película
SVG `feTurbulence` estático como imagen de fondo en un pseudo-elemento fijo, `opacity: 0.06`, `mix-blend-mode: overlay`, `pointer-events: none`, `z-index: var(--z-grain)`. **Estático, no animado**, para no gastar GPU de forma continua (con `prefers-reduced-motion` se mantiene igual porque no se mueve).

---

## 8. Movimiento (tokens)
Detalle completo en [11-motion-system.md](./11-motion-system.md).
```css
--duration-instant: 100ms;  --duration-fast: 180ms;  --duration-base: 280ms;
--duration-slow: 480ms;     --duration-cinematic: 900ms;  --duration-epic: 1400ms;

--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);     /* expo-out: revelados, entradas */
--ease-in-out:   cubic-bezier(0.76, 0, 0.24, 1);    /* quart: cortinas, wipes, menú */
--ease-standard: cubic-bezier(0.2, 0, 0, 1);        /* cambios de estado UI */
--ease-in:       cubic-bezier(0.7, 0, 0.84, 0);     /* salidas */

--stagger: 60ms;  --distance-sm: 1.5rem;  --distance-md: 3rem;
```

---

## 9. Estados interactivos

| Estado | Tratamiento | Token |
| :--- | :--- | :--- |
| **Hover** (solo `hover: hover`) | Cambio de superficie o *wipe* de relleno, subrayado que crece desde la izquierda. Sin cambios de tamaño que muevan el layout. | `--duration-fast`, `--ease-standard` |
| **Focus visible** | `outline: 2px solid var(--color-focus); outline-offset: 3px;` **Siempre visible con teclado**, nunca `outline: none` sin reemplazo. | `--color-focus` (6.33:1 sobre ink) |
| **Active / pressed** | `crimson-press` en primarios; `translateY(1px)` en el resto. | `--duration-instant` |
| **Current / selected** | Enlace de navegación actual: barra carmesí de 2 px + `aria-current="page"`. Filtro activo: relleno `bone`, texto `ink`. | — |
| **Disabled** | Texto `iron`, `cursor: not-allowed`, sin hover. Se prefiere **no deshabilitar** y explicar el porqué (por ejemplo "Entradas agotadas" como texto). | `--color-fg-disabled` |
| **Loading** | Skeleton `carbon` con un barrido lineal suave (se desactiva con reduced motion) y `aria-busy="true"`. | — |
| **Error** | Texto `crimson-text` + icono + mensaje explícito, asociado con `aria-describedby`. Nunca solo color. | `--color-error` |

Tamaño mínimo de objetivo táctil: **44 × 44 px** (más exigente que el mínimo de 24 px de WCAG 2.2 AA, criterio 2.5.8).

---

## 10. Calidad y accesibilidad (WCAG 2.2 AA)

| Criterio | Cómo lo cumple el sistema |
| :--- | :--- |
| 1.4.3 Contraste texto | Matriz §2.4: todos los textos ≥4.5:1; `crimson` y `iron` prohibidos como texto. |
| 1.4.11 Contraste no textual | Bordes de input `smoke` (5.47), foco `crimson-text` (6.33), señales `crimson-signal` (≥3.66). |
| 1.4.4 / 1.4.10 Zoom y reflow | Tipografía en `rem`/`clamp` con componente `rem`; layouts sin ancho fijo; se prueba a 320 px y al 200 % de zoom. |
| 1.4.12 Espaciado de texto | Contenedores sin altura fija en texto. |
| 2.1.1 Teclado | Todos los controles son nativos (`button`, `a`, `dialog`); los rails horizontales se pueden desplazar con teclado y tienen botones anterior/siguiente. |
| 2.2.2 Pausar, detener, ocultar | **El video loop del hero tiene botón de pausa visible**; no se reproduce automáticamente con reduced motion ni con Save-Data. |
| 2.3.3 Animación por interacción | `prefers-reduced-motion` desactiva parallax, pinning, split-text y transiciones de ruta (ver doc 11). |
| 2.4.1 Saltar bloques | Enlace "Saltar al contenido" como primer elemento enfocable. |
| 2.4.7 / 2.4.11 Foco visible y no oculto | Anillo con offset; la navbar fija usa `scroll-padding-top` para no tapar el elemento enfocado. |
| 2.5.8 Tamaño de objetivo | Mínimo 44 px. |
| 1.3.1 Estructura | Landmarks `header/nav/main/footer`, un `h1` por página, jerarquía de encabezados sin saltos. |
| 3.1.1 Idioma | `lang="es"` (fragmentos en inglés con `lang="en"`). |

### Presupuesto de rendimiento (objetivos para M003+)
- **LCP** < 2.0 s en móvil 4G: la imagen del hero es el elemento LCP (`priority`, AVIF/WebP, `sizes` correcto, ≤ 200 KB en móvil). El titular **no** empieza oculto esperando a JavaScript.
- **CLS** < 0.05: `aspect-ratio` en todo medio, *fallback* métrico de fuentes.
- **INP** < 150 ms: animaciones solo con `transform`/`opacity`; GSAP se carga **solo** en los componentes que lo usan.
- **Fuentes:** ≤ 3 familias, subset `latin`, solo los ejes y pesos necesarios.
- **JS:** la Home no debe necesitar JS para mostrar su contenido; el JS solo añade movimiento e interacción.
