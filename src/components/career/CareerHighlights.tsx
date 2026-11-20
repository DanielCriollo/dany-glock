import React from 'react';
import type { CareerHighlight } from '@/payload-types';

type Category = CareerHighlight['category'];

const GROUPS: { key: string; title: string; note?: string; categories: Category[] }[] = [
  { key: 'awards', title: 'Reconocimientos', categories: ['award'] },
  { key: 'milestones', title: 'Trayectoria', categories: ['milestone', 'social_impact'] },
  { key: 'collaborations', title: 'Colaboraciones musicales', categories: ['collaboration'] },
  {
    key: 'shared-stage',
    title: 'Escenarios compartidos',
    note: 'Artistas con los que ha compartido cartel. Compartir escenario no implica una colaboración musical.',
    categories: ['shared_stage'],
  },
];

const SOURCE_LABEL: Record<CareerHighlight['sourceType'], string> = {
  platform: 'Fuente: plataforma oficial',
  press: 'Fuente: prensa',
  artist_brochure: 'Declarado por el equipo del artista',
  management: 'Confirmado por management',
};

function periodLabel(item: CareerHighlight): string | null {
  if (item.dateLabel) return item.dateLabel;
  if (item.year) return String(item.year);
  return null;
}

export interface CareerHighlightsProps {
  highlights: CareerHighlight[];
  /** Número editorial de la sección (p. ej. "04"). */
  index?: string;
}

/**
 * Módulo de trayectoria. Solo recibe registros publicados; los no verificados
 * se rotulan con su fuente para no presentarlos como hechos confirmados.
 */
export const CareerHighlights: React.FC<CareerHighlightsProps> = ({ highlights, index = '04' }) => {
  const groups = GROUPS.map((g) => ({
    ...g,
    items: highlights.filter((h) => g.categories.includes(h.category)),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section aria-labelledby="trayectoria-title" className="space-y-10">
      <h2
        id="trayectoria-title"
        className="font-sans font-bold text-xl uppercase tracking-wider text-crimson-text"
      >
        {index} / Trayectoria y Colaboraciones
      </h2>

      {groups.map((group) => (
        <div key={group.key} className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ash">{group.title}</h3>
            {group.note && <p className="font-sans text-xs text-smoke max-w-md">{group.note}</p>}
          </div>

          <ol className="space-y-3">
            {group.items.map((item) => {
              const period = periodLabel(item);
              const verified = item.verification?.status === 'verified';
              const release = typeof item.relatedRelease === 'object' ? item.relatedRelease : null;
              const link = item.externalUrl || release?.streamingLinks?.appleMusic || release?.streamingLinks?.youtube;

              return (
                <li
                  key={item.id}
                  className="group grid grid-cols-[4.5rem_1fr] gap-4 p-4 bg-carbon/30 border border-white/10 hover:border-crimson/40 transition-colors duration-300"
                >
                  <span className="font-mono text-xs text-crimson-text pt-0.5">{period ?? '—'}</span>
                  <div className="space-y-2 min-w-0">
                    <p className="font-sans font-bold text-sm sm:text-base text-bone">{item.title}</p>
                    {item.description && (
                      <p className="font-sans text-sm text-ash leading-relaxed">{item.description}</p>
                    )}
                    {item.people && item.people.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5" aria-label="Artistas relacionados">
                        {item.people.map((person) => (
                          <li
                            key={person.id ?? person.name}
                            className="font-mono text-[11px] text-bone/90 bg-white/5 border border-white/10 px-2 py-0.5"
                          >
                            {person.name}
                            {person.origin ? <span className="text-smoke"> · {person.origin}</span> : null}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {!verified && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-smoke border border-white/10 px-2 py-0.5">
                          {SOURCE_LABEL[item.sourceType]}
                        </span>
                      )}
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] text-crimson-text hover:underline"
                        >
                          Escuchar / ver fuente ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </section>
  );
};
