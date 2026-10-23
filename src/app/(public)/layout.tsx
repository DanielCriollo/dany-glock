import type { Metadata } from 'next';
import { archivo, instrumentSerif, jetbrainsMono } from '../fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Dany Glock — Official Artist Experience',
  description:
    'Plataforma oficial del artista urbano Dany Glock. Discografía, videografía, fechas de gira y comunicados editoriales.',
  keywords: ['Dany Glock', 'música urbana', 'trap', 'reggaeton', 'tour', 'discografía'],
  authors: [{ name: 'Dany Glock' }],
};

export default function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-ink text-bone font-sans antialiased selection:bg-crimson selection:text-bone">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
