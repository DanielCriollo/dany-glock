import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBookingData, getShowGalleryData } from '@/lib/cms-queries';
import { ShowBooking } from '@/components/booking/ShowBooking';
import { ShowGallery } from '@/components/gallery/ShowGallery';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Dany Glock — Shows & Booking',
  description:
    'Contratación de Dany Glock para discotecas, festivales urbanos y eventos corporativos: formato del show, archivo de presentaciones y solicitud de cotización.',
};

export default async function BookingPage() {
  const [booking, gallery] = await Promise.all([getBookingData(), getShowGalleryData()]);

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ash hover:text-crimson-text transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>Volver a la Página Principal</span>
        </Link>
      </div>

      <header className="border-b border-white/10 pb-12 mb-16 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-crimson" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash">En vivo · Contrataciones</span>
        </div>
        <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter uppercase text-bone">
          Shows & Booking
        </h1>
        <p className="font-serif italic text-2xl sm:text-3xl text-ash max-w-3xl leading-snug">
          DJ set y performance en vivo para escenarios de música urbana.
        </p>
      </header>

      <section aria-labelledby="show-title" className="mb-24">
        <h2 id="show-title" className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text mb-8">
          01 / El show
        </h2>
        {booking ? (
          <ShowBooking booking={booking} />
        ) : (
          <p className="font-serif italic text-lg text-ash">Información del show en preparación.</p>
        )}
      </section>

      {gallery.length > 0 && (
        <section aria-labelledby="archivo-title" className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <h2 id="archivo-title" className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text">
              02 / Archivo de presentaciones
            </h2>
            <p className="font-sans text-xs text-smoke max-w-md">
              Flyers y fotografías de presentaciones anteriores. Fechas y lugares transcritos tal como aparecen en cada pieza.
            </p>
          </div>
          <ShowGallery items={gallery} />
        </section>
      )}

      <section aria-labelledby="cotizacion-title" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <h2 id="cotizacion-title" className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text">
            {gallery.length > 0 ? '03' : '02'} / Solicitud de cotización
          </h2>
          <p className="font-sans text-base text-bone/90 leading-relaxed">
            {booking?.quoteNote ||
              'Para cotizaciones y disponibilidad, envía tu solicitud indicando fecha, ciudad y tipo de evento.'}
          </p>
          <p className="font-sans text-sm text-ash leading-relaxed">
            Las tarifas, la disponibilidad y el rider técnico se comparten directamente con cada organizador.
          </p>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
