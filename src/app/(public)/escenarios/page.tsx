import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStageHistoryData } from '@/lib/cms-queries';
import { StageHistoryGallery } from '@/components/stage/StageHistoryGallery';
import { Button } from '@/components/ui/Button';

/**
 * ISR: se regenera bajo demanda cuando Payload publica o retira un evento (src/lib/revalidate.ts).
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dany Glock — Trayectoria en escenarios',
  description:
    'Archivo de presentaciones en vivo de Dany Glock: festivales, lanzamientos y shows en el sur de Colombia.',
};

/**
 * Archivo histórico de presentaciones. Solo existe públicamente cuando hay al menos un evento
 * anterior publicado y verificado; mientras tanto responde 404 (igual que el EPK oculto).
 */
export default async function EscenariosPage() {
  const items = await getStageHistoryData();
  if (items.length === 0) notFound();

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

      <header className="relative border-b border-white/10 pb-12 mb-16 grid grid-cols-1 xl:grid-cols-12 gap-8 items-end">
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash">Archivo en vivo</span>
          </div>
          <h1 className="font-sans font-black text-[2.5rem] min-[400px]:text-5xl sm:text-7xl xl:text-8xl tracking-tighter uppercase text-bone leading-[0.9]">
            Trayectoria
            <span className="block font-serif italic font-normal normal-case tracking-normal text-ash text-3xl min-[400px]:text-4xl sm:text-6xl xl:text-7xl mt-2">
              en escenarios
            </span>
          </h1>
        </div>
        <div className="xl:col-span-4 space-y-3">
          <p className="font-mono text-6xl font-bold text-crimson-text leading-none" aria-hidden="true">
            {String(items.length).padStart(2, '0')}
          </p>
          <p className="font-sans text-sm text-ash leading-relaxed">
            {items.length === 1 ? 'Presentación documentada' : 'Presentaciones documentadas'} con sus flyers
            originales: festivales, lanzamientos y noches de club.
          </p>
        </div>
      </header>

      <StageHistoryGallery items={items} headingLevel="h2" />

      <div className="mt-24 pt-10 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <p className="font-serif italic text-xl text-ash max-w-xl">La próxima fecha puede ser la tuya.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" href="/#tour">
            Próximas fechas
          </Button>
          <Button variant="primary" href="/booking">
            Shows & Booking →
          </Button>
        </div>
      </div>
    </div>
  );
}
