# 17 — Inventario de Imágenes Oficiales y Registro de Derechos (Misión 006-B.4)

**Fecha:** 2026-10-23. Archivos en `local/official-assets/` (**excluido de Git**): `covers/` y `youtube/` (originales), `web/` (versiones optimizadas). Flyers y fotos del brochure en `local/brochure-assets/` (ver `15-brochure-audit.md`).

> Regla aplicada: **oficial ≠ autorizado**. Se verifica la autenticidad (fuente oficial del artista o de su sello) y se registra por separado el estado de autorización de uso. Ninguna imagen se amplía artificialmente: el CDN de Apple devuelve la resolución nativa cuando se pide un tamaño mayor (Cicatrices = 1400 px) y la versión de 2048 px del avatar de YouTube, que era una ampliación del original de 829 px, se descartó.

---

## 1. Inventario

| # | Archivo (web) | Tipo | Fuente oficial | Original | Web | Titular / crédito | Autorización | Uso previsto |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| A1 | `cover-sig-sauer.jpg` | Portada | Apple Music (iTunes Lookup `1739566495`) — `is1-ssl.mzstatic.com/…/7ca93973-…jpg` | 3000×3000 JPG 1008 KB | 2048×2048 518 KB | ℗ 2024 Beatmen Generations · Distr. Diskover Co. · diseño «Ducker Design» (visible en arte) | Ver §2 | `releases/sig-sauer.coverImage` |
| A2 | `cover-so-fresh-so-clean.jpg` | Portada | Apple Music `1828774400` — `…/20326.jpg` | 3000×3000 1892 KB | 2048×2048 847 KB | ℗ 2025 BeatmenGenerations · Diskover Co. · «Ducker Design» | Ver §2 | `releases/so-fresh-so-clean.coverImage` |
| A3 | `cover-cicatrices.jpg` | Portada | Apple Music `6794031338` — `…/612891156447.jpg` | **1400×1400** 237 KB (resolución máxima disponible) | 1400×1400 166 KB | ℗ 2026 Prix Music Group | Ver §2 | `releases/cicatrices.coverImage` |
| A4 | `cover-exceso.jpg` | Portada | Apple Music `6792980912` — `…/881453147937_cover.jpg` | 3000×3000 1466 KB | 2048×2048 655 KB | ℗ 2026 BeatmenGenerations (lanzamiento de Nick Montana; Dany Glock invitado) | Ver §2 | `releases/exceso.coverImage` |
| B1 | `artist-avatar-youtube.jpg` | Foto promocional del artista | Avatar del canal oficial `UCf-4AJMV8QZz1jj4OVBzaxg` (@danyglock; identidad verificada desde el video oficial `kcac_CIFJ7k`) — `yt3.googleusercontent.com/OPoIxx…=s0` | 829×829 JPG | igual (sin recomprimir) | Canal oficial del artista; fotógrafo desconocido | Ver §2 | Candidata a retrato (recorte 4:5 → 663×829, por debajo de 1600×2000) |
| B2 | `artist-banner-youtube.jpg` | Banner promocional | Banner del canal oficial (`yt3…/OW9KUk…=s0`, sin recorte) | 2075×1167 JPG 365 KB | 2075×1167 334 KB | Canal oficial; incluye rótulo «DANY GLOCK» | Autorizado | **Descartado como Hero** tras revisión visual: rótulo sobre público con terceros identificables (incluida una menor), artista no reconocible; en la caja 4:5 del Hero exigía recorte y ampliación. Se conserva solo en local |
| C1–C6 | `youtube/thumb-<id>-maxres.jpg` | Miniaturas de videoclips | `i.ytimg.com/vi/<id>/maxresdefault.jpg` (6 videos oficiales del inventario) | 1280×720 | — | Canal oficial | La web ya las muestra desde YouTube (`i.ytimg.com`); no se copian a Media | `videos.customThumbnail` **no necesario** |
| D1 | `live-tarima-bn.jpg` | Foto en vivo | Brochure oficial p.3 | 1280×854 | — | Fotógrafo desconocido | Pendiente (brochure) | Galería (ya importada, oculta) |
| D2 | `live-tarima-luces.jpg` | Foto en vivo | Brochure oficial p.5 | 854×1280 | — | Fotógrafo desconocido | Pendiente | Galería (ya importada, oculta) |
| D3 | 12 flyers | Flyers | Brochure p.4 | 720–1136 × 1280 | — | Promotores/diseñadores | Pendiente | Galería (ya importados, ocultos) |

Notas de calidad:
- **C3 (SO FRESH, `hvoy-jQNUnc`)** muestra principalmente a una modelo, no al artista: no usar como imagen del artista.
- No existe en las fuentes públicas **ninguna fotografía de prensa ≥ 1600×2000** para el retrato ni una vertical 1080×1920 para el Hero móvil.

## 2. Estado de autorización

