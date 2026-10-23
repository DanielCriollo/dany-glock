'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { Media } from '@/payload-types';

export interface HeroMediaProps {
  desktopMedia?: Media | number | null;
  mobileMedia?: Media | number | null;
  videoUrl?: string | null;
  stageName: string;
  city: string;
}

export const HeroMedia: React.FC<HeroMediaProps> = ({
  desktopMedia,
  mobileMedia,
  videoUrl,
  stageName,
  city,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to extract Media object if populated
  const desktopObj = desktopMedia && typeof desktopMedia === 'object' && 'url' in desktopMedia ? desktopMedia : null;
  const mobileObj = mobileMedia && typeof mobileMedia === 'object' && 'url' in mobileMedia ? mobileMedia : null;

  // Determine fallback image for poster
  const posterUrl = desktopObj?.url || mobileObj?.url || undefined;

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const hasDirectVideo = Boolean(
    videoUrl &&
    (videoUrl.endsWith('.mp4') ||
      videoUrl.endsWith('.webm') ||
      videoUrl.endsWith('.ogg') ||
      videoUrl.includes('storage') ||
      videoUrl.includes('/media/'))
  );

  const hasImages = Boolean(desktopObj?.url || mobileObj?.url);

  return (
    <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/5] w-full bg-gradient-to-br from-carbon via-ink to-graphite border border-white/15 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl group rounded-none select-none">
      {/* 1. Fondo de Video (Direct Video MP4/WebM) */}
      {hasDirectVideo && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl!}
            poster={posterUrl}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="w-full h-full object-cover opacity-60 transition-opacity duration-700"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* 2. Fondo de Imágenes Responsivas (Desktop 16:9 / Mobile 9:16) */}
      {!hasDirectVideo && hasImages && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Imagen Móvil (< md) */}
          {mobileObj?.url && (
            <div className="block md:hidden absolute inset-0">
              <Image
                src={mobileObj.url}
                alt={mobileObj.alt || `Visual de ${stageName}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          )}

          {/* Imagen Desktop (>= md) */}
          {desktopObj?.url ? (
            <div className={`${mobileObj?.url ? 'hidden md:block' : 'block'} absolute inset-0`}>
              <Image
                src={desktopObj.url}
                alt={desktopObj.alt || `Visual oficial de ${stageName}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
            </div>
          ) : mobileObj?.url ? (
            /* Fallback desktop usando imagen móvil si no hay desktop específica */
            <div className="hidden md:block absolute inset-0">
              <Image
                src={mobileObj.url}
                alt={mobileObj.alt || `Visual de ${stageName}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
            </div>
          ) : null}

          {/* Viñeta cinematográfica para contraste con tipografía */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/70 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(10,10,12,0.8)_100%)] pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* 3. Canvas Cinemático Fallback Elegante (Cuando no hay imagen ni video cargado) */}
      {!hasDirectVideo && !hasImages && (
        <>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-crimson-deep/20 via-transparent to-transparent opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-700"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40"
            aria-hidden="true"
          />
        </>
      )}

      {/* Marcas técnicas y encuadre editorial superior */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-smoke">
        <span className="inline-flex items-center gap-1.5 bg-black/60 px-2 py-0.5 border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" aria-hidden="true" />
          {hasDirectVideo ? 'VIDEO LOOP' : hasImages ? 'VISUAL OFICIAL' : 'CANVAS CINEMÁTICO'}
        </span>
        <span className="bg-black/60 px-2 py-0.5 border border-white/5">
          ORIGIN: {city.toUpperCase()}
        </span>
      </div>

      {/* Monograma y presencia artística central */}
      <div className="relative z-10 text-center my-auto py-6 space-y-2">
        <span className="font-sans font-black text-7xl sm:text-8xl tracking-tighter text-bone/25 select-none block drop-shadow-lg">
          DG
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash block">
          {stageName}
        </span>
        <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-smoke bg-black/70 px-2.5 py-1 border border-white/10 backdrop-blur-sm">
          {hasDirectVideo
            ? 'Ambientación Visual'
            : hasImages
            ? 'Material Fotográfico Oficial'
            : 'Presencia Visual Oficial'}
        </span>
      </div>

      {/* Metadatos y control de video inferior */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-smoke border-t border-white/10 pt-3">
        <span className="bg-black/60 px-2 py-0.5 border border-white/5">
          SONIDO & IMAGEN
        </span>

        {/* Botón accesible de pausar/reanudar video */}
        {hasDirectVideo ? (
          <button
            type="button"
            onClick={togglePlay}
            aria-pressed={!isPlaying}
            aria-label={isPlaying ? 'Pausar video de fondo' : 'Reanudar video de fondo'}
            className="inline-flex items-center gap-1.5 bg-black/70 hover:bg-carbon px-2.5 py-1 border border-white/20 text-bone hover:border-crimson text-[10px] uppercase tracking-wider transition-colors min-h-[32px] cursor-pointer"
          >
            <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
            <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
          </button>
        ) : (
          <span className="bg-black/60 px-2 py-0.5 border border-white/5">
            2024–2026
          </span>
        )}
      </div>
    </div>
  );
};
