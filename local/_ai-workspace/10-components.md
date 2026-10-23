# 10 — Especificación de Componentes

> Diseño conceptual: anatomía, variantes, estados, comportamiento responsive y accesibilidad. **No es código.** Tokens en [04](./04-design-system-strategy.md), animaciones en [11](./11-motion-system.md).
> Convención: **[S]** = Server Component, **[C]** = hoja cliente (`'use client'`), mínima.

---

## 1. Navbar `SiteHeader` [S] + `MenuToggle` [C]

**Anatomía (desktop ≥ lg):**
```
┌──────────────────────────────────────────────────────────────────────────┐
│ DANY GLOCK        Música  Videos  Shows  Journal  Press      BOOKING  ☰ │
└──────────────────────────────────────────────────────────────────────────┘
```
- Izquierda: wordmark tipográfico "DANY GLOCK" (Archivo `wdth 75` `wght 800`, label-size ampliado) → enlace a `/`. **No se inventa un logotipo**: si el artista tiene logo oficial, se sustituye.
- Centro: 5 enlaces `label` con `link-underline`; el actual lleva `aria-current="page"` y una barra carmesí de 2 px.
- Derecha: CTA texto "Booking" (`crimson-text`) y botón de menú.

**Móvil (base):** wordmark + botón de texto **"Menú"** (44 × 44 mínimo; se prefiere texto antes que un icono hamburguesa ambiguo).

**Estados:**
| Estado | Fondo | Disparador |
| :--- | :--- | :--- |
| Sobre hero | Transparente + `--scrim-top` sutil para legibilidad | Inicial |
| Condensado | `--color-bg-glass` + `backdrop-filter: blur(16px)` + hairline inferior | Sentinel a 80 px fuera de vista |
| Oculto | `translateY(-100%)` | Scroll hacia abajo (> 8 px) |
| Visible | `translateY(0)` | Scroll hacia arriba, foco dentro del header, menú abierto |

**a11y:** `<header>` + `<nav aria-label="Principal">`; el header nunca se oculta si contiene el foco; `scroll-padding-top` igual a la altura del header.

### Menú móvil / overlay `SiteMenu` [C] (también disponible en desktop)
- `<dialog>` nativo con `showModal()`: atrapa el foco, cierra con `Esc`, devuelve el foco al botón y deja el fondo inerte.
- Layout: fondo `ink` 100 %, lista de enlaces **gigantes** (`display-lg`) con índice mono `01–07` a la izquierda; abajo, redes y streaming como enlaces de texto, más el email de booking.
- Animación `menu-open`; con reduced motion aparece sin cortina.
- `aria-expanded` y `aria-controls` en el botón; el botón cambia su texto a "Cerrar".

---

## 2. Hero cinematográfico `HeroCinematic` [S] + `HeroVideoControl` [C]

**Anatomía:**
```
┌───────────────────────────────────────────────┐ 100svh
│ [foto o video full-bleed + vignette + grano]  │
│                                               │
│ DANY                                          │ ← display-xl, sangra a la izquierda
│ GLOCK                                         │
│ ───────────────────────────────────────────── │ hairline
│ NUEVO LANZAMIENTO      ▶ Escuchar   ⏸  01:24 │ ← meta inferior
│ Título del lanzamiento                 ↓ Scroll│
└───────────────────────────────────────────────┘
```
- **Media:** imagen (elemento LCP, `priority`) o video loop corto (≤ 6 s, muted, `playsInline`, con `poster` = la imagen LCP). El video **no se carga** con `prefers-reduced-motion`, `Save-Data` ni conexiones lentas.
- **Control de pausa obligatorio** (WCAG 2.2.2) cuando hay video.
- **Título:** `h1` con el nombre del artista; ocupa todo el ancho en móvil (dos líneas apiladas).
- **Meta inferior:** destacado del último lanzamiento (si existe en el CMS), CTA "Escuchar" y señal de scroll.
- **Variantes:** `image` | `video` | `typographic` (sin foto: fondo `ink` con grano y el titular a escala máxima; es el estado por defecto **mientras no haya fotografía oficial**).
- **Móvil:** media vertical 4:5 → `object-fit: cover` con `object-position` editable desde el CMS (punto focal).
- **Contraste:** scrim inferior obligatorio bajo la meta.

---

## 3. Botones y enlaces `Button` / `TextLink` [S]