| Material | Autenticidad | Base de uso | Estado |
| :--- | :--- | :--- | :--- |
| Portadas A1–A4 | ✅ Verificada (Apple Music, mismo ID que `releases`) | Las directrices de Apple Music regulan enlaces e insignias, **no conceden derechos sobre el arte**; los derechos son de los sellos | **Autorizado** por el responsable del sitio oficial (confirmación en sesión 2026-10-23). Recomendable conservar por escrito la conformidad de Beatmen Generations / Prix Music Group |
| Avatar y banner B1–B2 | ✅ Verificada (canal oficial) | Material publicado por el propio artista | **Autorizado** por el responsable del sitio (2026-10-23). Fotógrafo sin acreditar |
| Fotos y flyers del brochure | ✅ Entregado por el equipo | Ver BRO-08 | **Pendiente** (derechos de fotógrafos/promotores) |

## 3. Fuentes revisadas sin material recuperable

| Fuente | Resultado | Acción |
| :--- | :--- | :--- |
| Instagram `@danyglock_` | Sin sesión solo expone foto de perfil (baja resolución) y contadores; publicaciones requieren login | No se elude el login. Solicitar al equipo los originales de las fotos publicadas |
| TikTok `@dany.glock7` (brochure) | Contenido no disponible sin JavaScript/sesión | Pendiente |
| Spotify | Perfil no verificado en el inventario; la búsqueda es una SPA que requiere credenciales de API | Pendiente de URL oficial |
| Apple Music — imagen de artista | No expuesta por la API pública | Pendiente |

## 4. Imágenes que faltan (solicitar al equipo)
1. Retrato vertical 4:5 ≥ 1600×2000 (biografía, EPK).
2. Hero desktop 16:9 ≥ 1920×1080 sin texto sobreimpreso.
3. Hero móvil 9:16 ≥ 1080×1920.
4. 3–6 fotos de prensa con crédito del fotógrafo (EPK).
5. Portada de Cicatrices en ≥ 3000×3000 (Apple solo publica 1400×1400).
6. Fotos en vivo en alta resolución con crédito.

---

## 5. Integración en Payload local (2026-10-23)

Script idempotente `src/scripts/import-official-assets.ts` (solo reemplaza marcadores `placeholder-cover*`/`test-cover*` o campos vacíos; no sobrescribe medios reales).

| Campo | Asignado | Notas |
| :--- | :--- | :--- |
| `releases/sig-sauer.coverImage` | `cover-sig-sauer.jpg` 2048² | `coverStatus = confirmed` |
| `releases/so-fresh-so-clean.coverImage` | `cover-so-fresh-so-clean.jpg` 2048² | `confirmed` |
| `releases/cicatrices.coverImage` | `cover-cicatrices.jpg` 1400² | `confirmed`; sin tamaño `desktop` (no se amplía) |
| `releases/exceso.coverImage` | `cover-exceso.jpg` 2048² | `confirmed` |
| `artist-profile.portraitImage` | `artist-avatar-youtube.jpg` 829² | Recorte 4:5 `object-top`; suficiente hasta ~400 px de ancho (≈ 2× en la caja de 357–446 px) |
| `artist-profile.heroDesktopMedia` / `heroMobileMedia` | — vacío | Sin foto adecuada; el Hero conserva el canvas editorial |
| `videos.customThumbnail` | — no usado | La web ya usa las miniaturas oficiales de YouTube |
| Galería (brochure) | sin cambios | Oculta, derechos pendientes (BRO-08) |

`media.gallery.rightsStatus = approved` y `visible = false` en los medios importados (registra la autorización sin publicarlos en la galería de shows).

## 6. Verificación visual
Capturas en `local/official-assets/verification/` (excluido de Git): Home, Biografía y Booking en desktop 1440×900 y móvil 375×812 (vista superior, página completa y secciones Lanzamiento / Música / El Artista). Sin imágenes rotas, sin desbordamiento horizontal, sin errores de consola, jerarquía de encabezados sin saltos. Imágenes servidas por `/_next/image` a tamaño de caja (p. ej. portadas 359² para tarjetas de 274² en desktop).

---

## 7. Producción (2026-10-23 21:45 UTC)

Importados en `danyglock_db` con `import-official-assets.ts` (archivos transferidos por SCP, SHA-256 verificado):

| Medio | Asignación | Estado |
| :--- | :--- | :--- |
| `cover-sig-sauer.jpg` 2048² | `releases/sig-sauer` | `confirmed` |
| `cover-so-fresh-so-clean.jpg` 2048² | `releases/so-fresh-so-clean` | `confirmed` |
| `cover-cicatrices.jpg` 1400² | `releases/cicatrices` | `confirmed` |
| `cover-exceso.jpg` 2048² | `releases/exceso` | `confirmed` |
| `artist-avatar-youtube.jpg` 829² | `artist-profile.portraitImage` | — |
| — | `releases/sig-sauer-remix` (borrador) | Sin portada oficial: placeholder + `pending` |
| — | Hero desktop/móvil | Vacío (fallback editorial) |

Sin duplicados; el placeholder previo se conserva; ningún flyer ni foto del brochure en producción.

**Visibilidad pública verificada (2026-10-23 22:05 UTC):** 4 portadas en la discografía de `/` y retrato en `/` y `/biografia`, servidos por `/_next/image` (200, `image/jpeg`).
