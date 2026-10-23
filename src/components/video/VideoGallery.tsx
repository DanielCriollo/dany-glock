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

  const getTypeLabel = (type: Video['type']) => {
    switch (type) {
      case 'official_music_video':
        return 'Videoclip Oficial';
      case 'trailer':
        return 'Trailer Oficial';
      case 'visualizer':
        return 'Visualizer Oficial';
      case 'live_session':
        return 'Sesión en Vivo';
      case 'behind_the_scenes':
        return 'Detrás de Escenas';
      default:
        return 'Video Oficial';
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const ytId = video.youtubeId;
          const thumbnailUrl = ytId
            ? getYouTubeThumbnailUrl(ytId)
            : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';

          return (
            <article
              key={video.id}
              className="group relative bg-carbon/40 border border-white/10 hover:border-crimson/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Contenedor de Miniatura */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailUrl ?? undefined}
                  alt={`Miniatura del video: ${video.title}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />

                {/* Overlay degradado cinemático */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

                {/* Badge de tipo de video */}
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider bg-ink/90 border border-white/10 text-ash px-2 py-0.5 backdrop-blur-sm">
                    {getTypeLabel(video.type)}
                  </span>
                </div>

                {/* Duración */}
                {video.duration && (
                  <div className="absolute bottom-3 right-3">
                    <span className="font-mono text-[10px] bg-black/80 text-bone px-1.5 py-0.5 border border-white/10">
                      {video.duration}
                    </span>
                  </div>
                )}

                {/* Botón de Reproducción Cinemático */}
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  aria-label={`Reproducir video: ${video.title}`}
                  className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson cursor-pointer"
                >
                  <span className="w-14 h-14 rounded-full bg-ink/80 border border-white/20 group-hover:border-crimson group-hover:bg-crimson/90 group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-2xl">
                    <svg
                      className="w-5 h-5 text-bone translate-x-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Contenido Editorial del Video */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-sans font-bold text-lg text-bone group-hover:text-crimson-text transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="font-sans text-xs text-ash mt-2 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[11px] text-smoke">
                  <span>
                    {video.releaseDate
                      ? new Date(video.releaseDate).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                        })
                      : 'Fecha oficial'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    className="text-crimson-text hover:text-bone hover:underline transition-colors cursor-pointer"
                  >
                    Ver Producción ↗
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal de Reproducción Nativo Privacy-Enhanced */}
      <dialog
        ref={dialogRef}
        onCancel={handleCancel}
        className={`fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-black/95 backdrop-blur-2xl z-[9999] border-none text-bone overflow-y-auto ${
          activeVideo ? 'flex flex-col items-center justify-center p-4 md:p-12' : 'hidden'
        }`}
        aria-label={activeVideo ? `Reproductor de video: ${activeVideo.title}` : 'Reproductor de video'}
      >
        <div className="w-full max-w-5xl flex flex-col gap-4">
          {/* Barra Superior del Modal */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-crimson-text">
                {activeVideo && getTypeLabel(activeVideo.type)}
              </span>
              <h2 className="font-sans font-bold text-lg md:text-xl text-bone line-clamp-1">
                {activeVideo?.title}
              </h2>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-carbon hover:bg-ink hover:border-crimson text-bone font-mono text-xs uppercase tracking-wider transition-colors min-h-[44px] cursor-pointer"
              aria-label="Cerrar reproductor de video"
            >
              <span>Cerrar</span>
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          {/* Embed de YouTube Privacy-Enhanced */}
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

          {/* Ficha Inferior del Video */}
          {activeVideo?.description && (
            <p className="font-sans text-xs text-ash leading-relaxed max-w-3xl pt-2">
              {activeVideo.description}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
};