| Variante | Reposo | Hover | Uso |
| :--- | :--- | :--- | :--- |
| `primary` | Relleno `crimson`, texto `bone` `label`, radio 0, padding `14px 24px` | `btn-wipe` → `crimson-hover` + glow | Un CTA principal por vista ("Escuchar ahora", "Comprar entradas") |
| `secondary` | Borde `bone` 1 px, texto `bone` | Relleno `bone`, texto `ink` | Acción secundaria ("Ver discografía") |
| `ghost` | Texto `bone` + flecha → | Flecha avanza 4 px, texto `crimson-text` | Enlaces de sección ("Ver todo") |
| `icon` | 44 × 44, icono 20 px, `aria-label` obligatorio | Fondo `carbon` | Play, cerrar, anterior/siguiente |
| `TextLink` | Texto heredado, subrayado de 1 px con offset de 4 px | `link-underline` → `crimson-text` | Enlaces dentro de texto |
| `StreamingLink` | Fila: nombre de la plataforma (texto) + `↗` | Fondo `carbon` | Spotify, Apple Music, YouTube… (se usan nombres en texto, no logos; los logos de marca exigen cumplir las guías de cada plataforma) |

- `<a>` para navegar, `<button>` para acciones. Los enlaces externos llevan `rel="noopener"` y un texto oculto "(se abre en otra pestaña)" si usan `target="_blank"`.
- Estados de foco, pressed y disabled según [04 §9](./04-design-system-strategy.md).

---

## 4. Tarjeta de lanzamiento `ReleaseCard` [S]

**Variantes:**
| Variante | Composición | Dónde |
| :--- | :--- | :--- |
| `feature` | Portada grande (1:1) + columna con eyebrow `SINGLE · AAAA`, título `display-lg`, fecha mono, lista de `StreamingLink`, CTA | Latest Release |
| `row` | Fila tipográfica: índice mono · título `display-md` · tipo · año · flecha. Hover desktop: `row-cover-reveal` | Music (índice de discografía) |
| `tile` | Portada 1:1 + título `title` + tipo/año `mono` | Grillas, relacionados, móvil |

- La portada nunca se recorta ni se le aplican filtros; `aspect-ratio: 1`.
- Toda la tarjeta es clicable mediante un único `<a>` en el título con un pseudo-elemento que cubre la tarjeta (patrón *stretched link*), así se evitan enlaces anidados.
- **Móvil:** `row` muestra una miniatura de 56 px a la izquierda (no hay hover).
- Badge opcional: `NUEVO` (`crimson-signal` punto + label) durante 30 días tras `releaseDate`.

---

## 5. Tarjeta de video `VideoCard` [S] + `VideoModal` [C]

- Póster 16:9 (thumbnail personalizado del CMS o el de YouTube), scrim inferior, título `title`, label tipo (`VIDEOCLIP`, `LIVE SESSION`…), dirección en `small`.
- Botón play: círculo `radius-pill` de 64 px con borde `bone`; es la **única** forma circular del sistema junto al player.
- **Patrón facade:** no se carga el iframe de YouTube hasta el clic; entonces se abre un `<dialog>` con `youtube-nocookie.com`. Ahorra cientos de KB y cookies de terceros.
- Variantes: `feature` (16:9 ancho completo con título `heading`) y `rail` (en rail horizontal).
- **Rail:** `overflow-x: auto` + `scroll-snap-type: x mandatory`, enfocable con teclado (`tabindex="0"` + `role="region"` + `aria-label`), botones anterior/siguiente en desktop. En móvil, cada tarjeta ocupa el 85 % del ancho para que se vea la siguiente.

---

## 6. Agenda de eventos `EventList` / `EventRow` [S]

**Anatomía de fila:**
```
 DD      │ CIUDAD                         │ PREVENTA  │ Entradas ↗
 MES AA  │ Nombre del venue · País        │           │
```
- Fecha: día en `display-md` + mes/año en `mono`. **Se usa `<time datetime="…">`**.
- Ciudad `display-md` (truncada con elipsis en móvil), venue + país en `small`/`ash`.
- **Estado del ticket** (badge texto + forma, nunca solo color):
  | Estado | Estilo |
  | :--- | :--- |
  | `available` | CTA primario "Entradas" |
  | `presale` | Badge `ember` "PREVENTA" + CTA secondary |
  | `sold_out` | Texto `smoke` tachado "AGOTADO", sin CTA |
  | `free` | Badge "ENTRADA LIBRE" |
  | `cancelled` | Fila con opacidad reducida + "CANCELADO" (el texto se mantiene ≥4.5:1) |
- **Móvil:** se apila en dos líneas (fecha + ciudad / venue + CTA a ancho completo).
- Se presenta como `<ol>` cronológica; los eventos pasados van en una sección colapsable aparte (`<details>`).
- Datos estructurados: `MusicEvent` (JSON-LD) en M009.

