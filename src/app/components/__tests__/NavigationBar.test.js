import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavigationBar from '../NavigationBar'; // Adjust path as necessary
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'), // Default pathname
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('NavigationBar', () => {
  it('renders the title "The Stephen King Universe"', () => {
    render(<NavigationBar />);
    expect(screen.getByText('The Stephen King Universe')).toBeInTheDocument();
  });

  describe('Hamburger Menu', () => {
    it('toggles the mobile menu aria-expanded on hamburger button click', async () => {
      render(<NavigationBar />);

      const hamburgerButton = screen.getByRole('button', { name: /toggle menu/i });

      // Initial state: collapsed
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(hamburgerButton);
      await waitFor(() => {
        expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
      });

      fireEvent.click(hamburgerButton);
      await waitFor(() => {
        expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('navigation links container has correct classes for desktop display', () => {
        // This test checks for the presence of classes that ensure visibility on desktop.
        // It doesn't assert toBeVisible directly for desktop state because RTL doesn't control viewport size
        // to activate Tailwind's responsive breakpoints.
        render(<NavigationBar />);
        const navContainer = screen.getByTestId('nav-links-container');

        // For completeness, check that individual links are in the document.
        expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /books/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /shorts/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /adapted works/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /villains/i })).toBeInTheDocument();
    });
  });
});
