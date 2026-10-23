import React from 'react';
import { Button } from '@/components/ui/Button';
import { getBookingData, getHomePageCmsData, getPressKitData } from '@/lib/cms-queries';
import { LatestReleaseSpotlight } from '@/components/music/LatestReleaseSpotlight';
import { ReleaseCover } from '@/components/music/ReleaseCover';
import { HeroMedia } from '@/components/hero/HeroMedia';
import { ArtistPortrait } from '@/components/artist/ArtistPortrait';
import { VideoGallery } from '@/components/video/VideoGallery';
import { ContactForm } from '@/components/contact/ContactForm';

export default async function HomePage() {
  const {
    artistProfile,
    siteSettings,
    releases,
    featuredRelease,
    videos,
    events,
  } = await getHomePageCmsData();
  const [booking, pressKit] = await Promise.all([getBookingData(), getPressKitData()]);
  const showSpecs = [booking?.specs?.format, booking?.specs?.duration, booking?.specs?.genre].filter(Boolean);

  const stageName = artistProfile?.stageName || 'Dany Glock';
  const tagline =
    artistProfile?.tagline ||
    'Música urbana, trap latino y estética nocturna desde Pasto, Colombia.';
  const shortBio =
    artistProfile?.shortBio ||
    'Dany Glock es un artista de música urbana y trap originario de Pasto, Nariño, Colombia. Su propuesta combina líricas introspectivas, identidad andina contemporánea y una producción sonora de alto impacto cinematográfico.';
  const city = artistProfile?.origin?.city || 'Pasto';
  const country = artistProfile?.origin?.country || 'Colombia';
  const heroCtaPrimary = artistProfile?.heroCtaPrimary || 'Explorar Música';
  const heroCtaSecondary = artistProfile?.heroCtaSecondary || 'Videografía Oficial';

  return (
    <div className="w-full">
      {/* ========================================================= */}
      {/* 1. HERO EDITORIAL CINEMATOGRÁFICO                        */}
      {/* ========================================================= */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto py-20 md:py-32 border-b border-white/10 overflow-hidden">
        {/* Atmósfera e iluminación nocturna sutil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-crimson-deep via-ink to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Columna de Texto Tipográfico */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge de Origen y Estatus Verificado */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse" aria-hidden="true" />
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

            {/* Mensaje Editorial Breve en Español */}
            <p className="font-serif italic text-2xl sm:text-3xl text-ash max-w-2xl leading-snug">
              {tagline}
            </p>

            {/* Botones de Acción */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button variant="primary" href="#musica">
                {heroCtaPrimary} ↓
              </Button>
              <Button variant="secondary" href="#videos">
                {heroCtaSecondary} →
              </Button>
              <Button variant="ghost" href="#biografia" className="font-mono text-xs uppercase tracking-wider">
                El Artista ↗
              </Button>
            </div>
          </div>

          {/* Columna Visual Protagonista (HeroMedia Multimedia) */}
          <div className="lg:col-span-5">
            <HeroMedia
              desktopMedia={artistProfile?.heroDesktopMedia}
              mobileMedia={artistProfile?.heroMobileMedia}
              videoUrl={artistProfile?.heroVideoUrl}
              stageName={stageName}
              city={city}
            />
          </div>
        </div>

        {/* Metadato tipográfico inferior */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-smoke">
          <div>PRODUCCIÓN MUSICAL · DIRECCIÓN VISUAL · ESCENA EN VIVO</div>
          <div className="text-ash tracking-widest uppercase">DISCOGRAFÍA OFICIAL · {city.toUpperCase()}, {country.toUpperCase()}</div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. ÚLTIMO LANZAMIENTO (SPOTLIGHT INDEPENDIENTE)            */}
      {/* ========================================================= */}
      {featuredRelease && <LatestReleaseSpotlight release={featuredRelease} />}

      {/* ========================================================= */}
      {/* 3. DISCOGRAFÍA & CATÁLOGO REAL                             */}
      {/* ========================================================= */}
      <section id="musica" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              01 / Catálogo Oficial
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              MÚSICA & DISCOGRAFÍA
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Lanzamientos oficiales en plataformas digitales de streaming.
          </p>
        </div>

        {/* Cuadrícula Asimétrica de Lanzamientos */}
        {releases && releases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {releases.map((release) => {
              const isLead = release.artistRole === 'main';
              const releaseYear = release.releaseDate ? new Date(release.releaseDate).getFullYear() : '2026';

              return (
                <article
                  key={release.id}
                  className="group bg-carbon/40 border border-white/10 hover:border-crimson/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Arte Editorial de Portada Optimizado */}
                  <ReleaseCover
                    coverImage={release.coverImage}
                    title={release.title}
                    type={release.type}
                    coverStatus={release.coverStatus}
                    catalogNumber={release.catalogNumber}
                    releaseYear={releaseYear}
                    isLead={isLead}
                    size="md"
                  />

                  {/* Ficha Editorial & Streaming */}
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

                    {/* Enlaces de Streaming */}
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-smoke block">
                        Plataformas Oficiales
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

      {/* ========================================================= */}
      {/* 4. EL ARTISTA — SECCIÓN EDITORIAL & BIOGRAFÍA              */}
      {/* ========================================================= */}
      <section id="biografia" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Columna Izquierda: Retrato Vertical Editorial (ArtistPortrait) */}
          <div className="lg:col-span-5">
            <ArtistPortrait
              portraitImage={artistProfile?.portraitImage}
              stageName={stageName}
              city={city}
              country={country}
            />
          </div>

          {/* Columna Derecha: Texto Editorial */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block">
                02 / El Artista
              </span>
              <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl text-bone tracking-tight uppercase">
                IDENTIDAD & TRAYECTORIA
              </h2>
            </div>

            <p className="font-sans text-base md:text-lg text-bone/90 leading-relaxed">
              {shortBio}
            </p>

            <p className="font-sans text-sm text-ash leading-relaxed">
              Su propuesta une la contundencia de las líricas urbanas con una cuidada dirección visual y una ambientación sonora nocturna producida en colaboración con Beatmen Generations y Prix Music Group.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button variant="primary" href="/biografia">
                Leer Biografía Completa →
              </Button>
              <Button variant="secondary" href="#contacto">
                Contacto Profesional
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. VIDEOGRAFÍA OFICIAL                                     */}
      {/* ========================================================= */}
      <section id="videos" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              03 / Audiovisual
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              VIDEOGRAFÍA OFICIAL
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Dirección audiovisual cinematográfica, videoclips y directos visuales.
          </p>
        </div>

        {/* Galería de Videos con Jerarquía */}
        <VideoGallery videos={videos} />
      </section>

      {/* ========================================================= */}
      {/* 6. TOUR & SHOWS (PRESENTACIONES EN VIVO)                   */}
      {/* ========================================================= */}
      <section id="tour" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              04 / En Vivo
            </span>
            <h2 className="font-sans font-black text-[2rem] sm:text-6xl tracking-tight uppercase text-bone">
              SHOWS & PRESENTACIONES
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
          /* Estado Vacío Editorial Elegante y Breve */
          <div className="p-8 md:p-12 bg-carbon/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="font-mono text-xs uppercase tracking-widest text-ash">
                Próximas Fechas
              </span>
              <h3 className="font-sans font-bold text-2xl md:text-3xl text-bone">
                Nuevas Presentaciones en Vivo por Anunciar
              </h3>
              <p className="font-sans text-sm text-ash leading-relaxed">
                {booking?.showDescription ||
                  'Las fechas oficiales de conciertos y festivales se publicarán conforme se confirmen los carteles y boleterías.'}
              </p>
              {showSpecs.length > 0 && (
                <p className="font-mono text-xs uppercase tracking-wider text-crimson-text">
                  {showSpecs.join(' · ')}
                </p>
              )}
            </div>
            <Button variant="secondary" href="/booking">
              Shows & Booking →
            </Button>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 7. PRENSA, EPK & CONTACTO (CANAL OFICIAL DIRECTO)          */}
      {/* ========================================================= */}
      <section id="contacto" className="px-6 md:px-12 max-w-7xl mx-auto py-24 scroll-mt-24">
        <div id="press-kit" className="scroll-mt-24">
          <div className="mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              05 / Prensa & Booking
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone mb-4">
              CANAL OFICIAL DE CONTACTO
            </h2>
            <p className="font-serif italic text-ash text-lg md:text-xl max-w-2xl">
              Contratación de shows, acreditación de medios y acceso a material para prensa.
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
                  {pressKit?.isPublic ? (
                    <Button variant="secondary" href="/epk">
                      Ver Press Kit →
                    </Button>
                  ) : (
                    <span className="inline-block font-mono text-xs text-smoke bg-white/5 border border-white/10 px-3 py-1">
                      Disponible vía Solicitud Directa
                    </span>
                  )}
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
