import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Media, Release, Video } from '@/payload-types';
import {
  getArtistProfileData,
  getBookingData,
  getPressKitData,
  getPublishedCareerHighlightsData,
  getPublishedReleasesData,
  getPublishedVideosData,
} from '@/lib/cms-queries';
import { CareerHighlights } from '@/components/career/CareerHighlights';
import { ShowBooking } from '@/components/booking/ShowBooking';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Dany Glock — Electronic Press Kit',
  description:
    'Electronic Press Kit oficial de Dany Glock para promotores y medios: biografía, música, videoclips, trayectoria y formato del show.',
};

function asMediaList(value: (number | Media)[] | null | undefined): Media[] {
  return (value ?? []).filter((m): m is Media => typeof m === 'object' && Boolean(m.url));
}

function pickFeatured<T extends { id: number }>(featured: (number | T)[] | null | undefined, fallback: T[]): T[] {
  const chosen = (featured ?? []).filter((v): v is T => typeof v === 'object');
  return chosen.length > 0 ? chosen : fallback;
}

export default async function EpkPage() {
  const pressKit = await getPressKitData();
  if (!pressKit?.isPublic) notFound();

  const [artistProfile, releases, videos, highlights, booking] = await Promise.all([
    getArtistProfileData(),
    getPublishedReleasesData(),
    getPublishedVideosData(),
    getPublishedCareerHighlightsData(),
    getBookingData(),
  ]);

  const stageName = artistProfile?.stageName || 'Dany Glock';
  const bio = pressKit.bioVariant === 'short' ? artistProfile?.shortBio : artistProfile?.mediumBio;
  const photos = asMediaList(pressKit.pressPhotos);
  const epkReleases = pickFeatured<Release>(pressKit.featuredReleases, releases);
  const epkVideos = pickFeatured<Video>(pressKit.featuredVideos, videos.slice(0, 3));
  // En el EPK solo se presentan hitos verificados.
  const verifiedHighlights = highlights.filter((h) => h.verification?.status === 'verified');
  const pdf = typeof pressKit.downloadablePdf === 'object' ? pressKit.downloadablePdf : null;
  const canDownload = pressKit.downloadStatus === 'available' && Boolean(pdf?.url);

  let section = 0;
  const next = () => String(++section).padStart(2, '0');

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      <header className="border-b border-white/10 pb-12 mb-16 space-y-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash block">
          {pressKit.headline || 'Electronic Press Kit'}
        </span>
        <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter uppercase text-bone">
          {stageName}
        </h1>
        {pressKit.intro && (
          <p className="font-serif italic text-xl sm:text-2xl text-ash max-w-3xl leading-snug">{pressKit.intro}</p>
        )}
        <div className="flex flex-wrap gap-4 pt-2">
          {canDownload ? (
            <Button variant="primary" href={pdf!.url!}>
              Descargar EPK (PDF) ↓
            </Button>
          ) : (
            <span className="inline-block font-mono text-xs text-smoke bg-white/5 border border-white/10 px-3 py-2">
              {pressKit.downloadStatus === 'in_preparation'
                ? 'Versión descargable en preparación'
                : 'Versión descargable no disponible'}
            </span>
          )}
          <Button variant="secondary" href="/booking">
            Contratación →
          </Button>
        </div>
      </header>

      {bio && (
        <section aria-labelledby="epk-bio" className="mb-20 space-y-4 max-w-3xl">
          <h2 id="epk-bio" className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
            {next()} / Biografía oficial
          </h2>
          <p className="font-sans text-base md:text-lg text-bone/90 leading-relaxed">{bio}</p>
          <Link href="/biografia" className="font-mono text-xs text-crimson-text hover:underline">
            Biografía completa →
          </Link>
        </section>
      )}

      {photos.length > 0 && (
        <section aria-labelledby="epk-fotos" className="mb-20 space-y-6">
          <h2 id="epk-fotos" className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
            {next()} / Fotografías de prensa
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <li key={photo.id}>
                <figure className="space-y-2">
                  <div className="relative aspect-[4/5] bg-ink border border-white/10 overflow-hidden">
                    <Image src={photo.url!} alt={photo.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <figcaption className="flex justify-between gap-2 font-mono text-[10px] text-smoke">
                    <span>{photo.credit ? `Foto: ${photo.credit}` : 'Crédito pendiente'}</span>
                    <a href={photo.url!} download className="text-crimson-text hover:underline">
                      Descargar
                    </a>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {epkReleases.length > 0 && (
        <section aria-labelledby="epk-musica" className="mb-20 space-y-6">
          <h2 id="epk-musica" className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
            {next()} / Música
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {epkReleases.map((rel) => {
              const url = rel.streamingLinks?.appleMusic || rel.streamingLinks?.youtube;
              return (
                <li key={rel.id} className="p-4 bg-carbon/30 border border-white/10 flex justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-crimson-text uppercase">
                      {rel.artistRole === 'featured' ? 'Artista invitado' : 'Lanzamiento oficial'}
                      {rel.releaseDate ? ` · ${new Date(rel.releaseDate).getFullYear()}` : ''}
                    </span>
                    <p className="font-sans font-bold text-sm text-bone">{rel.title}</p>
                  </div>
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-crimson-text hover:underline self-center">
                      Escuchar ↗<span className="sr-only"> {rel.title} (se abre en una pestaña nueva)</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {epkVideos.length > 0 && (
        <section aria-labelledby="epk-videos" className="mb-20 space-y-6">
          <h2 id="epk-videos" className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
            {next()} / Videoclips
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {epkVideos.map((video) => (
              <li key={video.id}>
                <a
                  href={video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-carbon/30 border border-white/10 hover:border-crimson/40 transition-colors"
                >
                  <div className="relative aspect-video bg-ink overflow-hidden">
                    <Image
                      src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p className="p-3 font-sans text-sm text-bone line-clamp-2">
                    {video.title}
                    <span className="sr-only"> (YouTube, se abre en una pestaña nueva)</span>
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {verifiedHighlights.length > 0 && (
        <div className="mb-20">
          <CareerHighlights highlights={verifiedHighlights} index={next()} />
        </div>
      )}

      {pressKit.includeShowInfo && booking?.showDescription && (
        <section aria-labelledby="epk-show" className="mb-20 space-y-6">
          <h2 id="epk-show" className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text">
            {next()} / El show
          </h2>
          <ShowBooking booking={booking} />
        </section>
      )}
    </div>
  );
}
