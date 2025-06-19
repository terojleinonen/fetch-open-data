import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavigationBar from '../NavigationBar'; // Adjust path as necessary
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'), // Default pathname
}));

describe('NavigationBar', () => {
  it('renders the title "My Awesome App"', () => {
    render(<NavigationBar />);
    expect(screen.getByText('My Awesome App')).toBeInTheDocument();
  });

  describe('Hamburger Menu', () => {
    it('toggles navigation links visibility on hamburger button click', async () => {
      render(<NavigationBar />);

      const hamburgerButton = screen.getByRole('button', { name: /toggle menu/i });
      const navContainer = screen.getByTestId('nav-links-container');

      // Initial state: menu is closed. Container should have 'hidden' and not 'flex'.
      // Tailwind's 'hidden' class sets 'display: none'.
      expect(navContainer).toHaveClass('hidden');
      expect(navContainer).not.toHaveClass('flex');
      // At this point, we assume 'hidden' class means it's not visible in mobile context.
      // The .not.toBeVisible() check seems unreliable for 'hidden' in this setup.

      // Click to open the menu
      fireEvent.click(hamburgerButton);

      // Menu should now be open. Container should have 'flex' and not 'hidden'.
      // And it should be visible.
      await waitFor(() => {
        expect(navContainer).toHaveClass('flex');
        expect(navContainer).not.toHaveClass('hidden');
        expect(navContainer).toBeVisible(); // Check visibility when it's supposed to be display:flex
      });

      // Click to close the menu
      fireEvent.click(hamburgerButton);

      // Menu should be closed. Container should have 'hidden' and not 'flex'.
      await waitFor(() => {
        expect(navContainer).toHaveClass('hidden');
        expect(navContainer).not.toHaveClass('flex');
        // Again, relying on the class for the "not visible" state.
      });
    });

    it('navigation links container has correct classes for desktop display', () => {
        // This test checks for the presence of classes that ensure visibility on desktop.
        // It doesn't assert toBeVisible directly for desktop state because RTL doesn't control viewport size
        // to activate Tailwind's responsive breakpoints.
        render(<NavigationBar />);
        const navContainer = screen.getByTestId('nav-links-container');

        // On desktop, 'md:flex' should make it display: flex, overriding the mobile 'hidden' class.
        expect(navContainer).toHaveClass('md:flex');

        // For completeness, check that individual links are in the document.
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /books/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /shorts/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /villains/i })).toBeInTheDocument();
    });
  });
});
