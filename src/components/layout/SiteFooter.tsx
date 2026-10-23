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
  const manifesto =
    artistProfile?.manifesto ||
    'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el altiplano de Guatemala y proyectada a la escena global.';
  const copyright = siteSettings?.copyrightText || `© ${new Date().getFullYear()} Dany Glock. Todos los derechos reservados.`;
  const bookingEmail = siteSettings?.contactEmails?.booking || 'booking@danyglock.com';
  const pressEmail = siteSettings?.contactEmails?.press || 'press@danyglock.com';

  return (
    <footer className="relative bg-graphite text-bone border-t border-white/10 overflow-hidden pt-20 pb-8">
      {/* Bloque Superior: Booking & Management Block */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="border-b border-white/10 pb-12 mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text mb-4">
            Direct Contact & Representation
          </p>
          <h2 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter uppercase text-bone mb-8">
            BOOKING & PRENSA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-carbon/50 border border-white/5 hover:border-crimson/50 transition-colors duration-200">
              <span className="font-mono text-[10px] uppercase text-ash tracking-widest block mb-2">01 / Conciertos & Shows</span>
              <h3 className="font-sans font-bold text-lg text-bone mb-2">Booking Oficial</h3>
              <a href={`mailto:${bookingEmail}`} className="font-mono text-xs text-crimson-text hover:underline break-all">
                {bookingEmail} ↗
              </a>
            </div>

            <div className="p-6 bg-carbon/50 border border-white/5 hover:border-crimson/50 transition-colors duration-200">
              <span className="font-mono text-[10px] uppercase text-ash tracking-widest block mb-2">02 / Medios & Entrevistas</span>
              <h3 className="font-sans font-bold text-lg text-bone mb-2">Prensa & Editorial</h3>
              <a href={`mailto:${pressEmail}`} className="font-mono text-xs text-crimson-text hover:underline break-all">
                {pressEmail} ↗
              </a>
            </div>

            <div className="p-6 bg-carbon/50 border border-white/5 hover:border-crimson/50 transition-colors duration-200">
              <span className="font-mono text-[10px] uppercase text-ash tracking-widest block mb-2">03 / Material para Medios</span>
              <h3 className="font-sans font-bold text-lg text-bone mb-2">Electronic Press Kit</h3>
              <Link href="#press-kit" className="font-mono text-xs text-bone hover:text-crimson-text transition-colors">
                Descargar EPK Oficial ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Cuadrícula de Columnas del Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 font-mono text-xs">
          {/* Col 1: Manifiesto */}
          <div className="space-y-4">
            <span className="text-smoke uppercase tracking-wider block">Manifiesto Artístico</span>
            <p className="font-serif italic text-sm text-ash leading-relaxed">
              &ldquo;{manifesto}&rdquo;
            </p>
            <p className="text-[11px] text-smoke">
              {artistProfile?.origin?.city ? `${artistProfile.origin.city}, ` : ''}
              {artistProfile?.origin?.country || 'Guatemala'}
            </p>
          </div>

          {/* Col 2: Navegación del Sitio */}
          <div className="space-y-4">
            <span className="text-smoke uppercase tracking-wider block">Navegación</span>
            <ul className="space-y-2 list-none p-0 m-0 text-ash">
              <li>
                <Link href="#musica" className="hover:text-bone transition-colors">
                  01 Música & Discografía
                </Link>
              </li>
              <li>
                <Link href="#videos" className="hover:text-bone transition-colors">
                  02 Videografía Oficial
                </Link>
              </li>
              <li>
                <Link href="#tour" className="hover:text-bone transition-colors">
                  03 Tour & Gira
                </Link>
              </li>
              <li>
                <Link href="#journal" className="hover:text-bone transition-colors">
                  04 Journal & Noticias
                </Link>
              </li>
              <li>
                <Link href="#press-kit" className="hover:text-bone transition-colors">
                  05 Electronic Press Kit
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="hover:text-bone transition-colors">
                  06 Contacto Profesional
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Canales de Streaming */}
          <div className="space-y-4">
            <span className="text-smoke uppercase tracking-wider block">Música & Streaming</span>
            <ul className="space-y-2 list-none p-0 m-0 text-ash">
              {siteSettings?.socialLinks?.spotify && (
                <li>
                  <a href={siteSettings.socialLinks.spotify} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                    Spotify Artist ↗
                  </a>
                </li>
              )}
              {siteSettings?.socialLinks?.appleMusic && (
                <li>
                  <a href={siteSettings.socialLinks.appleMusic} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                    Apple Music ↗
                  </a>
                </li>
              )}
              {siteSettings?.socialLinks?.youtube && (
                <li>
                  <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                    YouTube Oficial ↗
                  </a>
                </li>
              )}
              {!siteSettings?.socialLinks?.spotify && (
                <li className="text-smoke">Plataformas en preparación</li>
              )}
            </ul>
          </div>

          {/* Col 4: Redes Sociales */}
          <div className="space-y-4">
            <span className="text-smoke uppercase tracking-wider block">Comunidad & Redes</span>
            <ul className="space-y-2 list-none p-0 m-0 text-ash">
              {siteSettings?.socialLinks?.instagram && (
                <li>
                  <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                    Instagram ↗
                  </a>
                </li>
              )}
              {siteSettings?.socialLinks?.tiktok && (
                <li>
                  <a href={siteSettings.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                    TikTok ↗
                  </a>
                </li>
              )}
              {siteSettings?.socialLinks?.twitter && (
                <li>
                  <a href={siteSettings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
                    X / Twitter ↗
                  </a>
                </li>
              )}
              {!siteSettings?.socialLinks?.instagram && (
                <li className="text-smoke">Perfiles en sincronización</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Barra Inferior de Metadatos & Volver Arriba */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-smoke">
        <p>{copyright}</p>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-ash transition-colors">
            Acceso CMS [Admin]
          </Link>
          <a href="#main-content" className="hover:text-bone transition-colors">
            Volver arriba ↑
          </a>
        </div>
      </div>

      {/* Wordmark Gigante Recortado (Gesto Editorial de Sangrado) */}
      <div className="w-full overflow-hidden select-none pointer-events-none mt-12 -mb-8 opacity-15">
        <span className="block font-sans font-black text-[15vw] leading-none text-center tracking-tighter uppercase whitespace-nowrap text-bone">
          {stageName}
        </span>
      </div>
    </footer>
  );
}
