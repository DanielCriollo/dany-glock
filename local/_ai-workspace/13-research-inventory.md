# 13 — Inventario de Investigación y Trazabilidad de Fuentes (Misión 006-A)

> Fecha de consulta: **2026-10-23**. Método: consulta HTTP directa (API pública iTunes Lookup, páginas públicas de YouTube y Apple Music, oEmbed de YouTube) + búsqueda web. **Solo se siembran como hechos los datos con estado `Verificado`.**
> Leyenda: ✅ **Verificado** (plataforma/fuente primaria, consultada hoy) · 🟡 **Por confirmar** (fuente secundaria, indirecta o no reproducible) · 📝 **Propuesta editorial** (texto redactado por el equipo; requiere aprobación del artista).

## 0. Verificación de identidad (anti-homonimia)

| Criterio | Evidencia | Estado |
| :--- | :--- | :--- |
| Perfil Apple Music `1739565666` («Dany Glock», género *Urbano latino*) | `itunes.apple.com/lookup?id=1739565666` | ✅ |
| Canal YouTube `@danyglock` (`UCf-4AJMV8QZz1jj4OVBzaxg`) publica «SIG Sauer», «SO FRESH, SO CLEAN», «Cicatrices» | oEmbed + páginas `watch` | ✅ |
| Coincidencia de créditos entre YouTube y Apple (Prod. **Nick Montana Beatmen**; ℗ Beatmen Generations) | Cruce YouTube ↔ Apple | ✅ corroboración cruzada |
| Instagram `@danyglock_` (URL entregada por el cliente; la página pública existe) | `instagram.com/danyglock_/` (metadatos OG: 187 publicaciones) | ✅ existencia · el número de seguidores **no se publica** (cifra variable) |
| Origen **Pasto, Nariño, Colombia** | Prensa regional citada en el Brain + resultados de búsqueda. El artículo de El Periódico Deportivo devuelve **404** hoy y el cuerpo del artículo de EXTRA no es recuperable | 🟡 (se redacta como «vinculado a Pasto, Nariño») |
| Homónimos descartados | «Glock/Dany Glock» devuelve armas (Glock 17, SIG P226) y *Dani Glock*; **no** se atribuyó nada de ellos | ✅ |

> **Corrección de datos previos:** el scaffold de las Misiones 004/005 contenía *placeholders inventados* (Quetzaltenango/Guatemala, «altiplano», correos `booking@`/`press@danyglock.com`, comunicados de prensa ficticios, «respuesta en 48 h», «Temporada 2026»). **Se eliminaron en M006-A.** El único dominio real conocido es el del correo del administrador local (no es un contacto público).

## 1. Discografía (Apple Music / iTunes Lookup — consultado 2026-10-23)

