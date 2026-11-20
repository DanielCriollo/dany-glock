'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavigationItems } from '@/lib/navigation';

export interface EditorialMenuProps {
  isOpen: boolean;
  onClose: () => void;
  socialLinks?: {
    instagram?: string | null;
    spotify?: string | null;
    youtube?: string | null;
    appleMusic?: string | null;
    tiktok?: string | null;
    twitter?: string | null;
  } | null;
  bookingEmail?: string | null;
  /** Muestra «Trayectoria» solo cuando hay eventos anteriores publicados (si no, /escenarios es 404). */
  showStageHistory?: boolean;
  /** Elemento que abrió el menú para devolverle el foco al cerrar. */
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

export function getMenuItems(showStageHistory = false) {
  return getNavigationItems(showStageHistory);
}

export const EditorialMenu: React.FC<EditorialMenuProps> = ({
  isOpen,
  onClose,
  socialLinks,
  bookingEmail,
  showStageHistory = false,
  returnFocusRef,
}) => {
  const menuItems = getMenuItems(showStageHistory);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      wasOpenRef.current = true;
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }

    if (dialog.open) {
      dialog.close();
    }
    document.body.style.overflow = '';
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      returnFocusRef?.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, returnFocusRef]);

  // Manejar el evento nativo de cancelación (tecla ESC en <dialog>)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={`fixed inset-0 m-0 p-0 w-full h-full max-w-none max-h-none bg-ink text-bone border-none backdrop:bg-ink/90 backdrop:backdrop-blur-xl z-[999] overflow-y-auto ${
        isOpen ? 'flex flex-col justify-between' : 'hidden'
      }`}
      aria-label="Menú Editorial de Navegación"
    >
      {/* Barra Superior del Menú */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 md:px-12 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-ash">
            Navegación Editorial
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-crimson" aria-hidden="true" />
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="group relative inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-bone hover:text-crimson-text transition-colors duration-200 cursor-pointer min-h-[44px] min-w-[44px]"
          aria-label="Cerrar menú editorial"
        >
          <span>Cerrar</span>
          <span className="font-sans text-lg leading-none group-hover:rotate-90 transition-transform duration-200 motion-reduce:transition-none" aria-hidden="true">
            ✕
          </span>
        </button>
      </div>

      {/* Lista Principal de Enlaces Tipográficos */}
      <nav aria-label="Menú expandido" className="w-full max-w-7xl mx-auto px-6 py-10 md:px-12 flex-1 flex flex-col justify-center">
        <ul className="space-y-4 md:space-y-5 list-none p-0 m-0">
          {menuItems.map((item) => {
            const isCurrent = !item.href.includes('#') && pathname === item.href;
            return (
              <li key={item.key} className="border-b border-white/5 pb-4 group">
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  aria-current={isCurrent ? 'page' : undefined}
                  className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 transition-colors duration-200 py-1 min-h-[44px]"
                >
                  <span
                    className={`font-mono text-xs md:text-sm transition-colors duration-200 ${
                      isCurrent ? 'text-crimson-text' : 'text-smoke group-hover:text-crimson-text'
                    }`}
                  >
                    {item.index}
                  </span>
                  <span
                    className={`font-sans font-black text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase transition-colors duration-200 ${
                      isCurrent ? 'text-crimson-text' : 'text-bone group-hover:text-crimson-text'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="hidden lg:inline-block font-serif italic text-base text-ash opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto">
                    {item.description} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pie del Menú con Streaming, Redes y Contacto */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 md:px-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
        {/* Plataformas de Streaming */}
        <div className="space-y-2">
          <p className="text-smoke uppercase tracking-wider">Streaming Oficial</p>
          <div className="flex flex-wrap gap-4 text-ash">
            {socialLinks?.spotify && (
              <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                Spotify ↗
              </a>
            )}
            {socialLinks?.appleMusic && (
              <a href={socialLinks.appleMusic} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                Apple Music ↗
              </a>
            )}
            {socialLinks?.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                YouTube ↗
              </a>
            )}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="space-y-2">
          <p className="text-smoke uppercase tracking-wider">Redes</p>
          <div className="flex flex-wrap gap-4 text-ash">
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                Instagram ↗
              </a>
            )}
            {socialLinks?.tiktok && (
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                TikTok ↗
              </a>
            )}
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                X / Twitter ↗
              </a>
            )}
          </div>
        </div>

        {/* Booking & Management */}
        <div className="space-y-2 md:text-right">
          <p className="text-smoke uppercase tracking-wider">Booking Directo</p>
          {bookingEmail ? (
            <a href={`mailto:${bookingEmail}`} className="text-crimson-text hover:underline transition-colors">
              {bookingEmail}
            </a>
          ) : (
            <Link href="/booking" onClick={handleLinkClick} className="text-ash hover:text-bone transition-colors">
              Contrataciones & Cotización ↗
            </Link>
          )}
        </div>
      </div>
    </dialog>
  );
};
