'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EditorialMenu } from './EditorialMenu';
import { getDesktopNavItems } from '@/lib/navigation';

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
  showStageHistory?: boolean;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ socialLinks, bookingEmail, showStageHistory = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const desktopItems = getDesktopNavItems(showStageHistory);

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

  // Cerrar el menú móvil/editorial automáticamente ante cualquier cambio de ruta.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isBookingActive = pathname === '/booking';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-ink/85 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl'
            : 'bg-gradient-to-b from-ink/90 via-ink/40 to-transparent py-6'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
          {/* Wordmark Tipográfico */}
          <Link
            href="/"
            className="group flex flex-col shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
            aria-label="Dany Glock — Inicio"
          >
            <span className="font-sans font-black text-xl sm:text-2xl tracking-tighter uppercase text-bone group-hover:text-crimson-text transition-colors duration-200">
              DANY GLOCK
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ash group-hover:text-bone transition-colors duration-200">
              Sitio Oficial
            </span>
          </Link>

          {/* Navegación Central (Desktop ≥ lg para evitar apilamientos en tablet con 6 enlaces) */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-6 xl:gap-7">
            {desktopItems.map((item) => {
              const isCurrent = !item.href.includes('#') && pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`font-sans text-xs uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-200 py-1 border-b ${
                    isCurrent
                      ? 'text-bone border-crimson'
                      : 'text-ash hover:text-bone border-transparent hover:border-crimson'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Acciones Derecha: CTA Booking + Toggle Menú */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link
              href="/booking"
              aria-current={isBookingActive ? 'page' : undefined}
              className={`hidden sm:inline-flex items-center font-mono text-xs uppercase tracking-[0.16em] whitespace-nowrap transition-colors duration-200 min-h-[44px] px-2 ${
                isBookingActive ? 'text-bone underline underline-offset-4 decoration-crimson' : 'text-crimson-text hover:text-bone'
              }`}
            >
              Booking ↗
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-haspopup="dialog"
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-carbon/60 hover:bg-carbon hover:border-crimson px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-bone transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Abrir menú editorial"
            >
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse motion-reduce:animate-none" aria-hidden="true" />
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
        showStageHistory={showStageHistory}
        returnFocusRef={menuButtonRef}
      />
    </>
  );
};
