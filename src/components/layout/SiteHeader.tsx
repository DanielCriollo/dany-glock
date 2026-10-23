'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EditorialMenu } from './EditorialMenu';

export interface SiteHeaderProps {
  socialLinks?: {
    instagram?: string | null;
    spotify?: string | null;
    youtube?: string | null;
    appleMusic?: string | null;
    tiktok?: string | null;
    twitter?: string | null;
  } | null;
  bookingEmail?: string | null;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ socialLinks, bookingEmail }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-ink/85 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl'
            : 'bg-gradient-to-b from-ink/90 via-ink/40 to-transparent py-6'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Wordmark Tipográfico */}
          <Link
            href="/"
            className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
            aria-label="Dany Glock — Inicio"
          >
            <span className="font-sans font-black text-xl sm:text-2xl tracking-tighter uppercase text-bone group-hover:text-crimson-text transition-colors duration-200">
              DANY GLOCK
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash group-hover:text-bone transition-colors duration-200">
              Sitio Oficial
            </span>
          </Link>

          {/* Navegación Central (Desktop ≥ md) */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8">
            <Link
              href="#musica"
              className="font-sans text-xs uppercase tracking-[0.14em] text-ash hover:text-bone transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              Música
            </Link>
            <Link
              href="#videos"
              className="font-sans text-xs uppercase tracking-[0.14em] text-ash hover:text-bone transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              Videos
            </Link>
            <Link
              href="#biografia"
              className="font-sans text-xs uppercase tracking-[0.14em] text-ash hover:text-bone transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              El Artista
            </Link>
            <Link
              href="#tour"
              className="font-sans text-xs uppercase tracking-[0.14em] text-ash hover:text-bone transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              Shows
            </Link>
            <Link
              href="#contacto"
              className="font-sans text-xs uppercase tracking-[0.14em] text-ash hover:text-bone transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              Contacto
            </Link>
          </nav>

          {/* Acciones Derecha: CTA Booking + Toggle Menú */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#contacto"
              className="hidden sm:inline-flex items-center font-mono text-xs uppercase tracking-[0.16em] text-crimson-text hover:text-bone transition-colors duration-200 min-h-[44px] px-2"
            >
              Booking ↗
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-haspopup="dialog"
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-carbon/60 hover:bg-carbon hover:border-crimson px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Abrir menú editorial"
            >
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" aria-hidden="true" />
              <span>Menú</span>
            </button>
          </div>
        </div>
      </header>

      {/* Menú Editorial Overlay */}
      <EditorialMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        socialLinks={socialLinks}
        bookingEmail={bookingEmail}
      />
    </>
  );
};
