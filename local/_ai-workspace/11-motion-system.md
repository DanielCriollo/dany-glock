# 11 — Sistema de Movimiento

> Tokens en [04-design-system-strategy.md §8](./04-design-system-strategy.md). Decisión de herramientas en ADR-008 ([05-technical-decisions.md](./05-technical-decisions.md)).

## 1. Filosofía
El movimiento es **lenguaje de cámara**, no decoración:
- **Revelar** (cortina, máscara, *wipe*): el contenido "aparece en plano".
- **Desplazar** (dolly / parallax leve): da profundidad a la fotografía.
- **Enfocar** (cambio de opacidad, desenfoque a nitidez): dirige la atención.

Reglas: una animación protagonista por pantalla; ninguna animación bloquea la lectura ni la interacción; **el contenido existe y es legible sin JavaScript**.

---

## 2. ¿CSS, GSAP o Motion? Matriz de decisión

Versiones verificadas en npm (2026-10-22): `gsap 3.15.0` (todos los plugins, incluidos ScrollTrigger y SplitText, son gratuitos para uso comercial desde 3.13), `@gsap/react 2.1.2`, `motion 14.6.0`, `lenis 1.3.27`.

| Necesidad | Herramienta | Motivo |
| :--- | :--- | :--- |
| Hover, foco, *pressed*, subrayados, *wipes* de botón | **CSS** (`transition`) | Cero JS, se ejecuta en el compositor, funciona en Server Components. |
| Apertura y cierre del menú y de modales | **CSS** + `<dialog>` nativo (`@starting-style`, `transition-behavior: allow-discrete`) | El navegador gestiona el *top layer*, el foco y `Esc`. Sin dependencia. |
| Intro del hero al cargar | **CSS** (`@keyframes` + `animation-delay`) | Debe ocurrir antes de la hidratación y no puede depender de JS (protege el LCP). |
| Revelado simple al entrar en viewport (fade/slide) | **CSS scroll-driven** (`animation-timeline: view()`) dentro de `@supports` | Soporte estable en Chrome/Edge 115+, Safari 26+ y Firefox 160+. Sin soporte: el contenido aparece estático (mejora progresiva). |
| Pinning (portada fija mientras corre el tracklist), *scrub* de timeline, secuencias coordinadas | **GSAP + ScrollTrigger** | CSS no resuelve el pinning con secuencias complejas. GSAP es el estándar y la herramienta más robusta. |
| Revelado de titulares línea a línea o letra a letra | **GSAP SplitText** | Maneja el *re-split* al cambiar de tamaño y deja `aria-label` en el texto original. |
| Transición entre rutas | **View Transitions** (React `<ViewTransition>` / API nativa) como mejora progresiva | Nativo, sin librería. Navegadores sin soporte navegan sin transición. Se valida en M005, ya que en Next.js es una función aún marcada como experimental. |
| Animaciones de layout / presencia en React (`AnimatePresence`, `layout`) | **Motion — NO se adopta por ahora** | Los casos previstos (menú, modal, player) ya los cubren CSS + `<dialog>` + View Transitions. Añadir Motion duplicaría capacidades con GSAP y sumaría otra librería de animación al bundle cliente. Se reabre solo si aparece un caso concreto (por ejemplo, el player expandible con gestos). |
| Smooth scroll inercial | **Lenis — DIFERIDO, no por defecto** | Altera el scroll nativo (accesibilidad, anclas, `position: sticky`, buscar en página). Se probará en M005 con un prototipo y se medirá el INP; si se adopta, se desactiva con reduced motion y en dispositivos táctiles. |

**Resultado:** dependencias de animación previstas = **solo `gsap` + `@gsap/react`**, cargadas únicamente en las hojas cliente que las usan (`next/dynamic` o import dentro de `useGSAP`). Esto revisa el ADR-002 de M001.

---

## 3. Catálogo de animaciones

### Entrada (carga de página)
| ID | Elemento | Animación | Duración / easing | Tecnología |
| :--- | :--- | :--- | :--- | :--- |
| `intro-hero-title` | Nombre del artista | Revelado por máscara vertical (`clip-path: inset(100% 0 0 0)` → `inset(0)`) por línea, con stagger | `--duration-cinematic`, `--ease-out`, stagger 90 ms | CSS |
| `intro-hero-media` | Imagen/video del hero | Escala 1.08 → 1 + opacidad 0 → 1 (la imagen se pinta desde el primer frame; solo cambia `transform`) | `--duration-epic`, `--ease-out` | CSS |
| `intro-chrome` | Navbar, meta inferior | Fade + 12 px hacia arriba, tras el título | `--duration-slow`, delay 600 ms | CSS |

