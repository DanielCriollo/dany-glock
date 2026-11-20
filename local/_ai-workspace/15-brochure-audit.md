# 15 — Auditoría Editorial del Brochure Oficial (Misión 006-B.2)

**Fuente:** `local/DANY-GLOCK (2).pdf` — 6 páginas, generado con Gamma («Made with Gamma»), entregado por el equipo del artista. Sin fecha de edición; por su contenido es **anterior a julio de 2026** (no menciona *Cicatrices* ni *EXCESO*) y **posterior al 12-dic-2025** (incluye el flyer de Premios Kiwid Line de esa fecha).
**Auditado:** 2026-10-23. Contrastado con `13-research-inventory.md`, el seed `src/scripts/seed-artist-data.ts` y la BD local.

> **Privacidad:** este documento se versiona en un repositorio **público**. No transcribir aquí correos, teléfonos ni nombres de terceros; consultar el PDF original (no versionado).

> Regla editorial aplicada: el brochure es una **pieza promocional del propio equipo**. Lo que solo aparece ahí se registra como **«Declarado en brochure»** y no se publica como hecho verificado. *Compartir tarima ≠ colaboración musical.*

Leyenda: ✅ Confirmado (fuente primaria o plataforma) · 📣 Declarado solo en brochure · 🟡 Pendiente de validación · 🕰 Histórico · ⚠️ Contradicción

---

## 1. Inventario por página

| Pág. | Contenido | Observaciones |
| :--- | :--- | :--- |
| 1 | Portada: «Dany Glock — El show más encendido del año», párrafo de presentación, «Galardonado como Artista del Año 2024» | Tono publicitario superlativo («promesas más sólidas», «energía arrolladora»). Foto de fondo: fotograma tipo videoclip (1600×902). |
| 2 | «Trayectoria y logros»: Artista del Año 2024 y 2025 (Premios Kiwid Line), «tres discos + remix» (So Fresh, Sig Sauer, Pistolón — colaboración), «Show en la cárcel — mini documental», escenarios compartidos | Llama «colaboraciones» a lo que describe como **compartir tarima**. |
| 3 | El show: duración 30–45 min, DJ set + performance en vivo, público 18–35, reggaetón y trap, interacción, coreografías, bailarines; tipos de evento (discotecas, festivales urbanos, corporativos) | Especificaciones **declaradas**, sin rider técnico. |
| 4 | Collage de 13 flyers de eventos | Legibles; detalle en §4. |
| 5 | «Artista del Año dos años consecutivos», «Junte del año» (Sig Sauer Remix), escenarios compartidos, cita «El artista que encendió la calle» | Repite pág. 2. |
| 6 | Contacto: Pasto–Nariño, management (nombre y rol), correo y WhatsApp de contrataciones, redes (Instagram, TikTok, YouTube, Facebook) | Datos personales de terceros y de contacto: **no publicar sin confirmación**. |

---

## 2. Matriz de contenidos y verificación

