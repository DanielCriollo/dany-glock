import React from 'react';
import type { Release } from '@/payload-types';
import { Button } from '@/components/ui/Button';

export interface LatestReleaseSpotlightProps {
  release: Release;
}

export const LatestReleaseSpotlight: React.FC<LatestReleaseSpotlightProps> = ({ release }) => {
  const isLead = release.artistRole === 'main';
  const releaseYear = release.releaseDate ? new Date(release.releaseDate).getFullYear() : '2026';

  return (
    <section id="lanzamiento" className="relative px-6 md:px-12 max-w-7xl mx-auto py-20 md:py-28 border-b border-white/10 scroll-mt-24">
      {/* Fondo cinemático ambiental */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-crimson-deep/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Columna Izquierda: Gran Carátula Vinilo 1:1 Editorial */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative aspect-square w-full max-w-md sm:max-w-lg bg-gradient-to-br from-carbon via-ink to-graphite p-8 flex flex-col justify-between border border-white/15 shadow-2xl overflow-hidden group">
            {/* Anillos concéntricos de vinilo cinemático */}
            <div
              className="absolute inset-4 rounded-full border border-white/10 opacity-60 pointer-events-none group-hover:scale-105 transition-transform duration-700"
              aria-hidden="true"
            />
            <div
              className="absolute inset-12 rounded-full border border-white/10 opacity-40 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-24 rounded-full border border-crimson/20 opacity-50 pointer-events-none"
              aria-hidden="true"
            />

            {/* Cabecera del Arte */}
            <div className="relative z-10 flex items-start justify-between font-mono text-[11px]">
              <span className="uppercase tracking-wider bg-black/70 border border-white/10 px-2.5 py-1 text-ash">
                {release.type === 'single' ? 'Single Oficial' : release.type === 'ep' ? 'EP' : 'Álbum'}
              </span>

              <span
                className={`uppercase tracking-widest px-2.5 py-1 border ${
                  isLead
                    ? 'bg-white/5 border-white/10 text-bone'
                    : 'bg-crimson/20 border-crimson text-crimson-text'
                }`}
              >
                {isLead ? 'Artista Principal' : 'Artista Invitado'}
              </span>
            </div>

            {/* Centro Editorial del Vinilo */}
            <div className="relative z-10 text-center my-auto py-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke block mb-2">
                DANY GLOCK
              </span>
              <h3 className="font-sans font-black text-3xl sm:text-4xl text-bone tracking-tighter uppercase leading-tight line-clamp-2">
                {release.title}
              </h3>
              <span className="inline-block mt-3 font-mono text-[9px] uppercase tracking-widest text-smoke bg-black/60 px-3 py-1 border border-white/5">
                Arte Editorial Oficial
              </span>
            </div>

            {/* Código de Catálogo & Año */}
            <div className="relative z-10 flex items-end justify-between font-mono text-xs text-smoke pt-4 border-t border-white/10">
              <span>{release.catalogNumber || 'DG-DSP-2026'}</span>
              <span>{releaseYear}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Ficha Editorial & Enlaces de Escucha */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text">
                Último Lanzamiento Destacado
              </span>
            </div>

            <h2 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl text-bone tracking-tight uppercase leading-[0.95]">
              {release.title}
            </h2>

            <div className="font-mono text-xs text-ash flex flex-wrap items-center gap-3 pt-1">
              <span>{isLead ? 'Lanzamiento Principal' : 'Participación Especial'}</span>
              <span>·</span>
              <span>Año {releaseYear}</span>
              {release.catalogNumber && (
                <>
                  <span>·</span>
                  <span>Ref: {release.catalogNumber}</span>
                </>
              )}
            </div>
          </div>

          {release.description && (
            <p className="font-sans text-base text-ash/90 leading-relaxed max-w-xl">
              {release.description}
            </p>
          )}

          {/* Enlaces de Streaming Disponibles */}
          <div className="space-y-4 pt-2">
            <span className="font-mono text-xs uppercase tracking-wider text-smoke block">
              Disponible en Plataformas Oficiales
            </span>

            <div className="flex flex-wrap items-center gap-4">
              {release.streamingLinks?.appleMusic && (
                <Button
                  variant="primary"
                  href={release.streamingLinks.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span>Escuchar en Apple Music</span>
                  <span aria-hidden="true">↗</span>
                </Button>
              )}

              {release.streamingLinks?.youtube && (
                <Button
                  variant="secondary"
                  href={release.streamingLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span>Ver en YouTube</span>
                  <span aria-hidden="true">↗</span>
                </Button>
              )}

              {release.streamingLinks?.amazonMusic && (
                <Button
                  variant="ghost"
                  href={release.streamingLinks.amazonMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2 border border-white/10 px-4 py-3"
                >
                  <span>Amazon Music</span>
                  <span aria-hidden="true">↗</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
