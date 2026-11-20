import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBookingData, getStageHistoryData } from '@/lib/cms-queries';
import { ShowBooking } from '@/components/booking/ShowBooking';
import { ContactForm } from '@/components/contact/ContactForm';

/**
 * ISR: la página se regenera bajo demanda cuando Payload publica cambios (src/lib/revalidate.ts).
 * El intervalo es solo una red de seguridad para cambios que no pasan por los hooks
 * (seeds por CLI, ediciones directas en la base de datos).
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dany Glock — Shows & Booking',
  description:
    'Contratación profesional de Dany Glock para discotecas, festivales urbanos y eventos corporativos: formato del show, especificaciones técnicas y solicitud de cotización.',
};

export default async function BookingPage() {
  const [booking, stageHistory] = await Promise.all([getBookingData(), getStageHistoryData()]);
  const rider = typeof booking?.technicalRider === 'object' ? booking.technicalRider : null;

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ash hover:text-crimson-text transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>Volver a la Página Principal</span>
        </Link>
        <Link
          href="/#tour"
          className="font-mono text-xs uppercase tracking-widest text-ash hover:text-bone transition-colors"
        >
          Próximas fechas →
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

      <section aria-labelledby="show-title" className="mb-20 space-y-10">
        <h2 id="show-title" className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text">
          01 / El show y especificaciones
        </h2>
        {booking ? (
          <ShowBooking booking={booking} />
        ) : (
          <p className="font-serif italic text-lg text-ash">Información del show en preparación.</p>
        )}

        {/* Especificaciones técnicas y rider */}
        <div className="p-6 md:p-8 bg-carbon/30 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-smoke block">
              Requerimientos técnicos
            </span>
            <p className="font-sans text-sm text-ash leading-relaxed">
              Rider técnico, stage plot y requerimientos de sonido e iluminación se comparten directamente con la producción de cada evento.
            </p>
          </div>
          {rider?.url ? (
            <a
              href={rider.url}
              download
              className="shrink-0 font-mono text-xs uppercase tracking-widest text-crimson-text hover:underline"
            >
              Descargar rider técnico ↓
            </a>
          ) : (
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-smoke border border-white/10 px-3 py-1.5">
              Disponible bajo solicitud
            </span>
          )}
        </div>
      </section>

      <section id="cotizacion" aria-labelledby="cotizacion-title" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
        <div className="lg:col-span-5 space-y-4">
          <h2 id="cotizacion-title" className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text">
            02 / Solicitud de cotización
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

      {stageHistory.length > 0 && (
        <div className="mt-20 pt-10 border-t border-white/10">
          <Link
            href="/escenarios"
            className="group flex items-center justify-between gap-6 border border-white/10 hover:border-crimson/50 bg-carbon/20 px-6 py-5 transition-colors duration-300"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-ash group-hover:text-bone transition-colors">
              Trayectoria en escenarios · {stageHistory.length}{' '}
              {stageHistory.length === 1 ? 'presentación documentada' : 'presentaciones documentadas'}
            </span>
            <span className="font-mono text-xs text-crimson-text" aria-hidden="true">
              Ver archivo →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
