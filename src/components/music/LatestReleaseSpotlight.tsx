import React from 'react';
import type { Release } from '@/payload-types';
import { Button } from '@/components/ui/Button';
import { ReleaseCover } from './ReleaseCover';

export interface LatestReleaseSpotlightProps {
  release: Release;
}

export const LatestReleaseSpotlight: React.FC<LatestReleaseSpotlightProps> = ({ release }) => {
  const isLead = release.artistRole === 'main';
  const releaseYear = release.releaseDate ? new Date(release.releaseDate).getFullYear() : '2026';

  return (
    <section id="lanzamiento" className="relative overflow-hidden px-6 md:px-12 max-w-7xl mx-auto py-20 md:py-28 border-b border-white/10 scroll-mt-24">
      {/* Fondo cinemático ambiental */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-crimson-deep/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Columna Izquierda: Gran Carátula Vinilo 1:1 Editorial */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md sm:max-w-lg">
            <ReleaseCover
              coverImage={release.coverImage}
              title={release.title}
              type={release.type}
              coverStatus={release.coverStatus}
              priority={true}
              catalogNumber={release.catalogNumber}
              releaseYear={releaseYear}
              isLead={isLead}
              size="lg"
            />
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
