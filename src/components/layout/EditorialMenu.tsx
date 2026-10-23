'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

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
}

const MENU_ITEMS = [
  { index: '01', label: 'Música', href: '#musica', description: 'Discografía oficial, singles y álbumes' },
  { index: '02', label: 'Videografía', href: '#videos', description: 'Videoclips oficiales y directos' },
  { index: '03', label: 'Tour & Shows', href: '#tour', description: 'Fechas de conciertos y festivales' },
  { index: '04', label: 'Journal', href: '#journal', description: 'Noticias, comunicados y prensa' },
  { index: '05', label: 'Press Kit (EPK)', href: '#press-kit', description: 'Recursos para medios y promotores' },
  { index: '06', label: 'Booking & Contacto', href: '#contacto', description: 'Contrataciones y alianzas' },
];

export const EditorialMenu: React.FC<EditorialMenuProps> = ({
  isOpen,
  onClose,
  socialLinks,
  bookingEmail,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = 'hidden';
      // Enfocar el botón de cerrar accesible
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
  }, [isOpen]);

  // Manejar el evento nativo de cancelación (tecla ESC en <dialog>)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
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
          <span className="font-sans text-lg leading-none group-hover:rotate-90 transition-transform duration-200" aria-hidden="true">
            ✕
          </span>
        </button>
      </div>

      {/* Lista Principal de Enlaces Tipográficos */}
      <nav aria-label="Menú expandido" className="w-full max-w-7xl mx-auto px-6 py-12 md:px-12 flex-1 flex flex-col justify-center">
        <ul className="space-y-4 md:space-y-6 list-none p-0 m-0">
          {MENU_ITEMS.map((item) => (
            <li key={item.index} className="border-b border-white/5 pb-4 group">
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 transition-colors duration-200"
              >
                <span className="font-mono text-xs md:text-sm text-smoke group-hover:text-crimson-text transition-colors duration-200">
                  {item.index}
                </span>
                <span className="font-sans font-black text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase text-bone group-hover:text-crimson-text transition-colors duration-200">
                  {item.label}
                </span>
                <span className="hidden lg:inline-block font-serif italic text-base text-ash opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto">
                  {item.description} →
                </span>
              </Link>
            </li>
          ))}
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
            <span className="text-ash">booking@danyglock.com</span>
          )}
        </div>
      </div>
    </dialog>
  );
};
