import type { Metadata } from 'next';
import { archivo, instrumentSerif, jetbrainsMono } from '../fonts';
import '../globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import config from '@payload-config';
import { getPayload } from 'payload';
import type { ArtistProfile, SiteSetting } from '@/payload-types';

export const metadata: Metadata = {
  title: 'Dany Glock — Sitio Oficial',
  description:
    'Plataforma oficial del artista urbano Dany Glock. Discografía, videografía, shows, contratación y trayectoria artística.',
  keywords: ['Dany Glock', 'música urbana', 'trap', 'reggaeton', 'shows', 'booking', 'discografía'],
  authors: [{ name: 'Dany Glock' }],
};

export default async function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sin try/catch: si la consulta falla durante una regeneración ISR, Next.js mantiene
  // la última versión válida en vez de cachear un header/footer sin datos.
  // Una sola batería paralela alimenta Header, Menú Editorial y Footer sin duplicar consultas.
  const payload = await getPayload({ config });
  const [siteSettings, artistProfile, stageHistory] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', overrideAccess: false }) as Promise<SiteSetting>,
    payload.findGlobal({ slug: 'artist-profile', overrideAccess: false, depth: 0 }) as Promise<ArtistProfile>,
    payload.count({
      collection: 'events',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { 'verification.status': { equals: 'verified' } },
          { listing: { equals: 'archive' } },
        ],
      },
      overrideAccess: false,
    }),
  ]);
  const showStageHistory = stageHistory.totalDocs > 0;

  return (
    <html
      lang="es"
      className={`${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-ink text-bone font-sans antialiased selection:bg-crimson selection:text-bone flex flex-col justify-between">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>

        {/* Barra de Navegación Cinematográfica */}
        <SiteHeader
          socialLinks={siteSettings?.socialLinks}
          bookingEmail={siteSettings?.contactEmails?.booking}
          showStageHistory={showStageHistory}
        />

        {/* Contenedor Principal */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pt-24">
          {children}
        </main>

        {/* Footer Editorial Conectado al CMS */}
        <SiteFooter
          artistProfile={artistProfile}
          siteSettings={siteSettings}
          showStageHistory={showStageHistory}
        />
      </body>
    </html>
  );
}
