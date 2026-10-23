import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { EditorialMenu } from '@/components/layout/EditorialMenu';
import { Button } from '@/components/ui/Button';

// Mock dialog HTML5 methods in JSDOM
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
  });
});

describe('Misión 005 — Kinetic Layout & Navigation Architecture', () => {
  describe('SiteHeader Component', () => {
    it('renders the DANY GLOCK artist wordmark and main navigation links', () => {
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
      expect(screen.getByText('Artist Digital Experience')).toBeDefined();

      // Verify desktop nav anchors
      expect(screen.getByRole('link', { name: 'Música' })).toBeDefined();
      expect(screen.getByRole('link', { name: 'Videos' })).toBeDefined();
      expect(screen.getByRole('link', { name: 'Shows' })).toBeDefined();
      expect(screen.getByRole('link', { name: 'Journal' })).toBeDefined();
      expect(screen.getByRole('link', { name: 'Press Kit' })).toBeDefined();

      // Verify booking CTA and menu trigger button
      expect(screen.getByRole('link', { name: /Booking/i })).toBeDefined();
      const menuButton = screen.getByRole('button', { name: /Abrir menú editorial/i });
      expect(menuButton).toBeDefined();
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles aria-expanded when clicking the menu trigger button', () => {
      render(<SiteHeader />);

      const menuButton = screen.getByRole('button', { name: /Abrir menú editorial/i });
      fireEvent.click(menuButton);
      expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('EditorialMenu Component', () => {
    it('renders all numbered editorial routes and handles close callback', () => {
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

      // Verify numbered editorial sections
      expect(screen.getByText('01')).toBeDefined();
      expect(screen.getByText('Música')).toBeDefined();
      expect(screen.getByText('02')).toBeDefined();
      expect(screen.getByText('Videografía')).toBeDefined();
      expect(screen.getByText('03')).toBeDefined();
      expect(screen.getByText('Tour & Shows')).toBeDefined();
      expect(screen.getByText('04')).toBeDefined();
      expect(screen.getByText('Journal')).toBeDefined();
      expect(screen.getByText('05')).toBeDefined();
      expect(screen.getByText('Press Kit (EPK)')).toBeDefined();
      expect(screen.getByText('06')).toBeDefined();
      expect(screen.getByText('Booking & Contacto')).toBeDefined();

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
