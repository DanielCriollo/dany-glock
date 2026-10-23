import React from 'react';
import { Button } from '@/components/ui/Button';
import { getHomePageCmsData } from '@/lib/cms-queries';
import { VideoGallery } from '@/components/video/VideoGallery';
import { ContactForm } from '@/components/contact/ContactForm';
import Link from 'next/link';

export default async function HomePage() {
  const {
    artistProfile,
    siteSettings,
    releases,
    featuredRelease,
    videos,
    events,
    articles,
  } = await getHomePageCmsData();

  const stageName = artistProfile?.stageName || 'DANY GLOCK';
  const tagline = artistProfile?.tagline || 'Artist Digital Experience — Dark Cinematic Editorial';
  const manifesto =
    artistProfile?.manifesto ||
    'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el sur de Colombia y proyectada a la escena global.';
  const city = artistProfile?.origin?.city || 'Pasto';
  const country = artistProfile?.origin?.country || 'Colombia';

  return (
    <div className="w-full">
      {/* 1. HERO EDITORIAL CINEMATOGRÁFICO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto py-16 md:py-24 border-b border-white/10 overflow-hidden">
        {/* Fondo atmosférico de textura e iluminación nocturna sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-crimson-deep via-ink to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 space-y-8 max-w-5xl">
          {/* Badge de Estado & Ubicación Verificada */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson-signal animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash">
              {city}, {country} · Plataforma Oficial
            </span>
            <span className="font-mono text-xs text-smoke hidden sm:inline">|</span>
            <span className="font-mono text-xs uppercase tracking-wider text-crimson-text hidden sm:inline">
              Música Urbana & Trap Latino
            </span>
          </div>

          {/* Gran Título Póster Tipográfico */}
          <h1 className="font-sans font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter uppercase text-bone leading-[0.88] select-none">
            {stageName}
          </h1>

          {/* Subtítulo Editorial con Instrument Serif */}
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ash max-w-3xl leading-snug">
            {tagline}
          </p>

          {/* Cita del Manifiesto Artístico */}
          <blockquote className="border-l-2 border-crimson pl-6 py-2 text-ash text-base md:text-lg max-w-2xl font-sans leading-relaxed">
            &ldquo;{manifesto}&rdquo;
          </blockquote>

          {/* Spotlight del Lanzamiento Destacado */}
          {featuredRelease && (
            <div className="p-4 md:p-6 bg-carbon/50 border border-white/10 max-w-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-crimson-text block">
                  Lanzamiento Oficial Destacado
                </span>
                <p className="font-sans font-bold text-lg text-bone">
                  {featuredRelease.title}
                </p>
                <p className="font-mono text-xs text-smoke">
                  {featuredRelease.artistRole === 'featured'
                    ? 'Participación como Artista Invitado'
                    : 'Single Oficial'}
                  {featuredRelease.releaseDate
                    ? ` · ${new Date(featuredRelease.releaseDate).getFullYear()}`
                    : ''}
                </p>
              </div>

              <Button variant="secondary" href="#musica" className="self-start sm:self-auto text-xs py-2 px-4">
                Escuchar Single →
              </Button>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button variant="primary" href="#musica">
              Explorar Discografía ↓
            </Button>
            <Button variant="secondary" href="#videos">
              Videografía Oficial
            </Button>
            <Button variant="ghost" href="#contacto">
              Contacto & Booking →
            </Button>
          </div>
        </div>

        {/* Metadato Tipográfico Inferior del Hero */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-smoke">
          <div>SOUND DESIGN · VISUAL IDENTITY · STAGE EXPERIENCE</div>
          <div className="text-ash tracking-widest uppercase">DISCOGRAFÍA OFICIAL · 2024–2026</div>
        </div>
      </section>

      {/* 2. SECCIÓN MÚSICA & DISCOGRAFÍA (ANCLA #musica) */}
      <section id="musica" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              01 / Discografía
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              MÚSICA & RELEASES
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Catálogo oficial de lanzamientos en plataformas de streaming.
          </p>
        </div>

        {/* Cuadrícula de Lanzamientos Oficiales */}
        {releases && releases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {releases.map((release) => {
              const isLead = release.artistRole === 'main';
              const isPendingCover = release.coverStatus === 'pending' || release.coverStatus === 'placeholder';

              return (
                <article
                  key={release.id}
                  className="group bg-carbon/40 border border-white/10 hover:border-crimson/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Carátula / Arte Editorial de Portada */}
                  <div className="relative aspect-square w-full bg-gradient-to-br from-carbon via-ink to-graphite p-6 flex flex-col justify-between border-b border-white/5 overflow-hidden">
                    {/* Anillos concéntricos de vinilo cinemático */}
                    <div
                      className="absolute inset-4 rounded-full border border-white/5 opacity-40 pointer-events-none group-hover:scale-105 transition-transform duration-700"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-12 rounded-full border border-white/5 opacity-30 pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Encabezado del Arte */}
                    <div className="relative z-10 flex items-start justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider bg-black/60 border border-white/10 px-2 py-0.5 text-ash">
                        {release.type === 'single' ? 'Single' : release.type === 'ep' ? 'EP' : 'Álbum'}
                      </span>

                      <span
                        className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                          isLead
                            ? 'bg-white/5 border-white/10 text-bone'
                            : 'bg-crimson/20 border-crimson text-crimson-text'
                        }`}
                      >
                        {isLead ? 'Artista Principal' : 'Artista Invitado'}
                      </span>
                    </div>

                    {/* Centro Editorial del Vinilo */}
                    <div className="relative z-10 text-center my-auto py-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-smoke block mb-1">
                        DANY GLOCK
                      </span>
                      <h3 className="font-sans font-black text-2xl text-bone tracking-tighter uppercase line-clamp-2">
                        {release.title}
                      </h3>
                      {isPendingCover && (
                        <span className="inline-block mt-2 font-mono text-[8px] uppercase tracking-widest text-smoke bg-black/40 px-2 py-0.5">
                          Arte Oficial en Sincronización
                        </span>
                      )}
                    </div>

                    {/* Código de Catálogo / Metadato */}
                    <div className="relative z-10 flex items-end justify-between font-mono text-[10px] text-smoke pt-2">
                      <span>{release.catalogNumber || 'DG-DSP'}</span>
                      <span>
                        {release.releaseDate ? new Date(release.releaseDate).getFullYear() : '2026'}
                      </span>
                    </div>
                  </div>

                  {/* Ficha Editorial y Enlaces de Streaming */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-sans font-bold text-lg text-bone group-hover:text-crimson-text transition-colors">
                        {release.title}
                      </h4>
                      {release.description && (
                        <p className="font-sans text-xs text-ash mt-1 line-clamp-2 leading-relaxed">
                          {release.description}
                        </p>
                      )}
                    </div>

                    {/* Enlaces de Plataformas Oficiales */}
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-smoke block">
                        Escuchar en Plataformas
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs font-mono">
                        {release.streamingLinks?.appleMusic && (
                          <a
                            href={release.streamingLinks.appleMusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-bone transition-colors"
                          >
                            <span>Apple Music</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {release.streamingLinks?.youtube && (
                          <a
                            href={release.streamingLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-bone transition-colors"
                          >
                            <span>YouTube</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {release.streamingLinks?.amazonMusic && (
                          <a
                            href={release.streamingLinks.amazonMusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-bone transition-colors"
                          >
                            <span>Amazon</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-12 border border-white/10 bg-carbon/30 text-center">
            <p className="font-serif italic text-lg text-ash">
              Discografía en proceso de sincronización digital.
            </p>
          </div>
        )}
      </section>

      {/* 3. SECCIÓN VIDEOGRAFÍA OFICIAL (ANCLA #videos) */}
      <section id="videos" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              02 / Audiovisual
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              VIDEOGRAFÍA OFICIAL
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Dirección de arte cinematográfica, videoclips y directos visuales.
          </p>
        </div>

        {/* Galería de Videos Conectada a YouTube */}
        <VideoGallery videos={videos} />
      </section>

      {/* 4. SECCIÓN TOUR & PRESENTACIONES (ANCLA #tour) */}
      <section id="tour" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              03 / En Vivo
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              TOUR & PRESENTACIONES
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Fechas confirmadas, festivales y apariciones públicas.
          </p>
        </div>

        {events && events.length > 0 ? (
          <div className="border border-white/10 divide-y divide-white/10 bg-carbon/30">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-xs text-crimson-text uppercase">
                    {event.date
                      ? new Date(event.date).toLocaleDateString('es-CO', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Fecha oficial'}
                  </span>
                  <div>
                    <h3 className="font-sans font-bold text-xl text-bone">{event.eventName}</h3>
                    <p className="text-xs font-mono text-ash mt-1">
                      {event.venue} — {event.city}, {event.country}
                    </p>
                  </div>
                </div>
                {event.ticketUrl ? (
                  <Button variant="primary" href={event.ticketUrl}>
                    Entradas Disponibles ↗
                  </Button>
                ) : (
                  <Button variant="ghost" href="#contacto">
                    Más Información →
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vacío Editorial Atractivo y Real (Sin giras ficticias) */
          <div className="p-8 md:p-12 bg-carbon/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="font-mono text-xs uppercase tracking-widest text-ash">
                Temporada en Programación
              </span>
              <h3 className="font-sans font-bold text-2xl md:text-3xl text-bone">
                Nuevas Presentaciones en Vivo por Anunciar
              </h3>
              <p className="font-sans text-sm text-ash leading-relaxed">
                El calendario de shows y apariciones en festivales para la temporada 2026 se publicará de manera oficial tras la confirmación de cartel y boletería. Para contrataciones exclusivas, comunícate con el equipo de booking.
              </p>
            </div>
            <Button variant="secondary" href="#contacto">
              Solicitar Fecha para Evento →
            </Button>
          </div>
        )}
      </section>

      {/* 5. SECCIÓN JOURNAL & COMUNICADOS (ANCLA #journal) */}
      <section id="journal" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              04 / Editorial
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              JOURNAL & COMUNICADOS
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Notas de prensa, reflexiones de estudio y comunicados oficiales.
          </p>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="p-8 bg-carbon/30 border border-white/10 space-y-4">
                <span className="font-mono text-xs text-smoke">
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Comunicado'}
                </span>
                <h3 className="font-sans font-bold text-xl text-bone">{article.title}</h3>
                <p className="text-sm text-ash leading-relaxed">{article.excerpt}</p>
              </article>
            ))}
          </div>
        ) : (
          /* Estado Vacío Editorial Coherente (Sin noticias inventadas) */
          <div className="p-8 md:p-12 bg-carbon/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="font-mono text-xs uppercase tracking-widest text-ash">
                Archivo Editorial
              </span>
              <h3 className="font-sans font-bold text-2xl md:text-3xl text-bone">
                Comunicados Oficiales en Preparación
              </h3>
              <p className="font-sans text-sm text-ash leading-relaxed">
                Las declaraciones de prensa, notas de producción y comunicados editoriales se incorporarán a esta sección conforme se liberen nuevas piezas artísticas.
              </p>
            </div>
            <Link
              href="#press-kit"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bone hover:text-crimson-text transition-colors"
            >
              Consultar Acreditación de Prensa →
            </Link>
          </div>
        )}
      </section>

      {/* 6. SECCIÓN PRESS KIT & CONTACTO (ANCLAS #press-kit y #contacto) */}
      <section id="press-kit" className="px-6 md:px-12 max-w-7xl mx-auto py-24 scroll-mt-24">
        <div id="contacto" className="scroll-mt-24">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              05 / Prensa & Booking
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone mb-4">
              CANAL OFICIAL DE CONTACTO
            </h2>
            <p className="font-serif italic text-ash text-lg md:text-xl max-w-2xl">
              Gestión directa de contrataciones, acreditación de medios y acceso a material para prensa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna Izquierda: Información Editorial y Redes */}
            <div className="lg:col-span-5 space-y-6">
              {/* Tarjeta EPK */}
              <div className="p-8 bg-graphite border border-white/10 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-ash block">
                  Material para Medios
                </span>
                <h3 className="font-sans font-bold text-2xl text-bone">
                  Electronic Press Kit (EPK)
                </h3>
                <p className="font-sans text-sm text-ash leading-relaxed">
                  Dossier biográfico oficial, fotografías de prensa y fichas técnicas disponibles bajo solicitud formal para promotores, medios y curadores acreditados.
                </p>
                <div className="pt-2">
                  <span className="inline-block font-mono text-xs text-smoke bg-white/5 border border-white/10 px-3 py-1">
                    Disponible vía Solicitud Directa
                  </span>
                </div>
              </div>

              {/* Tarjeta de Canales Verificados */}
              <div className="p-8 bg-carbon/50 border border-white/10 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-ash block">
                  Presencia Verificada
                </span>
                <h4 className="font-sans font-bold text-lg text-bone">
                  Ecosistema Digital Oficial
                </h4>
                <div className="space-y-3 font-mono text-xs text-ash">
                  {siteSettings?.socialLinks?.youtube && (
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span>YouTube</span>
                      <a
                        href={siteSettings.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-crimson-text hover:underline"
                      >
                        @danyglock ↗
                      </a>
                    </div>
                  )}
                  {siteSettings?.socialLinks?.instagram && (
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span>Instagram</span>
                      <a
                        href={siteSettings.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-crimson-text hover:underline"
                      >
                        @danyglock_ ↗
                      </a>
                    </div>
                  )}
                  {siteSettings?.socialLinks?.appleMusic && (
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span>Apple Music</span>
                      <a
                        href={siteSettings.socialLinks.appleMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-crimson-text hover:underline"
                      >
                        Perfil Oficial ↗
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span>Origen</span>
                    <span className="text-bone">{city}, {country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Contacto Funcional */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