| # | Afirmación / dato | Ya en la web | Estado | Evidencia | Decisión |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Origen Pasto, Nariño, Colombia | Sí | ✅ | Inventario §5, brochure p.6 | Sin cambios |
| 2 | Género: reggaetón y trap urbano | Parcial («Trap / Urbano Latino») | 📣 (coherente con catálogo) | Brochure p.3 | Se usa en la ficha del show como dato declarado |
| 3 | «Artista del Año 2024» (p.1) / «2024 y 2025» (p.2, p.5) — Premios Kiwid Line | No | 📣🟡⚠️ | Flyer «Alfombra Roja Edición 2025 — Premios Kiwid Line — Categoría Urbana — Artista o Agrupación del Año — Viernes Dic 12, 2025»; nota de Diario EXTRA (2026-10-15) no recuperable | ⚠️ p.1 dice solo 2024; p.2/5 dicen 2024 y 2025. El flyer anuncia la **gala/categoría**, no prueba el resultado. → `career-highlights` en **borrador** hasta recibir acta/certificado/nota de la organización |
| 4 | «Tres discos + remix oficial: So Fresh, Sig Sauer, Pistolón (colaboración)» | So Fresh y Sig Sauer sí; Pistolón no | ⚠️🟡 | Apple Music confirma SIG Sauer y SO FRESH, SO CLEAN. *Pistolón* no aparece en Apple Music ni en el canal oficial (inventario §1–2) | No se crea release. Pendiente: enlace oficial de *Pistolón*, artista principal y fecha |
| 5 | Catálogo posterior: *Cicatrices* (2026-07-01), *EXCESO* (2026-07-07, invitado) | Sí | ✅ | Apple Music | El brochure está desactualizado; la web es la fuente vigente |
| 6 | «Junte del año» — SIG Sauer Remix con artistas promesa de la ciudad | Remix en borrador; video publicado | ✅ (colaboración y artistas) · 📣 («junte del año») | Video oficial `4BzpqeraFjc`: Brak Johnz, Dollaro, TVZ, Selene Psycho, Darev, Loneliness. Flyer «Lanzamiento Sig Sauer Remix — 22.NOV.24 — Plaza Norte» | Colaboración musical **verificada y publicable**. El título «Junte del año» es declaración del equipo → no se usa como premio |
| 7 | Colaboraciones musicales grabadas: Nick Montana (SO FRESH, Cicatrices, EXCESO), Dark Pro, Maick Records, Sebas BP | Créditos en releases | ✅ | Apple Music / YouTube | `career-highlights` categoría *Colaboración musical*, **publicadas** |
| 8 | «Ha compartido tarima con» Jory (PR), Ryan Castro (CO), Pirlo 420 (CO), Carlos Cortez (EC), Milo Mae (EC), Jhonny Rivera, Mishel Master Boy | No | 📣🟡 | Flyers corroboran en el **cartel** a: Mishel Master Boys («A Toda Madre — Aniversario ATM — Dic 26») y Carlos Cortez & Milo Mae («Sig Sauer Gang — 7 Dic 2024»). Jory, Ryan Castro, Pirlo 420 y Jhonny Rivera sin evidencia | Categoría *Escenario compartido* (≠ colaboración), **borrador**. Publicables tras confirmación por evento |
| 9 | «Show en la cárcel — mini documental de alto impacto social» | No | 📣🟡 | Flyer «Por primera vez en Pasto — Show urbano despedida fin de año — Instituto Nacional Penitenciario y Carcelario INPEC» (sin año legible). Documental sin enlace (inventario: «Creación de un ídolo», sin URL) | `career-highlights` *Impacto social*, **borrador**. Pendiente: año, autorización INPEC para difundir, enlace del documental |
| 10 | Duración del show 30–45 min | No | 📣 | Brochure p.3 | Publicado en `/booking` como **«declarado, sujeto a confirmación»** |
| 11 | Formato DJ set + performance en vivo; bailarines; interacción con el público | No | 📣 | Brochure p.3 | Igual que #10 |
| 12 | Público objetivo 18–35 años | No | 📣 | Brochure p.3 | Igual que #10 |
| 13 | Tipos de evento: discotecas, festivales urbanos, eventos corporativos | No | 📣 | Brochure p.3 | Publicado como oferta de formatos (sin tarifas ni disponibilidad) |
| 14 | Rider técnico completo «disponible bajo solicitud» | No | 🟡 | Brochure p.6 (no se adjunta) | Campo preparado; no se publica rider |
| 15 | Management: persona y rol indicados en brochure p.6 | No | 🟡 (persona real; vigencia y autorización desconocidas) | Brochure p.6 | Se introduce manualmente en el global `booking` (no en el seed); `publishContact = false` hasta autorización; la API pública no lo expone |
| 16 | Correo de contrataciones (brochure p.6) | No | 🟡 | Brochure p.6 | Igual que #15 |
| 17 | WhatsApp de contrataciones (brochure p.6) | No | 🟡 | Brochure p.6 | Igual que #15 |
| 18 | Instagram `@danyglock_` | Sí | ✅ | Inventario | Sin cambios |
| 19 | YouTube `@danyglock` | Sí | ✅ | Canal oficial | Sin cambios |
| 20 | TikTok `tiktok.com/@dany.glock7` | No | 📣🟡 | Brochure p.6 | No sembrado; el admin puede completar `site-settings.socialLinks.tiktok` tras confirmar |
| 21 | Facebook «Dany Glock» (sin URL) | No | 🟡 | Brochure p.6 | Sin URL → no se publica |
| 22 | Cita «El artista que encendió la calle» y textos promocionales («promesa más sólida», «show de primer nivel», «proyección internacional») | No | 📣 | Brochure p.1, p.5 | **No se usan como hechos**. La cita puede usarse como lema de campaña si management la aprueba |
| 23 | «Disponibilidad para presentarse en otras ciudades» | No | 📣 | Brochure p.6 | Publicado como texto de booking, sin fechas |

---

## 3. Fotografías

