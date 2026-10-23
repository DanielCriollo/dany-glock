# 12 — Arquitectura Visual de la Home

> Recorrido aprobado: **Hero → Latest Release → Artist Story → Music → Visuals → Events → Journal → Booking** (+ Footer).
> Componentes en [10](./10-components.md), movimiento en [11](./11-motion-system.md). Las fuentes de datos se refieren al modelo conceptual de [02 §3](./02-architecture.md) (aún no implementado).

## 1. Narrativa y ritmo

La Home se lee como una **película en 8 escenas**. El ritmo alterna intensidad (escenas "full-bleed" de imagen o tipografía) y respiro (escenas editoriales con aire), para que el usuario nunca sienta un muro de tarjetas.

| # | Escena | Intensidad | Fondo | Objetivo del usuario | Fuente de datos |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 01 | Hero | ●●●●● | Media full-bleed / `ink` | "¿Quién es?" → impacto | `site-settings` (media hero), último `release` destacado |
| 02 | Latest Release | ●●●● | `ink` | Escuchar lo nuevo | `releases` (`featured`, más reciente) |
| 03 | Artist Story | ●● | `graphite` | Conectar con la historia | `artist-profile` (bio media, cita) |
| 04 | Music | ●●● | `ink` | Explorar el catálogo | `releases` (todos, publicados) |
| 05 | Visuals | ●●●● | `ink` → full-bleed | Ver videos | `videos` |
| 06 | Events | ●●● | `graphite` | Ir a un show | `events` (futuros) |
| 07 | Journal | ●● | `ink` | Leer noticias | `articles` (3 recientes) |
| 08 | Booking | ●●●●● | `crimson` bloque / `ink` | Contratar / prensa | `site-settings` (contactos) |

Cada escena abre con un `SectionHeader` con índice `0X /`. Ese índice es el hilo conductor editorial y numera el recorrido como los capítulos de una revista.

---

## 2. Escenas

### 01 — Hero
- **Jerarquía:** 1) nombre del artista (`h1`, `display-xl`) · 2) media · 3) meta del último lanzamiento + CTA "Escuchar".
- **Composición:** `100svh`, media full-bleed; el titular ocupa ~90 % del ancho y sangra a la izquierda; la meta queda anclada a la base sobre una hairline. Desktop: titular en una línea si cabe; móvil: "DANY / GLOCK" en dos líneas.
- **Interacción:** CTA → abre el lanzamiento en el player (M006) o la ficha; botón pausa del video; "↓" hace scroll a la escena 02.
- **Movimiento:** `intro-hero-media`, `intro-hero-title`, `intro-chrome`; `parallax-soft` en `lg+`.
- **Móvil:** media 4:5 vertical; meta apilada; el CTA a ancho completo.
- **Sin fotografía oficial:** variante `typographic` (decisión por defecto hasta tener material).

### 02 — Latest Release
- **Jerarquía:** portada · título (`display-lg`) · CTA streaming · tracklist / créditos.
- **Composición (lg+):** portada en las columnas 1–6, texto en las 8–12. Con `pin-release`, la portada queda fija mientras la columna derecha recorre: eyebrow `SINGLE · AAAA` → título → fecha mono → `StreamingLink` ×N → tracklist (si es EP/álbum) → créditos.
- **Móvil:** portada a ancho completo → título → CTA primario fijo bajo la portada → links de streaming en lista.
- **Sin datos:** sección oculta.

### 03 — Artist Story
- **Jerarquía:** cita/manifiesto (`quote`) · bio media (`body-lg`) · retrato · "Leer biografía →".
- **Composición:** fondo `graphite` (cambio de "luz" de escena). `PullQuote` en 10 columnas arriba; debajo, `SplitMedia` con retrato 4:5 (o placeholder "fotografía oficial pendiente") y bio.
- **Movimiento:** `split-lines` sobre la cita (lg+), `reveal-mask` en el retrato.
- **Contenido:** **solo bio aprobada por el equipo**. No se publican premios ni logros sin verificación (ver Research Brain).

### 04 — Music
- **Jerarquía:** índice tipográfico de lanzamientos, ordenado del más reciente al más antiguo.
- **Composición:** `SectionHeader` + chips de filtro (Todo / Álbumes / EPs / Singles; botones con `aria-pressed`) + lista `ReleaseCard row`. En desktop, `row-cover-reveal` hace "flotar" la portada junto al cursor: es el momento "wow" editorial, sin ocupar espacio en el layout.
- **Móvil:** filas con miniatura fija y filtros en un scroll horizontal.
- **Límite:** 8 filas + "Ver discografía completa →".

### 05 — Visuals
- **Jerarquía:** video destacado · resto de videos.
- **Composición:** `VideoCard feature` full-bleed 16:9 (21:9 en `xl`) con título `heading`; debajo, un rail de `VideoCard rail`.
- **Interacción:** facade → `VideoModal`.
- **Móvil:** destacado 16:9 a ancho completo y rail con *peek* del 15 %.

### 06 — Events
- **Jerarquía:** próximas fechas en orden cronológico.
- **Composición:** fondo `graphite`; `EventList` con hasta 6 filas; "Ver todas las fechas →".
- **Estado vacío:** "Sin fechas anunciadas por ahora." + CTA a Booking (la sección se mantiene, porque refuerza el canal comercial).
- **Movimiento:** `reveal-up` por fila, con stagger.

### 07 — Journal
- **Composición:** 1 `ArticleCard lead` (7 columnas) + 2 `compact` (5 columnas, apiladas). En móvil, todo apilado.
- **Sin datos:** sección oculta.

### 08 — Booking
- **Jerarquía:** statement "BOOKING" (`display-xl`) · tres rutas de contacto.
- **Composición:** bloque de color `crimson` a sangre (único uso de carmesí como fondo extenso, para cerrar con energía) con el statement en `bone` (5.75:1) y debajo las rutas sobre `ink`.
- **Interacción:** cada ruta lleva a `/contacto?tipo=…` (formulario preseleccionado) o al press kit.

### Footer
Ver [10 §8](./10-components.md).

---

## 3. Comportamiento móvil global
- Se diseña a **375 px** primero y se valida en 320 px (reflow) y 430 px.
- Sin pinning, sin cursor-follow ni parallax por debajo de `lg`: en móvil el scroll es nativo y rápido.
- CTA principal siempre alcanzable con el pulgar (mitad inferior de la pantalla en hero y release).
- Tipografía display limitada por `clamp`: nunca provoca scroll horizontal (`overflow-x: clip`).
- Imágenes con `sizes` por breakpoint; el hero móvil sirve la versión vertical.

## 4. Navegación por teclado (orden de tabulación de la Home)
1. "Saltar al contenido" → 2. wordmark → 3. enlaces de nav → 4. Booking → 5. Menú → 6. CTA del hero → 7. pausa del video → 8. links de streaming del release → 9. filtros de Music → 10. filas de discografía → 11. rail de videos (región enfocable + botones) → 12. CTAs de eventos → 13. artículos → 14. rutas de booking → 15. footer.

Ningún elemento decorativo (portada flotante, marquee duplicado, grano) recibe foco ni se anuncia por el lector de pantalla.

## 5. SEO de la Home (para M009)
- `h1` = nombre del artista; cada escena usa `h2`.
- JSON-LD `MusicGroup` (o `Person` + `MusicGroup`, a decidir según el formato real del proyecto: ¿solista?) con `sameAs` limitado a perfiles **verificados**.
- Open Graph con la imagen oficial (pendiente).
