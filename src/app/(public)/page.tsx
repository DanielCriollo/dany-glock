import React from 'react';
import { Button } from '@/components/ui/Button';
import config from '@payload-config';
import { getPayload } from 'payload';
import type { ArtistProfile } from '@/payload-types';

export default async function HomePage() {
  let artistProfile: ArtistProfile | null = null;

  try {
    const payload = await getPayload({ config });
    const profileRes = await payload.findGlobal({ slug: 'artist-profile', overrideAccess: false });
    artistProfile = profileRes as ArtistProfile;
  } catch (error) {
    console.warn('HomePage: Fallback local para artist-profile', error);
  }

  const stageName = artistProfile?.stageName || 'DANY GLOCK';
  const tagline = artistProfile?.tagline || 'Artist Digital Experience — Dark Cinematic Editorial';
  const manifesto =
    artistProfile?.manifesto ||
    'La música urbana como cinematografía sonora: una narrativa nocturna nacida en el altiplano de Guatemala y proyectada a la escena global.';
  const city = artistProfile?.origin?.city || 'Quetzaltenango';
  const country = artistProfile?.origin?.country || 'Guatemala';

  return (
    <div className="w-full">
      {/* 1. HERO EDITORIAL TIPOGRÁFICO */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto py-16 md:py-24 border-b border-white/10">
        <div className="space-y-6 max-w-5xl">
          {/* Badge de Estado & Ubicación */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson-signal animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash">
              {city}, {country} · Plataforma Oficial
            </span>
            <span className="font-mono text-xs text-smoke hidden sm:inline">|</span>
            <span className="font-mono text-xs uppercase tracking-wider text-crimson-text hidden sm:inline">
              Fase 005 — Cinematic Layout
            </span>
          </div>

          {/* Gran Título Póster */}
          <h1 className="font-sans font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter uppercase text-bone leading-[0.9]">
            {stageName}
          </h1>

          {/* Subtítulo Editorial con Instrument Serif */}
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ash max-w-3xl leading-snug">
            {tagline}
          </p>

          {/* Cita del Manifiesto */}
          <blockquote className="border-l-2 border-crimson pl-6 py-2 text-ash text-base md:text-lg max-w-2xl font-sans">
            &ldquo;{manifesto}&rdquo;
          </blockquote>

          {/* Botones de Acción */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Button variant="primary" href="#musica">
              Explorar Discografía ↓
            </Button>
            <Button variant="secondary" href="#tour">
              Fechas de Tour
            </Button>
            <Button variant="ghost" href="#contacto">
              Booking Directo →
            </Button>
          </div>
        </div>

        {/* Metadato Tipográfico Inferior */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-smoke">
          <div>SOUND DESIGN · VISUAL IDENTITY · STAGE EXPERIENCE</div>
          <div className="text-ash tracking-widest uppercase">TEMPORADA 2026</div>
        </div>
      </section>

      {/* 2. SECCIÓN MÚSICA & DISCOGRAFÍA (ANCLA #musica) */}
      <section id="musica" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              01 / Discografía
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              MÚSICA & RELEASES
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Producciones de estudio, lanzamientos oficiales y colaboraciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-carbon/40 border border-white/10 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="font-mono text-xs text-smoke uppercase tracking-wider block mb-2">Catálogo CMS</span>
              <h3 className="font-sans font-bold text-2xl text-bone mb-3">Singles & EPs</h3>
              <p className="text-sm text-ash leading-relaxed">
                Estructura administrable lista en Payload CMS para la catalogación de pistas oficiales.
              </p>
            </div>
            <span className="font-mono text-xs text-crimson-text mt-6">En preparación para Misión 006 →</span>
          </div>

          <div className="p-8 bg-carbon/40 border border-white/10 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="font-mono text-xs text-smoke uppercase tracking-wider block mb-2">Audio Engine</span>
              <h3 className="font-sans font-bold text-2xl text-bone mb-3">Streaming Links</h3>
              <p className="text-sm text-ash leading-relaxed">
                Enlaces inteligentes sincronizados con Spotify, Apple Music y YouTube Music.
              </p>
            </div>
            <span className="font-mono text-xs text-smoke mt-6">Arquitectura lista</span>
          </div>

          <div className="p-8 bg-carbon/40 border border-white/10 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="font-mono text-xs text-smoke uppercase tracking-wider block mb-2">Créditos & Letras</span>
              <h3 className="font-sans font-bold text-2xl text-bone mb-3">Fichas Técnicas</h3>
              <p className="text-sm text-ash leading-relaxed">
                Metadatos de producción, compositores y letrística con tipografía JetBrains Mono.
              </p>
            </div>
            <span className="font-mono text-xs text-smoke mt-6">Especificación Dark Cinematic</span>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN VIDEOGRAFÍA (ANCLA #videos) */}
      <section id="videos" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              02 / Audiovisual
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              VIDEOGRAFÍA OFICIAL
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Dirección de arte cinematográfica, videoclips y directos visuales.
          </p>
        </div>

        <div className="p-8 md:p-12 bg-graphite border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-ash">
              Contenido Audiovisual
            </span>
            <h3 className="font-sans font-bold text-2xl md:text-3xl text-bone">
              Experiencia Cinematográfica en Construcción
            </h3>
            <p className="text-sm text-ash leading-relaxed">
              La galería audiovisual integrará reproductores optimizados sin secuestro de scroll, con soporte para resoluciones widescreen y estética nocturna.
            </p>
          </div>
          <Button variant="secondary" href="#contacto">
            Consultar Disponibilidad de Prensa
          </Button>
        </div>
      </section>

      {/* 4. SECCIÓN TOUR & CONCIERTOS (ANCLA #tour) */}
      <section id="tour" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              03 / En Vivo
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              TOUR & PRESENTACIONES
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Fechas confirmadas, festivales y apariciones públicas.
          </p>
        </div>

        <div className="border border-white/10 divide-y divide-white/10 bg-carbon/30">
          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-xs text-crimson-text uppercase">Próximamente</span>
              <div>
                <h3 className="font-sans font-bold text-xl text-bone">Temporada 2026 — Gira Nacional & Regional</h3>
                <p className="text-xs font-mono text-ash mt-1">Guatemala / Centroamérica / Fechas en proceso de anuncio</p>
              </div>
            </div>
            <Button variant="ghost" href="#contacto">
              Solicitar Fecha →
            </Button>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN JOURNAL & COMUNICADOS (ANCLA #journal) */}
      <section id="journal" className="px-6 md:px-12 max-w-7xl mx-auto py-24 border-b border-white/10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
              04 / Editorial
            </span>
            <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone">
              JOURNAL & COMUNICADOS
            </h2>
          </div>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-md">
            Notas de prensa, reflexiones de estudio y comunicados oficiales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-carbon/30 border border-white/10 space-y-4">
            <span className="font-mono text-xs text-smoke">Comunicado 01 · 2026</span>
            <h3 className="font-sans font-bold text-xl text-bone">
              Lanzamiento de la Plataforma Digital Oficial
            </h3>
            <p className="text-sm text-ash leading-relaxed">
              Dany Glock estrena su nuevo ecosistema digital Dark Cinematic Editorial, desarrollado a medida con Next.js 15 y Payload CMS para centralizar música, giras y contacto directo sin intermediarios.
            </p>
          </div>

          <div className="p-8 bg-carbon/30 border border-white/10 space-y-4">
            <span className="font-mono text-xs text-smoke">Comunicado 02 · 2026</span>
            <h3 className="font-sans font-bold text-xl text-bone">
              Nueva Etapa Sonora en el Altiplano Guatemalteco
            </h3>
            <p className="text-sm text-ash leading-relaxed">
              Consolidando la narrativa visual y sonora que posiciona a Quetzaltenango en el radar del movimiento urbano contemporáneo.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN PRESS KIT & CONTACTO (ANCLAS #press-kit y #contacto) */}
      <section id="press-kit" className="px-6 md:px-12 max-w-7xl mx-auto py-24 scroll-mt-24">
        <div id="contacto" className="scroll-mt-24">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-crimson-text block mb-2">
            05 / Prensa & Booking
          </span>
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight uppercase text-bone mb-6">
            ELECTRONIC PRESS KIT & CONTACTO
          </h2>
          <p className="font-serif italic text-ash text-lg md:text-xl max-w-2xl mb-12">
            Material fotográfico de alta resolución, fichas biográficas oficiales y canales directos de contratación.
          </p>

          <div className="p-8 bg-graphite border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-ash uppercase">Canal Principal de Contratación</span>
              <p className="font-sans font-bold text-xl text-bone">Booking & Management Directo</p>
              <p className="font-mono text-xs text-smoke">Respuesta oficial en menos de 48 horas laborales.</p>
            </div>
            <Button variant="primary" href="mailto:booking@danyglock.com">
              Contactar a Booking ↗
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