| Archivo extraído | Resolución | Contenido | Aprovechable | Uso recomendado |
| :--- | :--- | :--- | :--- | :--- |
| p1 fotograma | 1600×902 | Saludo de manos, chaqueta de cuero (estética videoclip) | Media | Fondo secundario; **insuficiente para hero 1920×1080** |
| p3 directo B/N | 1280×854 | En tarima con micrófono, humo, segundo cantante | Sí | Galería «En vivo» / tarjeta de booking |
| p5 directo | 854×1280 | En tarima, camiseta Nike, luces verdes | Sí | Galería «En vivo» (vertical) |
| p6 entrevista | 680×1280 | Entrevista en alfombra con presentadora | Restringido | Aparece una tercera persona → requiere consentimiento; baja resolución |
| p2 franja estudio | 1200×215 | Recorte de entrevista en estudio | No | Demasiado baja y recortada |
| Fondos rojos (p1–p6) | 2400×~2000 | Texturas decorativas de Gamma | No | No son fotografías del artista |

**Conclusión:** el brochure **no contiene fotos de prensa en alta resolución**. Se deben solicitar originales (≥ 3000 px lado largo, sRGB, créditos del fotógrafo) para hero, retrato y EPK.

---

## 4. Flyers y eventos (histórico) 🕰

Resolución de cada flyer: 720–1136 px de ancho × ~1280 px → **válidos para galería de tarjetas**, no como imagen principal. Datos transcritos **solo cuando son legibles**; no se infieren años.

| # | Flyer (texto legible) | Fecha legible | Lugar legible | Nota |
| :--- | :--- | :--- | :--- | :--- |
| F1 | «Dancehall Selekta presenta Dany Glock — DJ Bra / DJ Slow Live Session — Ciju Bless en vivo» | Octubre 31 (sin año) | Pasto, Colombia | |
| F2 | Frili Entertainment — «Dany Glock show en vivo — Alfombra Dance Hall XXX — Amenrap» | Vier Feb 14 (sin año) | — | |
| F3 | «Ghetto Dynasty — Dany Glock Show central ft. Cinco Ribo — Bloodline» | Sábado 6 de abril (sin año) | Teatro San Felipe Neri | |
| F4 | Arte de «SIG Sauer — Prod. by Nick Montana Beatmen» con rótulo «Dany Glock — Artista del año» | — | — | Pieza gráfica, no evento |
| F5 | «Artista invitado Dany Glock — Lanzamiento Cristales Tintiados — Entrada libre» | Sábado 13 abr (sin año) | El Faro | |
| F6 | «Dany Glock — Club Xilón» | Sábado 15 junio (sin año) | Pasto | |
| F7 | «Plaza Norte — Lanzamiento Sig Sauer Remix» (Brak Johnz, Selene Psycho, Tvz, Dollaro, Loneliness, Darev) | **22.NOV.24** | Palermo (dirección en flyer) | Coherente con trailer 2024-11-17 y video 2024-12-26 |
| F8 | «Invitados locales Sig Sauer Gang» (cartel con Carlos Cortez & Milo Mae) | **7 diciembre 2024** | Rey Arlequín (legibilidad media) | Corrobora parcialmente #8 |
| F9 | Beatmen Generations — «Urban Fusion Quest Season #2 — Gran final concurso de baile» | 12 ago (sin año) | Selva Negra, San Felipe | |
| F10 | «Por primera vez en Pasto — Show urbano despedida fin de año» | — | INPEC (Instituto Nacional Penitenciario y Carcelario) | Corrobora parcialmente #9 |
| F11 | Frili — «Amor y Amistad Partyton — Sig Sauer Remix en vivo» | Vie 19 sep (sin año) | Macondo Bar | |
| F12 | «Alfombra Roja Edición 2025 — Premios Kiwid Line — Categoría Urbana — Artista o Agrupación del Año» | **Viernes Dic 12, 2025** | Macondo Bar | Gala de premios; no acredita el resultado |
| F13 | «A Toda Madre — Aniversario ATM — Noche de Perreo Clásico — Mishell Master Boys, special Dany Glock» | Dic 26 viernes (sin año) | Dirección en flyer | Corrobora cartel compartido con Mishell Master Boys |

Los flyers incluyen teléfonos/direcciones de terceros (promotores, venues): uso en la web **sujeto a aprobación de management**, en tamaño de galería.

---

## 5. Contenido que requiere aprobación del equipo

1. Premio «Artista del Año» — años exactos (2024, 2025 o ambos), entidad otorgante y evidencia.
2. *Pistolón* — existencia, artistas y enlace oficial.
3. Lista de escenarios compartidos — evento y fecha de cada uno.
4. Show en el INPEC — año, permiso de difusión y enlace del mini documental.
5. Management y contrataciones — vigencia de la persona indicada en brochure p.6, correo y WhatsApp, y autorización expresa para publicarlos.
6. TikTok y Facebook oficiales (URL exacta).
7. Duración, formato y bailarines del show — confirmar si siguen vigentes.
8. Uso público de flyers (derechos de promotores/diseñadores) y de la foto con presentadora (consentimiento).
9. Fotografías de prensa originales en alta resolución con crédito.

