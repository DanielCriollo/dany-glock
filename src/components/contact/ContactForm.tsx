'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subjectType: 'booking_event',
    message: '',
    websiteHoneypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    // Si el honeypot tiene contenido, silenciosamente fingir éxito o detener
    if (formData.websiteHoneypot) {
      setStatus('success');
      return;
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          subjectType: formData.subjectType,
          message: formData.message.trim(),
          websiteHoneypot: formData.websiteHoneypot,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || 'Error al procesar la solicitud.');
      }

      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subjectType: 'booking_event',
        message: '',
        websiteHoneypot: '',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de conexión. Por favor intenta más tarde.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  return (
    <div className="bg-graphite border border-white/10 p-6 md:p-10">
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-crimson-text block mb-2">
          Canal Directo
        </span>
        <h3 className="font-sans font-bold text-2xl text-bone">
          Envío de Solicitud Profesional
        </h3>
        <p className="text-sm text-ash mt-1">
          Completa el formulario para solicitudes de booking, cobertura de prensa o alianzas.
        </p>
      </div>

      {status === 'success' ? (
        <div className="p-8 border border-white/20 bg-carbon text-center space-y-4" role="status">
          <div className="w-12 h-12 rounded-full bg-crimson/20 border border-crimson text-crimson-text mx-auto flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <h4 className="font-sans font-bold text-xl text-bone">
            Solicitud Registrada con Éxito
          </h4>
          <p className="font-sans text-sm text-ash max-w-md mx-auto">
            Tu mensaje ha sido recibido por el equipo de Dany Glock. Nos comunicaremos contigo a través del correo proporcionado.
          </p>
          <Button
            variant="ghost"
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-4"
          >
            Enviar otro mensaje
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Honeypot Oculto (Anti-Spam) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="websiteHoneypot">No completar este campo</label>
            <input
              type="text"
              id="websiteHoneypot"
              name="websiteHoneypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.websiteHoneypot}
              onChange={handleChange}
            />
          </div>

          {/* Fila 1: Nombre y Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block font-mono text-xs uppercase tracking-wider text-ash">
                Nombre Completo <span className="text-crimson">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                minLength={2}
                maxLength={100}
                placeholder="ej: Carlos Mendoza"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-carbon border border-white/10 px-4 py-3 text-bone text-sm font-sans focus:outline-none focus:border-crimson transition-colors placeholder:text-smoke"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-mono text-xs uppercase tracking-wider text-ash">
                Correo Electrónico <span className="text-crimson">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="ej: contacto@promotora.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-carbon border border-white/10 px-4 py-3 text-bone text-sm font-sans focus:outline-none focus:border-crimson transition-colors placeholder:text-smoke"
              />
            </div>
          </div>

          {/* Fila 2: Teléfono y Motivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="block font-mono text-xs uppercase tracking-wider text-ash">
                Teléfono / WhatsApp <span className="text-smoke text-[10px]">(Opcional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={30}
                placeholder="+57 300 000 0000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-carbon border border-white/10 px-4 py-3 text-bone text-sm font-sans focus:outline-none focus:border-crimson transition-colors placeholder:text-smoke"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subjectType" className="block font-mono text-xs uppercase tracking-wider text-ash">
                Motivo del Contacto <span className="text-crimson">*</span>
              </label>
              <select
                id="subjectType"
                name="subjectType"
                required
                value={formData.subjectType}
                onChange={handleChange}
                className="w-full bg-carbon border border-white/10 px-4 py-3 text-bone text-sm font-sans focus:outline-none focus:border-crimson transition-colors"
              >
                <option value="booking_event">Contratación / Show (Booking)</option>
                <option value="press_media">Prensa, Medios y Entrevistas</option>
                <option value="brand_partnership">Alianza de Marca / Patrocinio</option>
                <option value="other">Otro Asunto Profesional</option>
              </select>
            </div>
          </div>

          {/* Fila 3: Mensaje */}
          <div className="space-y-2">
            <label htmlFor="message" className="block font-mono text-xs uppercase tracking-wider text-ash">
              Detalle de la Solicitud <span className="text-crimson">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              minLength={10}
              maxLength={3000}
              placeholder="Indica la fecha tentativa, ciudad, recinto o medio de comunicación..."
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-carbon border border-white/10 px-4 py-3 text-bone text-sm font-sans focus:outline-none focus:border-crimson transition-colors placeholder:text-smoke resize-y"
            />
          </div>

          {/* Alerta de Error */}
          {errorMessage && (
            <div className="p-4 border border-crimson/50 bg-crimson/10 text-crimson-text text-xs font-mono" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Botón de Envío */}
          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[11px] text-smoke">
              Campos marcados con <span className="text-crimson">*</span> son requeridos.
            </span>

            <Button
              variant="primary"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Enviando Solicitud...' : 'Enviar Solicitud Directa →'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