---

## 7. Secciones editoriales `EditorialSection` [S]

Bloques de composición reutilizables para Artist Story, Journal y páginas internas:

| Bloque | Descripción |
| :--- | :--- |
| `SectionHeader` | Índice mono (`02 /`) + eyebrow `label` + título `display-lg` alineado a la izquierda + enlace `ghost` opcional a la derecha. Hairline superior. |
| `PullQuote` | Cita `quote` (Instrument Serif *italic*) en 8–10 columnas + atribución `label` (medio, fecha). Solo citas reales con fuente verificable. |
| `SplitMedia` | Imagen 4:5 en 5 columnas + texto en 5 columnas con una columna de aire; alternable izquierda/derecha. |
| `ArticleCard` | `lead` (imagen 3:2 grande + `heading`) o `compact` (sin imagen o con miniatura + `title`). Categoría `label` + fecha `mono`. |
| `Prose` | Texto enriquecido de Lexical renderizado con estilos `body` y `max-width: 68ch`; capitulares opcionales en Instrument Serif. |
| `Marquee` | Banda de texto en movimiento horizontal (por ejemplo "NUEVO SINGLE — DISPONIBLE EN TODAS LAS PLATAFORMAS —"). **Se detiene con reduced motion y al pasar el cursor o enfocar**; el contenido se duplica con `aria-hidden` en la copia. Uso: máximo uno por página. |

---

## 8. Footer y contacto `SiteFooter` / `BookingBlock` [S] + `ContactForm` [C]

**BookingBlock (cierre de la Home):** statement `display-xl` "BOOKING" + tres rutas grandes:
```
BOOKING & SHOWS      →  correo / formulario
PRENSA & MEDIOS      →  press kit
COLABORACIONES       →  formulario
```
Cada ruta es una fila con hairline y hover `carbon`. Los correos se muestran como texto (no se ocultan con JS: es accesible y anti-spam razonable con un formulario como alternativa principal).

**ContactForm (M008):** labels visibles (nunca solo placeholder), inputs con `border-input` y `radius-xs`, errores en línea con `aria-describedby`, `autocomplete` correcto, honeypot anti-spam, estados *enviando/éxito/error* anunciados con `aria-live="polite"`.

**SiteFooter:** wordmark grande recortado por el borde inferior (gesto editorial), columnas de navegación, streaming y redes (texto), créditos, aviso legal, año, control "Reducir movimiento" y enlace "Volver arriba".

---

## 9. Estados vacíos y de carga

| Componente | Vacío (sin datos en el CMS) | Carga |
| :--- | :--- | :--- |
| Hero | Variante `typographic` | — (render en servidor) |
| Latest Release | Se **oculta** la sección (sin hueco) | Skeleton: cuadrado `carbon` + 3 líneas |
| Music | "La discografía se está preparando." + enlaces a plataformas desde `site-settings` | Filas skeleton ×4 |
| Visuals | Se oculta la sección; si hay canal de YouTube, se muestra el CTA "Ver canal" | Pósters skeleton 16:9 |
| Events | **"Sin fechas anunciadas por ahora."** + CTA "Contratar un show" → Booking | Filas skeleton ×3 |
| Journal | Se oculta la sección | Tarjetas skeleton |
| Imagen pendiente | Placeholder `graphite` con grano + label mono "FOTOGRAFÍA OFICIAL PENDIENTE" | Color dominante (`placeholder` con `blurDataURL`) |
| Error de página | `not-found` / `error` cinematográficos: "404 — ESCENA NO ENCONTRADA" en `display-xl` + regreso a inicio | — |

Reglas: los skeletons respetan las dimensiones finales (CLS 0); su barrido se desactiva con reduced motion; `loading.tsx` de Next.js por segmento solo donde haya datos lentos.

---

## 10. Reproductor persistente `PlayerBar` [C] (anticipo para M006)
- Barra inferior fija de 64 px, `--color-bg-glass`, `z-player`. Portada de 40 px · título/artista · play (`radius-pill`) · progreso (`crimson-signal`) · tiempo mono · volumen (desktop).
- Solo aparece tras una acción del usuario (**nunca autoplay**).
- Atajos cuando el foco está en el player: espacio = play/pausa, flechas = buscar/volumen. Anuncio `aria-live="polite"` al cambiar de pista.
- El slider de progreso y el de volumen deben ser `input type="range"` nativos estilizados; si su accesibilidad no es suficiente en Safari, se evalúa `@radix-ui/react-slider` (dependencia bajo demanda).
