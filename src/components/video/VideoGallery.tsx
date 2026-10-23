'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Video } from '@/payload-types';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/content-utils';

export interface VideoGalleryProps {
  videos: Video[];
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeVideo) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  const handleClose = () => {
    setActiveVideo(null);
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    handleClose();
  };

  const getTypeLabel = (type: Video['type'] | undefined) => {
    switch (type) {
      case 'official_music_video':
        return 'Videoclip Oficial';
      case 'trailer':
        return 'Tráiler Oficial';
      case 'visualizer':
        return 'Visualizer Oficial';
      case 'live_session':
        return 'Sesión en Vivo';
      case 'behind_the_scenes':
        return 'Detrás de Escenas';
      default:
        return 'Producción Audiovisual';
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="p-12 border border-white/10 bg-carbon/30 text-center">
        <p className="font-serif italic text-lg text-ash">
          No hay producciones audiovisuales publicadas en este momento.
        </p>
      </div>
    );
  }

  const [leadVideo, ...otherVideos] = videos;

  return (
    <div className="space-y-8">
      {/* 1. Video Principal / Spotlight */}
      {leadVideo && (
        <article className="group relative bg-carbon/50 border border-white/15 hover:border-crimson/50 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl">
          <div className="relative aspect-video lg:col-span-8 bg-black overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getYouTubeThumbnailUrl(leadVideo.youtubeId) ?? undefined}
              alt={`Miniatura del video: ${leadVideo.title}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider bg-crimson text-bone px-2.5 py-1 font-semibold">
                Destacado
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider bg-ink/90 border border-white/10 text-ash px-2 py-0.5 backdrop-blur-sm">
                {getTypeLabel(leadVideo.type)}
              </span>
            </div>

            {leadVideo.duration && (
              <div className="absolute bottom-4 right-4">
                <span className="font-mono text-xs bg-black/85 text-bone px-2 py-1 border border-white/10">
                  {leadVideo.duration}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveVideo(leadVideo)}
              aria-label={`Reproducir video: ${leadVideo.title}`}
              className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson cursor-pointer"
            >
              <span className="w-16 h-16 rounded-full bg-ink/80 border border-white/20 group-hover:border-crimson group-hover:bg-crimson group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(225,36,63,0.3)]">
                <svg className="w-6 h-6 text-bone translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>

          <div className="p-8 lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-crimson-text block">
                Producción Audiovisual Oficial
              </span>
              <h3 className="font-sans font-black text-2xl sm:text-3xl text-bone group-hover:text-crimson-text transition-colors leading-tight">
                {leadVideo.title}
              </h3>
              {leadVideo.description && (
                <p className="font-sans text-sm text-ash leading-relaxed">
                  {leadVideo.description}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono text-xs text-smoke">Canal @danyglock</span>
              <button
                type="button"
                onClick={() => setActiveVideo(leadVideo)}
                className="font-mono text-xs uppercase tracking-wider text-crimson-text hover:text-bone hover:underline cursor-pointer"
              >
                Reproducir Video ↗
              </button>
            </div>
          </div>
        </article>
      )}

      {/* 2. Cuadrícula de Otras Producciones */}
      {otherVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {otherVideos.map((video) => {
            const ytId = video.youtubeId;
            const thumbnailUrl = ytId ? getYouTubeThumbnailUrl(ytId) : null;

            return (
              <article
                key={video.id}
                className="group relative bg-carbon/40 border border-white/10 hover:border-crimson/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl ?? undefined}
                    alt={`Miniatura del video: ${video.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider bg-ink/90 border border-white/10 text-ash px-2 py-0.5 backdrop-blur-sm">
                      {getTypeLabel(video.type)}
                    </span>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3">
                      <span className="font-mono text-[10px] bg-black/80 text-bone px-1.5 py-0.5 border border-white/10">
                        {video.duration}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    aria-label={`Reproducir video: ${video.title}`}
                    className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson cursor-pointer"
                  >
                    <span className="w-12 h-12 rounded-full bg-ink/80 border border-white/20 group-hover:border-crimson group-hover:bg-crimson/90 group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-2xl">
                      <svg className="w-4 h-4 text-bone translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-sans font-bold text-base text-bone group-hover:text-crimson-text transition-colors line-clamp-2">
                      {video.title}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[11px] text-smoke">
                    <span>Oficial YouTube</span>
                    <button
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      className="text-crimson-text hover:text-bone hover:underline cursor-pointer"
                    >
                      Reproducir ↗
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 3. Reproductor Modal Accesible HTML5 Dialog */}
      <dialog
        ref={dialogRef}
        onCancel={handleCancel}
        aria-label="Reproductor de video oficial"
        className={`fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-black/95 backdrop-blur-2xl z-[9999] border-none text-bone overflow-y-auto ${
          activeVideo ? 'flex items-center justify-center p-4 md:p-10' : 'hidden'
        }`}
      >
        <div className="w-full max-w-5xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-crimson-text">
                {getTypeLabel(activeVideo?.type)}
              </span>
              <h2 className="font-sans font-bold text-lg md:text-xl text-bone line-clamp-1">
                {activeVideo?.title}
              </h2>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Cerrar reproductor de video"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-carbon hover:bg-ink hover:border-crimson text-bone font-mono text-xs uppercase tracking-wider transition-colors min-h-[44px] cursor-pointer"
            >
              <span>Cerrar</span>
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="relative aspect-video w-full bg-black border border-white/10 shadow-2xl overflow-hidden">
            {activeVideo?.youtubeId && (
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.youtubeId) ?? undefined}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>

          {activeVideo?.description && (
            <div className="p-4 bg-carbon/50 border border-white/10 text-ash text-xs font-sans leading-relaxed">
              {activeVideo.description}
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};
