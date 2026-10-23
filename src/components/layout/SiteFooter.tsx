import React from 'react';
import Link from 'next/link';
import config from '@payload-config';
import { getPayload } from 'payload';
import type { ArtistProfile, SiteSetting } from '@/payload-types';

export async function SiteFooter() {
  let artistProfile: ArtistProfile | null = null;
  let siteSettings: SiteSetting | null = null;

  try {
    const payload = await getPayload({ config });
    const [profileRes, settingsRes] = await Promise.all([
      payload.findGlobal({ slug: 'artist-profile', overrideAccess: false }),
      payload.findGlobal({ slug: 'site-settings', overrideAccess: false }),
    ]);
    artistProfile = profileRes as ArtistProfile;
    siteSettings = settingsRes as SiteSetting;
  } catch (error) {
    console.warn('SiteFooter: Error al consultar globals de Payload CMS, usando fallbacks seguros.', error);
  }

  const stageName = artistProfile?.stageName || 'DANY GLOCK';
  const city = artistProfile?.origin?.city || 'Pasto';
  const country = artistProfile?.origin?.country || 'Colombia';
  const copyright = siteSettings?.copyrightText || `© ${new Date().getFullYear()} Dany Glock. Todos los derechos reservados.`;

  return (
    <footer className="relative bg-ink text-bone border-t border-white/10 overflow-hidden pt-16 pb-12">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Fila Principal: Wordmark + Navegación Esencial + Redes */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/10">
          {/* Wordmark Tipográfico */}
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block">
              Plataforma Oficial
            </span>
            <Link
              href="/"
              className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter uppercase text-bone hover:text-crimson-text transition-colors duration-200 block"
            >
              {stageName}
            </Link>
            <p className="font-mono text-xs text-smoke">
              {city}, {country} · Música Urbana & Trap Latino
            </p>
          </div>

          {/* Navegación Esencial */}
          <nav aria-label="Navegación pie de página" className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider text-ash">
            <Link href="#musica" className="hover:text-bone transition-colors py-1">
              Música
            </Link>
            <Link href="#videos" className="hover:text-bone transition-colors py-1">
              Videos
            </Link>
            <Link href="/biografia" className="hover:text-bone transition-colors py-1">
              Biografía
            </Link>
            <Link href="#tour" className="hover:text-bone transition-colors py-1">
              Shows
            </Link>
            <Link href="#contacto" className="hover:text-bone transition-colors py-1">
              Contacto
            </Link>
          </nav>
        </div>

        {/* Fila Inferior: Copyright + Redes Verificadas + Volver Arriba */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono text-xs text-smoke">
          {/* Canales Oficiales Verificados */}
          <div className="flex flex-wrap items-center gap-6">
            {siteSettings?.socialLinks?.youtube && (
              <a
                href={siteSettings.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-crimson-text transition-colors flex items-center gap-1"
              >
                <span>YouTube</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {siteSettings?.socialLinks?.instagram && (
              <a
                href={siteSettings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-crimson-text transition-colors flex items-center gap-1"
              >
                <span>Instagram</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {siteSettings?.socialLinks?.appleMusic && (
              <a
                href={siteSettings.socialLinks.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-crimson-text transition-colors flex items-center gap-1"
              >
                <span>Apple Music</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          {/* Copyright y Volver Arriba */}
          <div className="flex items-center gap-6">
            <span>{copyright}</span>
            <a
              href="#main-content"
              className="text-ash hover:text-bone transition-colors flex items-center gap-1"
              aria-label="Volver al inicio de la página"
            >
              <span>Arriba</span>
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
