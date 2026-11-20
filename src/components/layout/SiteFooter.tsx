import React from 'react';
import Link from 'next/link';
import config from '@payload-config';
import { getPayload } from 'payload';
import type { ArtistProfile, SiteSetting } from '@/payload-types';
import { getNavigationItems } from '@/lib/navigation';

export interface SiteFooterProps {
  artistProfile?: ArtistProfile | null;
  siteSettings?: SiteSetting | null;
  showStageHistory?: boolean;
}

export async function SiteFooter(props: SiteFooterProps = {}) {
  let artistProfile: ArtistProfile | null = props.artistProfile ?? null;
  let siteSettings: SiteSetting | null = props.siteSettings ?? null;
  let showStageHistory = props.showStageHistory ?? false;

  // Si se invoca fuera de `PublicRootLayout` (p. ej. en pruebas unitarias), consulta Payload.
  if (props.artistProfile === undefined || props.siteSettings === undefined) {
    try {
      const payload = await getPayload({ config });
      const [profileRes, settingsRes, stageCount] = await Promise.all([
        props.artistProfile === undefined
          ? payload.findGlobal({ slug: 'artist-profile', overrideAccess: false })
          : Promise.resolve(props.artistProfile),
        props.siteSettings === undefined
          ? payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
          : Promise.resolve(props.siteSettings),
        props.showStageHistory === undefined
          ? payload.count({
              collection: 'events',
              where: {
                and: [
                  { _status: { equals: 'published' } },
                  { 'verification.status': { equals: 'verified' } },
                  { listing: { equals: 'archive' } },
                ],
              },
              overrideAccess: false,
            })
          : Promise.resolve(null),
      ]);
      artistProfile = profileRes as ArtistProfile;
      siteSettings = settingsRes as SiteSetting;
      if (stageCount) showStageHistory = stageCount.totalDocs > 0;
    } catch (error) {
      console.warn('SiteFooter: Error al consultar globals de Payload CMS, usando fallbacks seguros.', error);
    }
  }

  const navItems = getNavigationItems(showStageHistory);
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

          {/* Navegación Esencial (paridad con Header y Menú Editorial) */}
          <nav aria-label="Navegación pie de página" className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-ash">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className="hover:text-bone transition-colors py-1">
                {item.label}
              </Link>
            ))}
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
