import React from 'react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const colorTokens = [
    { name: 'Ink', hex: '#0A0A0B', bgClass: 'bg-ink', borderClass: 'border-white/10' },
    { name: 'Graphite', hex: '#141416', bgClass: 'bg-graphite', borderClass: 'border-white/10' },
    { name: 'Carbon', hex: '#1C1C1F', bgClass: 'bg-carbon', borderClass: 'border-white/10' },
    { name: 'Steel', hex: '#2A2A2E', bgClass: 'bg-steel', borderClass: 'border-white/10' },
    { name: 'Bone', hex: '#EDEAE4', bgClass: 'bg-bone', textClass: 'text-ink' },
    { name: 'Ash', hex: '#A8A49E', bgClass: 'bg-ash', textClass: 'text-ink' },
    { name: 'Smoke', hex: '#8A8680', bgClass: 'bg-smoke', textClass: 'text-ink' },
    { name: 'Crimson', hex: '#B3122E', bgClass: 'bg-crimson', textClass: 'text-bone' },
    { name: 'Ember', hex: '#C8A27A', bgClass: 'bg-ember', textClass: 'text-ink' },
  ];

  return (
    <div className="relative min-h-screen px-6 py-12 md:px-12 md:py-20 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header / Environment indicator */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson-signal animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs tracking-wider uppercase text-ash">
            Scaffold Técnico — Misión 003
          </span>
        </div>
        <div className="font-mono text-xs text-smoke">
          Next.js 15.4 · React 19 · TS 5.7 · Tailwind 3.4
        </div>
      </header>

      {/* Main Showcase Section */}
      <section className="my-16 space-y-12">
        <div className="space-y-4">
          <p className="font-serif italic text-2xl md:text-3xl text-ash">
            Dark Cinematic Editorial Architecture
          </p>
          <h1 className="font-sans font-black text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase text-bone">
            DANY GLOCK
          </h1>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-crimson-text">
            Artist Digital Experience · Engineering Foundation
          </p>
        </div>

        {/* Color Tokens Palette */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-smoke">
            Tokens Semánticos de Color
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-3">
            {colorTokens.map((token) => (
              <div
                key={token.name}
                className={`p-3 rounded-none border ${token.borderClass || 'border-transparent'} ${token.bgClass} flex flex-col justify-between h-24`}
              >
                <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${token.textClass || 'text-bone'}`}>
                  {token.name}
                </span>
                <span className={`font-mono text-[11px] ${token.textClass || 'text-ash'}`}>
                  {token.hex}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Component Showcase: Buttons */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-smoke">
            Componentes Primitivos (Scaffold)
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">
              Reproducir Single
            </Button>
            <Button variant="secondary">
              Ver Discografía
            </Button>
            <Button variant="ghost">
              Explorar Fechas →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer / System Status */}
      <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-smoke">
        <p>© {new Date().getFullYear()} Dany Glock. Todos los derechos reservados.</p>
        <p className="text-ash">Listo para integración Payload CMS 3.91.0 en Misión 004</p>
      </footer>
    </div>
  );
}