### Scroll
| ID | Elemento | Animación | Tecnología |
| :--- | :--- | :--- | :--- |
| `reveal-up` | Bloques de texto, tarjetas | Opacidad 0 → 1 y `translateY(--distance-sm)` → 0 en el rango `entry 0% → entry 60%` | CSS scroll-driven |
| `reveal-mask` | Imágenes editoriales | `clip-path` de abajo hacia arriba | CSS scroll-driven |
| `parallax-soft` | Fotografía del hero y de Artist Story | `translateY` de 0 a -8 % (máximo) | CSS scroll-driven (`lg+`) |
| `pin-release` | Portada en Latest Release | Pin de la portada mientras el tracklist recorre su columna | GSAP ScrollTrigger (`lg+`) |
| `split-lines` | Cita de Artist Story | Líneas que suben desde la máscara con *scrub* suave | GSAP SplitText (`lg+`) |
| `nav-condense` | Navbar | Pasa a fondo glass tras 80 px; se oculta al bajar y aparece al subir | CSS + listener pasivo mínimo (`IntersectionObserver` sobre un sentinel) |

### Hover (solo `(hover: hover) and (pointer: fine)`)
| ID | Elemento | Animación |
| :--- | :--- | :--- |
| `btn-wipe` | Botón primario | Relleno `crimson-hover` que barre de izquierda a derecha (`scaleX` en un pseudo-elemento) + glow |
| `link-underline` | Enlaces de texto | Subrayado de 1 px que crece desde la izquierda (`scaleX`), color `crimson-text` |
| `row-cover-reveal` | Fila de discografía | Imagen de la portada que sigue al cursor (offset con `transform`), fade in de 180 ms. Solo decorativa (`aria-hidden`) |
| `card-zoom` | Póster de video | Imagen 1 → 1.04, scrim más intenso, icono play que se desplaza 4 px |

### Transiciones
| ID | Caso | Animación |
| :--- | :--- | :--- |
| `menu-open` | Menú overlay | Cortina `clip-path` desde arriba (`--ease-in-out`, 480 ms) y links con stagger de 60 ms |
| `modal-video` | Modal de video | Fade del backdrop + escala 0.96 → 1 |
| `route-crossfade` | Cambio de página | Crossfade de 280 ms; el elemento compartido "portada" morfea de la lista a la ficha (View Transitions, M005/M006) |

---

## 4. `prefers-reduced-motion: reduce`

No basta con anular las duraciones: hay que **cambiar el tipo de movimiento**.

| Se elimina | Se conserva (sin desplazamiento) |
| :--- | :--- |
| Parallax, pinning, *scrub*, split-text, zoom del hero, cortina del menú, transiciones de ruta, video autoplay, cursor-follow | Cambios de color y opacidad ≤ 180 ms (hover, foco), aparición instantánea del contenido |

Implementación:
```css
@media (prefers-reduced-motion: reduce) {
  :root { --duration-slow: 0ms; --duration-cinematic: 0ms; --duration-epic: 0ms; }
  [data-motion="reveal"], [data-motion="parallax"] { animation: none !important; opacity: 1; transform: none; clip-path: none; }
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
```
```ts
// GSAP: todo el código de animación vive dentro de gsap.matchMedia()
const mm = gsap.matchMedia();
mm.add({ motionOK: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 64rem)' }, (ctx) => {
  const { motionOK, desktop } = ctx.conditions!;
  if (!motionOK || !desktop) return; // contenido estático, ya visible
  // ...pinning / split
});
```
Además, la Home ofrecerá un **control propio "Reducir movimiento"** en el footer (persistido en `localStorage`, aplica `data-reduced-motion` en `<html>`), para quien no conoce la preferencia del sistema operativo.

---

## 5. Reglas de implementación (para M005+)
1. Solo se animan `transform`, `opacity`, `clip-path` y `filter` (este último con moderación).
2. Ningún contenido parte de `opacity: 0` en el HTML del servidor si depende de JS para aparecer. Los estados iniciales ocultos se declaran en CSS **dentro** de `@supports` o `@media (prefers-reduced-motion: no-preference)`.
3. GSAP: siempre `useGSAP({ scope })`, nunca `useEffect` crudo; los `ScrollTrigger` se limpian al desmontar y se refrescan tras cargar las fuentes (`document.fonts.ready`).
4. `will-change` solo durante la animación, nunca permanente.
5. Presupuesto: ≤ 1 timeline de ScrollTrigger activa por sección; sin animaciones en elementos fuera del viewport.
