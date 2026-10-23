import React from 'react';
import type { Booking } from '@/payload-types';

export interface ShowBookingProps {
  booking: Booking | null;
}

/**
 * Ficha profesional del show. No muestra tarifas, fechas ni requisitos técnicos.
 * El bloque de management solo aparece si la API lo devuelve (campo `publishContact` activo).
 */
export const ShowBooking: React.FC<ShowBookingProps> = ({ booking }) => {
  if (!booking) return null;

  const specs = [
    { label: 'Duración', value: booking.specs?.duration },
    { label: 'Formato', value: booking.specs?.format },
    { label: 'Género', value: booking.specs?.genre },
    { label: 'Público', value: booking.specs?.audience },
    { label: 'Bailarines', value: booking.specs?.includesDancers ? 'Incluidos' : null },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  const management = booking.management;
  const showManagement = Boolean(management?.publishContact && (management.name || management.email || management.whatsapp));
  const whatsappDigits = management?.whatsapp?.replace(/[^\d]/g, '');
  const isDeclared = booking.specsStatus !== 'confirmed';

  return (
    <div className="space-y-12">
      {/* Descripción + ficha técnica */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          {booking.showTitle && (
            <h3 className="font-sans font-black text-3xl sm:text-4xl uppercase tracking-tight text-bone">
              {booking.showTitle}
            </h3>
          )}
          {booking.showDescription && (
            <p className="font-sans text-base md:text-lg text-bone/90 leading-relaxed">{booking.showDescription}</p>
          )}
          {booking.liveFeatures && booking.liveFeatures.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Características del directo">
              {booking.liveFeatures.map((f) => (
                <li
                  key={f.id ?? f.text}
                  className="font-mono text-xs text-bone bg-white/5 border border-white/10 px-3 py-1"
                >
                  {f.text}
                </li>
              ))}
            </ul>
          )}
          {(booking.baseLocation || booking.availabilityNote) && (
            <p className="font-mono text-xs text-ash uppercase tracking-wider">
              {[booking.baseLocation, booking.availabilityNote].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {specs.length > 0 && (
          <div className="lg:col-span-5 p-6 bg-carbon/40 border border-white/10 space-y-3 font-mono text-xs">
            <span className="uppercase text-smoke tracking-wider block text-[10px]">Ficha del show</span>
            <dl className="divide-y divide-white/5">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 py-2 text-ash">
                  <dt>{s.label}</dt>
                  <dd className="text-bone text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
            {isDeclared && (
              <p className="pt-2 text-[10px] leading-relaxed text-smoke normal-case">
                Especificaciones declaradas por el equipo del artista, sujetas a confirmación en cada contratación.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tipos de evento */}
      {booking.eventTypes && booking.eventTypes.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Tipos de evento">
          {booking.eventTypes.map((t) => (
            <li
              key={t.id ?? t.title}
              className="p-6 bg-carbon/30 border border-white/10 border-l-2 border-l-crimson space-y-2"
            >
              <h4 className="font-sans font-bold text-lg uppercase tracking-tight text-bone">{t.title}</h4>
              {t.description && <p className="font-sans text-sm text-ash leading-relaxed">{t.description}</p>}
            </li>
          ))}
        </ul>
      )}

      {/* Management (solo cuando está autorizado) */}
      {showManagement && management && (
        <div className="p-6 md:p-8 bg-graphite border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-ash block">Management</span>
            {management.name && <p className="font-sans font-bold text-xl text-bone">{management.name}</p>}
            {management.role && <p className="font-sans text-sm text-ash">{management.role}</p>}
          </div>
          <div className="space-y-2 font-mono text-sm">
            {management.email && (
              <a href={`mailto:${management.email}`} className="block text-crimson-text hover:underline break-all">
                {management.email}
              </a>
            )}
            {management.whatsapp && whatsappDigits && (
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-crimson-text hover:underline"
              >
                WhatsApp {management.whatsapp}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