| # | Dato | Fuente | Estado | Registro CMS |
| :-: | :--- | :--- | :-: | :--- |
| 1 | **SIG Sauer** — Dany Glock — Single — 2024-04-04 — 2:52 — Explícito — ℗ 2024 Beatmen Generations · Distr. Diskover Co. | https://music.apple.com/us/album/sig-sauer-single/1739566495 | ✅ | `releases/sig-sauer` + `tracks/sig-sauer` |
| 2 | **SO FRESH, SO CLEAN** — Nick Montana & Dany Glock — Single — 2025-07-29 — 2:48 — ℗ 2025 BeatmenGenerations · Distr. Diskover Co. | https://music.apple.com/us/album/so-fresh-so-clean-single/1828774400 | ✅ | `releases/so-fresh-so-clean` + `tracks/so-fresh-so-clean` |
| 3 | **Cicatrices (feat. Maick Records)** — Nick Montana, Dark Pro & Dany Glock — Single — 2026-07-01 — 3:19 — Explícito — ℗ 2026 Prix Music Group | https://music.apple.com/us/album/cicatrices-feat-maick-records-single/6794031338 | ✅ | `releases/cicatrices` + `tracks/cicatrices` |
| 4 | **EXCESO (feat. Dany Glock & Sebas BP)** — Nick Montana — Single — 2026-07-07 — 2:35 — ℗ 2026 BeatmenGenerations. *Dany Glock figura como invitado.* | https://music.apple.com/us/album/exceso-feat-dany-glock-sebas-bp-single/6792980912 | ✅ | `releases/exceso` + `tracks/exceso` (rol `featured`) |
| 5 | **SIG Sauer (Remix)** — colaboradores en el título de YouTube: Brak Johnz, Dollaro, TVZ, Selene Psycho, Darev, Loneliness. Fecha DSP 2024-12-28 según Amazon Music (página SPA, no reproducible) | https://music.amazon.fr/albums/B0DS2SL23S · https://www.youtube.com/watch?v=4BzpqeraFjc | 🟡 | `releases/sig-sauer-remix` (**borrador**, no público) |
| — | Productor: «Prod. Nick Montana Beatmen» (SIG Sauer, SO FRESH) y «Prod. Nick Montana x Dark Pro» (Cicatrices) — título del video en YouTube | ver §2 | ✅ (título del canal) | `tracks.credits.producers` |
| — | **ISRC, UPC, compositores, mezcla, mastering** | No expuestos por Apple Lookup; requieren al distribuidor | 🟡 pendiente | campos vacíos |
| — | **Portadas** (URLs `mzstatic` de Apple) | Existen, pero **no se descargan ni redistribuyen** (derechos) | 🟡 | `coverStatus = pending`, placeholder |
| — | **Spotify** (perfil y URIs de embed) | No se verificó un perfil de artista inequívoco → **no se asigna URL** | 🟡 pendiente | `socialLinks.spotify` vacío |

## 2. Videos (YouTube — oEmbed + páginas `watch`, consultado 2026-10-23, canal `@danyglock`)

| ID | Título en YouTube | Fecha de carga (hora del canal) | Dur. | Tipo | Estado | Registro CMS |
| :--- | :--- | :--- | :-: | :--- | :-: | :--- |
| `kcac_CIFJ7k` | SIG Sauer - Dany Glock (Video Oficial) Prod By. Nick Montana Beatmen | 2024-04-05 | 3:20 | Videoclip oficial (el título lo declara) | ✅ | `videos/sig-sauer-video-oficial` |
| `SKgil-Dd1_M` | SIG Sauer - Dany Glock (Trailer Oficial) | 2024-02-27 | 0:24 | Trailer (el título lo declara) | ✅ | `videos/sig-sauer-trailer-oficial` |
| `N3REsYJtfn4` | Dany Glock - SIG SAUER (Remix) TRAILER OFICIAL | 2024-11-17 | 0:35 | Trailer (el título lo declara) | ✅ | `videos/sig-sauer-remix-trailer-oficial` |
| `4BzpqeraFjc` | Dany Glock, Brak Johnz, Dollaro, TVZ, Selene Psycho, Darev, Loneliness - Sig Sauer REMIX | 2024-12-26 | 7:07 | Publicación del canal (tipo por confirmar) | ✅ existencia y fecha · 🟡 tipo | `videos/sig-sauer-remix` |
| `hvoy-jQNUnc` | SO FRESH, SO CLEAN — Dany Glock — Prod By. Nick Montana Beatmen | 2025-07-22 | 2:53 | Publicación del canal (tipo por confirmar) | ✅ existencia y fecha · 🟡 tipo | `videos/so-fresh-so-clean` |
| `DuU5yoDscxs` | CICATRICES - DANY GLOCK (PROD NICK MONTANA x DARK PRO) | 2026-07-25 | 3:53 | Publicación del canal (tipo por confirmar) | ✅ existencia y fecha · 🟡 tipo | `videos/cicatrices` |

Canal: https://www.youtube.com/@danyglock · ID `UCf-4AJMV8QZz1jj4OVBzaxg` (✅). Existe además el canal automático «Dany Glock - Topic» (`UCw7YN5aQqOtCogd5MyuatEQ`) generado por YouTube Music: **no se usa** como canal oficial.
Miniaturas: URL pública estándar `i.ytimg.com/vi/<ID>/hqdefault.jpg` (se referencia, no se descarga).

## 3. Biografía, redes y reconocimientos

