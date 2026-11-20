import React from 'react';
import Image from 'next/image';
import type { Media } from '@/payload-types';

export interface ShowGalleryProps {
  items: Media[];
}

/**
 * Archivo visual de presentaciones: flyers históricos y fotografías en vivo.
 * Los flyers se muestran completos (object-contain) para no recortar su información;
 * solo se rotulan los datos transcritos tal como aparecen en la pieza.
 */
export const ShowGallery: React.FC<ShowGalleryProps> = ({ items }) => {
  const visible = items.filter((m) => Boolean(m.url));
  if (visible.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Archivo visual de presentaciones">
      {visible.map((item) => {
        const isFlyer = item.category === 'event_flyer';
        const caption = [item.gallery?.eventLabel, item.gallery?.dateLabel, item.gallery?.venueLabel]
          .filter(Boolean)
          .join(' · ');

        return (
          <li key={item.id}>
            <figure className="group h-full flex flex-col bg-carbon/40 border border-white/10 hover:border-crimson/40 transition-colors duration-300">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
                <Image
                  src={item.url!}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={
                    isFlyer
                      ? 'object-contain p-2'
                      : 'object-cover group-hover:scale-105 transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:group-hover:scale-100'
                  }
                />
                <span className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-wider bg-ink/90 border border-white/10 text-ash px-2 py-0.5">
                  {isFlyer ? 'Flyer' : 'En vivo'}
                </span>
              </div>
              {(caption || item.credit) && (
                <figcaption className="p-3 space-y-1 flex-1">
                  {caption && <p className="font-sans text-xs text-bone/90 leading-snug">{caption}</p>}
                  {item.credit && <p className="font-mono text-[10px] text-smoke">{item.credit}</p>}
                </figcaption>
              )}
            </figure>
          </li>
        );
      })}
    </ul>
  );
};
