import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  getArtistProfileData,
  getBookingData,
  getPublishedCareerHighlightsData,
  getPublishedReleasesData,
} from '@/lib/cms-queries';
import { Button } from '@/components/ui/Button';
import { ArtistPortrait } from '@/components/artist/ArtistPortrait';
import { CareerHighlights } from '@/components/career/CareerHighlights';

export const metadata: Metadata = {
  title: 'Dany Glock — Biografía y Perfil Artístico Oficial',
  description:
    'Biografía oficial de Dany Glock: artista de música urbana y trap de Pasto, Nariño, Colombia. Historia, visión artística y créditos discográficos.',
};

export default async function BiografiaPage() {
  const [artistProfile, releases, highlights, booking] = await Promise.all([
    getArtistProfileData(),
    getPublishedReleasesData(),
    getPublishedCareerHighlightsData(),
    getBookingData(),
  ]);

  const stageName = artistProfile?.stageName || 'Dany Glock';
  const city = artistProfile?.origin?.city || 'Pasto';
  const country = artistProfile?.origin?.country || 'Colombia';
  const mediumBio =
    artistProfile?.mediumBio ||
    'Originario de Pasto, Nariño, Colombia, Dany Glock ha consolidado una propuesta musical y visual que redefine el sonido urbano en el suroccidente colombiano. Fusionando trap contemporáneo con relatos de calle, elegancia y producción cinematográfica.';
  const shortBio =
    artistProfile?.shortBio ||
    'Dany Glock es un artista de música urbana originario de Pasto, Nariño, Colombia. Su propuesta combina trap contemporáneo, identidad lírica y una estética visual nocturna.';
  const manifesto =
    artistProfile?.manifesto ||
    'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el sur de Colombia y proyectada a la escena global.';
  const isDraft = artistProfile?.bioStatus === 'editorial_draft';

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
      {/* Navegación de Regreso */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ash hover:text-crimson-text transition-colors"
        >
          <span>←</span>
          <span>Volver a la Página Principal</span>
        </Link>
      </div>

      {/* Encabezado Editorial */}
      <header className="border-b border-white/10 pb-12 mb-16 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash">
            {city}, {country} · Perfil Oficial
          </span>
          {isDraft && (
            <span className="font-mono text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 text-smoke px-2 py-0.5">
              Reseña Editorial Verificada
            </span>
          )}
        </div>

        <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter uppercase text-bone">
          {stageName}
        </h1>

        <p className="font-serif italic text-2xl sm:text-3xl text-ash max-w-3xl leading-snug">
          Música urbana, narrativa nocturna e identidad territorial desde el sur de Colombia.
        </p>
      </header>

      {/* Cuerpo de la Biografía */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-20">
        {/* Columna Izquierda: Retrato Oficial (ArtistPortrait) */}
        <div className="md:col-span-5 space-y-6">
          <ArtistPortrait
            portraitImage={artistProfile?.portraitImage}
            stageName={stageName}
            city={city}
            country={country}
            priority={true}
          />

          <div className="p-6 bg-carbon/40 border border-white/10 space-y-3 font-mono text-xs">
            <span className="uppercase text-smoke tracking-wider block text-[10px]">
              Ficha Técnica del Artista
            </span>
            <div className="flex justify-between border-b border-white/5 pb-2 text-ash">
              <span>Género</span>
              <span className="text-bone">Trap / Urbano Latino</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2 text-ash">
              <span>Territorio</span>
              <span className="text-bone">Pasto, Nariño, Colombia</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2 text-ash">
              <span>Sello / Producción</span>
              <span className="text-bone">Beatmen / Diskover / PMG</span>
            </div>
            <div className="flex justify-between pt-1 text-ash">
              <span>Debut Oficial</span>
              <span className="text-bone">2024 (SIG Sauer)</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Texto de Biografía */}
        <div className="md:col-span-7 space-y-8">
          <section className="space-y-4">
            <h2 className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
              01 / Trayectoria y Origen
            </h2>
            <p className="font-sans text-base text-bone/90 leading-relaxed">
              {mediumBio}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
              02 / Visión Artística
            </h2>
            <blockquote className="border-l-2 border-crimson pl-6 py-2 text-ash text-lg font-serif italic leading-relaxed">
              &ldquo;{manifesto}&rdquo;
            </blockquote>
            <p className="font-sans text-sm text-ash leading-relaxed">
              {shortBio}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
              03 / Discografía de Referencia
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {releases.map((rel) => (
                <div key={rel.id} className="p-4 bg-carbon/30 border border-white/10 space-y-1">
                  <span className="font-mono text-[10px] text-crimson-text uppercase">
                    {rel.artistRole === 'featured' ? 'Artista Invitado' : 'Single Oficial'}
                  </span>
                  <p className="font-sans font-bold text-sm text-bone">{rel.title}</p>
                  <p className="font-mono text-[11px] text-smoke">
                    {rel.releaseDate ? new Date(rel.releaseDate).getFullYear() : '2026'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <CareerHighlights highlights={highlights} index="04" />

          {booking?.showDescription && (
            <section aria-labelledby="en-vivo-title" className="space-y-4">
              <h2
                id="en-vivo-title"
                className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text"
              >
                05 / En Vivo
              </h2>
              <p className="font-sans text-base text-bone/90 leading-relaxed">{booking.showDescription}</p>
              <Link href="/booking" className="inline-block font-mono text-xs text-crimson-text hover:underline">
                Formato del show y contrataciones →
              </Link>
            </section>
          )}

          {/* Enlaces y Acciones */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4">
            <Button variant="primary" href="/#musica">
              Escuchar Catálogo Musical →
            </Button>
            <Button variant="secondary" href="/booking">
              Shows & Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