| Dato | Fuente | Estado | Registro CMS |
| :--- | :--- | :-: | :--- |
| Género según plataformas: *Urbano latino* / *Hip-Hop/Rap* | iTunes Lookup | ✅ | texto de biografía |
| Instagram `@danyglock_` | URL del cliente + página pública | ✅ | `site-settings.socialLinks.instagram` |
| YouTube `@danyglock` | canal / páginas `watch` | ✅ | `site-settings.socialLinks.youtube` + `youtubeChannelId` |
| Apple Music artist `1739565666` | iTunes Lookup | ✅ | `site-settings.socialLinks.appleMusic` |
| TikTok, X, Spotify, Facebook | sin verificación inequívoca | 🟡 | vacíos |
| Biografía corta/mediana ES+EN | Redactada **solo con hechos de §0–§2** | 📝 | `artist-profile` (`bioStatus = editorial_draft`, `translation.enStatus = draft_pending_review`) |
| «Artista del Año 2024 y 2025» (Diario EXTRA, 2026-10-15) | Solo la *descripción* OG es accesible; cuerpo no recuperable; entidad otorgante desconocida | 🟡 | **No sembrado** |
| Escenarios compartidos (Ñejo, Jory, Luigi 21 Plus, Magnate, Pirlo, De La Ghetto, Master Boy, Jhonny Rivera) | Resumen del Brain (EXTRA); *compartir tarima ≠ colaboración* | 🟡 | **No sembrado** |
| Documental «Creación de un ídolo» | Resultado de búsqueda sin URL verificable | 🟡 | **No sembrado** |
| Manifiesto del artista y biografía larga | Requieren aprobación del artista | 🟡 | vacíos (no se redactan como declaraciones suyas) |
| Correos de booking/prensa/management | No publicados en fuentes | 🟡 | vacíos; la web no muestra correos inventados |

## 4. Shows

| Evento | Evidencia | Estado | Registro CMS |
| :--- | :--- | :-: | :--- |
| «Pasto Vive Flow» — 2026-08-01 — Centro de Eventos Andino, Pasto | Mención en un resumen de búsqueda (cita una publicación de Instagram no accesible directamente) | 🟡 | `events/pasto-vive-flow-2026` — **borrador**, no publicado; participación del artista por confirmar |
| Shows anteriores (lista exacta) | Sin fuente verificable | 🟡 | **No sembrados** |
| Próximos shows | Ninguno anunciado en fuentes accesibles | — | Estado vacío en Home |

## 5. Inventario de recursos gráficos a solicitar al artista

| Recurso | Uso | Dimensión sugerida | Proporción | Estado |
| :--- | :--- | :--- | :-: | :-: |
| Portadas oficiales (4 releases + remix) | Releases, Home | 3000×3000 px, JPG/PNG sRGB | 1:1 | Pendiente |
| Foto hero (retrato/cinemática) | Hero Home | 3200×2133 px (mín. 2400×1600) | 3:2 y 4:5 móvil | Pendiente |
| Fotos de prensa (3–6), horizontales y verticales | EPK / Bio | 3000 px lado largo | 3:2 / 4:5 | Pendiente |
| Logo / wordmark oficial (SVG) | Header / Footer | vectorial | libre | Pendiente |
| Miniaturas personalizadas de video (opcional) | Videos | 1920×1080 px | 16:9 | Opcional |
| Galería de shows (con permiso del fotógrafo) | Eventos | 2000 px lado largo | 3:2 / 4:5 | Pendiente |
| Póster de eventos | Shows | 1080×1350 px | 4:5 | Cuando existan |
| Open Graph por defecto | SEO / redes | 1200×630 px | 1.91:1 | Pendiente |
| Biografía aprobada + manifiesto (ES/EN) | Bio | texto | — | Pendiente |
| Contactos de booking / prensa / management | Footer / Contacto | — | — | Pendiente |
| Ficha técnica por canción (ISRC, UPC, compositores, mezcla, mastering) | Releases / Tracks | — | — | Pendiente |
| URL del perfil de Spotify del artista | Embeds / CTAs | — | — | Pendiente |
