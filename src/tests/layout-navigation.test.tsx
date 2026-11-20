import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { EditorialMenu } from '@/components/layout/EditorialMenu';
import { Button } from '@/components/ui/Button';
import { getDesktopNavItems, getNavigationItems } from '@/lib/navigation';

let mockPathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// Mock dialog HTML5 methods in JSDOM
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
  });
});

afterEach(() => {
  mockPathname = '/';
  cleanup();
});

describe('Misión 005 / 006-C.3 — Kinetic Layout & Unified Navigation Architecture', () => {
  describe('Navigation Contract & Anchor Integrity', () => {
    it('mantiene paridad entre escritorio, menú editorial y footer sin enlaces rotos', () => {
      const withoutHistory = getNavigationItems(false);
      expect(withoutHistory.map((i) => i.href)).toEqual([
        '/#musica',
        '/#videos',
        '/biografia',
        '/#tour',
        '/booking',
        '/#contacto',
      ]);

      const withHistory = getNavigationItems(true);
      expect(withHistory.map((i) => i.href)).toEqual([
        '/#musica',
        '/#videos',
        '/biografia',
        '/#tour',
        '/escenarios',
        '/booking',
        '/#contacto',
      ]);

      // Ningún enlace roto ni ruta privada expuesta
      const allHrefs = withHistory.map((i) => i.href);
      expect(allHrefs).not.toContain('/#journal');
      expect(allHrefs).not.toContain('/#press-kit');
      expect(allHrefs).not.toContain('/epk');
      expect(allHrefs).not.toContain('/admin');

      // Escritorio incluye todo excepto Booking (que va como CTA destacado a la derecha)
      expect(getDesktopNavItems(true).map((i) => i.href)).toEqual([
        '/#musica',
        '/#videos',
        '/biografia',
        '/#tour',
        '/escenarios',
        '/#contacto',
      ]);
    });

    it('todas las anclas de la home apuntan a IDs reales existentes en page.tsx', () => {
      const homeSource = fs.readFileSync(path.resolve('src/app/(public)/page.tsx'), 'utf8');
      const anchors = getNavigationItems(true)
        .filter((i) => i.href.startsWith('/#'))
        .map((i) => i.href.slice(2));
      for (const anchor of anchors) {
        expect(homeSource, `Falta id="${anchor}" en src/app/(public)/page.tsx`).toContain(`id="${anchor}"`);
      }
    });
  });

  describe('SiteHeader Component', () => {
    it('renders the DANY GLOCK artist wordmark and unified desktop navigation links', () => {
      render(
        <SiteHeader
          socialLinks={{
            instagram: 'https://instagram.com/danyglock',
            spotify: 'https://spotify.com/artist/danyglock',
          }}
          bookingEmail="booking@danyglock.com"
        />
      );

      // Verify artist identity
      expect(screen.getByText('DANY GLOCK')).toBeDefined();
      expect(screen.getByText('Sitio Oficial')).toBeDefined();

      // Verify desktop nav links & destinations
      expect(screen.getByRole('link', { name: 'Música' }).getAttribute('href')).toBe('/#musica');
      expect(screen.getByRole('link', { name: 'Videos' }).getAttribute('href')).toBe('/#videos');
      expect(screen.getByRole('link', { name: 'El artista' }).getAttribute('href')).toBe('/biografia');
      expect(screen.getByRole('link', { name: 'Shows' }).getAttribute('href')).toBe('/#tour');
      expect(screen.getByRole('link', { name: 'Contacto' }).getAttribute('href')).toBe('/#contacto');
      expect(screen.queryByRole('link', { name: 'Trayectoria' })).toBeNull();

      // Verify booking CTA and menu trigger button
      expect(screen.getByRole('link', { name: /Booking/i }).getAttribute('href')).toBe('/booking');
      const menuButton = screen.getByRole('button', { name: /Abrir menú editorial/i });
      expect(menuButton).toBeDefined();
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('muestra Trayectoria (/escenarios) en escritorio cuando hay eventos históricos publicados', () => {
      mockPathname = '/escenarios';
      render(<SiteHeader showStageHistory={true} />);
      const link = screen.getByRole('link', { name: 'Trayectoria' });
      expect(link.getAttribute('href')).toBe('/escenarios');
      expect(link.getAttribute('aria-current')).toBe('page');
    });

    it('toggles aria-expanded when clicking the menu trigger button', () => {
      render(<SiteHeader />);

      const menuButton = screen.getByRole('button', { name: /Abrir menú editorial/i });
      fireEvent.click(menuButton);
      expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('EditorialMenu Component', () => {
    it('renders all numbered editorial routes without broken links and handles close callback', () => {
      const handleClose = vi.fn();

      render(
        <EditorialMenu
          isOpen={true}
          onClose={handleClose}
          socialLinks={{
            instagram: 'https://instagram.com/danyglock',
            spotify: 'https://spotify.com/artist/danyglock',
          }}
          bookingEmail="booking@danyglock.com"
        />
      );

      // Verify numbered editorial sections (sin Trayectoria cuando showStageHistory = false)
      expect(screen.getByText('01')).toBeDefined();
      expect(screen.getByText('Música')).toBeDefined();
      expect(screen.getByText('02')).toBeDefined();
      expect(screen.getByText('Videos')).toBeDefined();
      expect(screen.getByText('03')).toBeDefined();
      expect(screen.getByText('El artista')).toBeDefined();
      expect(screen.getByText('04')).toBeDefined();
      expect(screen.getByText('Shows')).toBeDefined();
      expect(screen.getByText('05')).toBeDefined();
      expect(screen.getByText('Booking')).toBeDefined();
      expect(screen.getByText('06')).toBeDefined();
      expect(screen.getByText('Contacto')).toBeDefined();
      expect(screen.queryByText('Journal')).toBeNull();
      expect(screen.queryByText('Trayectoria')).toBeNull();

      // Verify close button triggers onClose callback
      const closeButton = screen.getByRole('button', { name: /Cerrar menú editorial/i });
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('triggers onClose when an editorial nav link is clicked', () => {
      const handleClose = vi.fn();

      render(
        <EditorialMenu
          isOpen={true}
          onClose={handleClose}
        />
      );

      const musicaLink = screen.getByRole('link', { name: /01 Música/i });
      fireEvent.click(musicaLink);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Polymorphic Component', () => {
    it('renders an HTML button element when no href is supplied', () => {
      render(<Button variant="primary">Acción Estándar</Button>);
      const btn = screen.getByRole('button', { name: 'Acción Estándar' });
      expect(btn).toBeDefined();
      expect(btn.tagName).toBe('BUTTON');
    });

    it('renders an HTML anchor element with correct href when href is supplied', () => {
      render(
        <Button variant="secondary" href="#musica">
          Explorar Discografía
        </Button>
      );
      const link = screen.getByRole('link', { name: 'Explorar Discografía' });
      expect(link).toBeDefined();
      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toBe('#musica');
    });
  });
});
