import type { Metadata } from 'next';
import { archivo, instrumentSerif, jetbrainsMono } from '../fonts';
import '../globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import config from '@payload-config';
import { getPayload } from 'payload';
import type { SiteSetting } from '@/payload-types';

export const metadata: Metadata = {
  title: 'Dany Glock — Official Artist Experience',
  description:
    'Plataforma oficial del artista urbano Dany Glock. Discografía, videografía, fechas de gira y comunicados editoriales.',
  keywords: ['Dany Glock', 'música urbana', 'trap', 'reggaeton', 'tour', 'discografía'],
  authors: [{ name: 'Dany Glock' }],
};

export default async function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteSettings: SiteSetting | null = null;

  try {
    const payload = await getPayload({ config });
    const settingsRes = await payload.findGlobal({ slug: 'site-settings', overrideAccess: false });
    siteSettings = settingsRes as SiteSetting;
  } catch (error) {
    console.warn('PublicRootLayout: Usando fallbacks seguros para siteSettings', error);
  }

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
        />

        {/* Contenedor Principal */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pt-24">
          {children}
        </main>

        {/* Footer Editorial Conectado al CMS */}
        <SiteFooter />
      </body>
    </html>
  );
}
