# 04 — Estrategia del Sistema de Diseño: Dark Cinematic Editorial

## 1. Concepto Visual y Dirección Artística

El lenguaje visual de **Dany Glock** se denomina **Dark Cinematic Editorial**.

Se aleja frontalmente de las interfaces web corporativas estándar, las tarjetas redondeadas con sombras suaves convencionales y las paletas brillantes. En su lugar, construye una **atmósfera de sala de cine nocturna, vanguardia editorial y estética urbana de alta costura**.

### Referencias y Sensaciones:
- **Atmósfera:** Nocturna, densa, envolvente, de lujo crudo y sonido de bajo distorsionado.
- **Espacialidad:** Grandes extensiones de espacio negativo oscuro (*deep black*), textos gigantescos en momentos de impacto (*hero headers*), contrastes extremos de escala y texturas de grano cinematográfico (*film grain*).
- **Interacción:** El cursor y el scroll se sienten orgánicos, pesados pero ágiles, como una cámara deslizándose sobre una toma cinematográfica (*steadicam*).

---

## 2. Tokens de Color

La paleta se estructura mediante variables semánticas en CSS y configuración de Tailwind para garantizar armonía, contraste WCAG 2.1 AA y facilidad de mantenimiento.

```css
:root {
  /* Fondos y Superficies (Escala de Oscuridad Profunda) */
  --color-bg-void: #070708;       /* El negro más profundo, fondo primario */
  --color-bg-obsidian: #0e0f12;   /* Superficie de tarjetas y módulos elevados */
  --color-bg-elevated: #16181d;   /* Menús flotantes, modales y reproductor */
  --color-border-subtle: #23262f; /* Bordes de precisión de 1px con opacidad */
  --color-border-hover: #3b404d;  /* Estados de hover y foco interactivo */

  /* Textos y Jerarquía Tipográfica */
  --color-text-primary: #f4f4f6;   /* Texto principal de alto contraste (Off-white platino) */
  --color-text-secondary: #9ea3b0; /* Subtítulos, metadatos y descripciones */
  --color-text-muted: #5e6473;     /* Fechas, créditos menores y notas técnicas */

  /* Acentos de Marca (Cromáticos) */
  --color-accent-amber: #e5a93c;   /* Acento primario: Oro sucio / Ámbar cinematográfico */
  --color-accent-crimson: #e0283c; /* Acento secundario: Rojo neón urbano para alertas/directos */
  --color-accent-glow: rgba(229, 169, 60, 0.15); /* Halos sutiles de luz */
}
```

---

## 3. Sistema Tipográfico

El sistema tipográfico combina una **tipografía Display con marcado carácter editorial y fuerza urbana** con una **tipografía Sans-serif de alta legibilidad técnica**.

| Uso | Familia Tipográfica Sugerida | Estilos / Pesos | Función |
| :--- | :--- | :--- | :--- |
| **Display / Títulos Principales** | `Syne` o `Clash Display` (Google Fonts / Fontshare) | `700 Bold`, `800 ExtraBold` | Títulos de álbumes, nombres de temas, manifiesto y titulares editoriales. Genera un impacto visual inmediato e inolvidable. |
| **Subtítulos & Secciones** | `Space Grotesk` o `Cabinet Grotesk` | `500 Medium`, `600 SemiBold` | Nombres de pistas, fechas de tour, categorías de noticias y botones de acción. |
| **Cuerpo de Texto & Editorial** | `Plus Jakarta Sans` o `Inter` | `400 Regular`, `500 Medium` | Letras de canciones, biografía extendida, artículos y notas de prensa. Proporciona lectura descansada sobre fondo oscuro. |
| **Datos Técnicos & Código ISRC** | `JetBrains Mono` o `Geist Mono` | `400 Regular` | Códigos de pista, minutero del reproductor, coordenadas de eventos y créditos de producción. |

---

## 4. Texturas, Atmósfera y Shaders

Para evitar que los fondos oscuros se sientan planos o digitales sin vida, se integran capas sutiles de profundidad analógica:

1. **Film Grain / Ruido Analógico:**  
   Un canvas SVG o WebGL ultra-ligero (con opacidad del 3-5% y modo de fusión `overlay`) que añade una sutil textura de celuloide a toda la pantalla sin penalizar el rendimiento ni la tasa de refresco.
2. **Viñeta Cinematográfica Dinámica:**  
   Gradientes radiales sutiles en los bordes del viewport que dirigen la mirada hacia el centro de la escena.
3. **Glow Anamórfico en Hero Sections:**  
   Halos difuminados en segundo plano que responden suavemente al movimiento del ratón en desktop (efecto de haz de luz en la niebla).
4. **Cristal Ahumado (Dark Glassmorphism):**  
   Fondos con `backdrop-blur: 16px` y fondos semitransparentes (`rgba(14, 15, 18, 0.75)`) para barras de navegación fijas y el reproductor de música inferior.

---

## 5. Principios de Movimiento (Motion Design)

El movimiento en Dany Glock es una herramienta de narrativa cinematográfica, no un adorno casual.

### Reglas de Animación:
- **Curva Bézier Cinematográfica:**  
  Todas las transiciones de página, revelados de texto y aperturas de modales utilizan una curva de aceleración personalizada:
  `cubic-bezier(0.16, 1, 0.3, 1)` (efecto *ease-out* elástico y suave).
- **Micro-interacciones en Botones:**  
  Al hacer hover, los botones no cambian bruscamente de color; se produce un sutil deslizamiento magnético del texto o una expansión interna del fondo luminoso.
- **Scroll Pinning en Discografía:**  
  Al hacer scroll por la sección de lanzamientos, la carátula principal queda anclada (*pinned*) con GSAP ScrollTrigger mientras el tracklist y los créditos se desplazan verticalmente con un efecto de revelado progresivo (*stagger*).
- **Accesibilidad Obligatoria (`prefers-reduced-motion`):**  
  Toda animación transformacional o de escala se desactiva inmediatamente mediante CSS y la API de GSAP si el usuario tiene habilitada la preferencia del sistema operativo de reducción de movimiento.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Accesibilidad y Estándares WCAG 2.1 AA

1. **Relación de Contraste:**  
   - Texto principal (`#f4f4f6`) sobre fondo void (`#070708`): Contraste de **18.7:1** (supera con creces el mínimo de 4.5:1 para nivel AAA).
   - Texto secundario (`#9ea3b0`) sobre fondo void: Contraste de **7.8:1** (nivel AAA).
2. **Indicadores de Foco Visibles:**  
   Los elementos interactivos mantienen un anillo de foco visible (`outline: 2px solid var(--color-accent-amber)`) cuando se navega con teclado (`:focus-visible`).
3. **Reproductor de Audio Accesible:**  
   - Controles nativos etiquetados con `aria-label` claros (*Reproducir*, *Pausar*, *Siguiente canción*, *Control de volumen*).
   - Anuncio para lectores de pantalla mediante `aria-live="polite"` del título de la pista en reproducción.
   - Atajos de teclado intuitivos (Espacio para Play/Pausa, Flechas para volumen).