---

## 6. Implementación (arquitectura de contenidos y contratos)

Migración: `src/migrations/20261023_194032_add_brochure_content_structure.ts` (aditiva; incluye snapshot JSON que cubre también la 20261023_180000, que no tenía snapshot). Verificada desde cero (5 migraciones) y sin deriva de esquema.

### 6.1 Colección `career-highlights` (Trayectoria y Reconocimientos) — drafts habilitados
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `title`, `slug` (único) | text | |
| `category` | select | `award` · `milestone` · `collaboration` · `shared_stage` · `social_impact` — *shared_stage ≠ collaboration* |
| `year` / `dateLabel` | number / text | Solo si constan en la fuente |
| `description` | textarea | Sin superlativos no verificables |
| `people[]` | array (`name`, `origin`) | |
| `relatedRelease` | relationship → releases | |
| `externalUrl` | text | |
| `sourceType` | select | `platform` · `press` · `artist_brochure` · `management` |
| `sortOrder` | number | |
| `verification` | grupo compartido | `notes` solo autenticados |

Acceso: lectura pública **solo publicados** (`authenticatedOrPublished`). Render público: registros no verificados muestran la etiqueta de su fuente.

### 6.2 Global `booking` (Shows & Booking)
`showTitle`, `showDescription`, `specsStatus` (`declared` | `confirmed`), `specs{duration, format, genre, audience, includesDancers}`, `liveFeatures[]`, `eventTypes[]{title, description}`, `baseLocation`, `availabilityNote`, `quoteNote`, `technicalRider` (upload), `management{publishContact, name, role, email, whatsapp, confirmedAt, sourceNote}`.
**Contrato de privacidad:** `management.name/role/email/whatsapp/confirmedAt` solo se leen sin sesión si `publishContact = true`; `sourceNote` nunca es público. Cubierto por tests.

### 6.3 Global `press-kit` (EPK)
`isPublic` (default `false` → `/epk` responde 404), `headline`, `intro`, `bioVariant` (`short` | `medium`), `pressPhotos[]` (media), `featuredReleases[]`, `featuredVideos[]` (vacíos = automáticos), `includeShowInfo`, `downloadStatus` (`not_available` | `in_preparation` | `available`), `downloadablePdf` (media). En `/epk` solo aparecen hitos **verificados**.

### 6.4 Colección `media` (ampliada)
Categorías nuevas `event_flyer`, `live_photo`; campos `credit` y grupo `gallery{visible, rightsStatus(pending|approved|third_party_consent), eventLabel, dateLabel, venueLabel, sortOrder}`. La galería pública exige `visible = true` **y** `rightsStatus = approved`.

### 6.5 Consultas (`src/lib/cms-queries.ts`)
`getPublishedCareerHighlightsData()`, `getBookingData()`, `getPressKitData()`, `getShowGalleryData()` — todas con `overrideAccess: false`.

### 6.6 Vistas
- `/biografia`: módulos «04 / Trayectoria y Colaboraciones» (`CareerHighlights`) y «05 / En vivo».
- `/booking` (nueva): ficha del show, tipos de evento, archivo visual (`ShowGallery`), solicitud de cotización (formulario existente), management solo si autorizado.
- `/epk` (nueva, oculta por defecto): biografía, fotos de prensa, música, videoclips, trayectoria verificada, show, descarga futura.
- Home: bloque de shows con formato del espectáculo y enlace a `/booking`; tarjeta EPK enlaza a `/epk` solo si es público.
- Navegación: enlaces `#ancla` → `/#ancla` (funcionan desde subpáginas); «Booking» → `/booking`.

### 6.7 Scripts
- `src/scripts/seed-brochure-content.ts` — **solo crea** (no sobrescribe): 5 hitos verificados publicados + 4 afirmaciones del brochure en borrador; inicializa `booking` y `press-kit` si están vacíos. Sin datos de contacto.
- `src/scripts/import-brochure-assets.ts` — importa 12 flyers + 2 fotos en vivo desde `local/brochure-assets/` (**gitignored**) con `gallery.visible = false` y derechos `pending`. Uso local; en producción los archivos se suben desde el admin tras aprobación.

```bash
node node_modules/.pnpm/tsx@*/node_modules/tsx/dist/cli.mjs src/scripts/seed-brochure-content.ts
node node_modules/.pnpm/tsx@*/node_modules/tsx/dist/cli.mjs src/scripts/import-brochure-assets.ts
```
