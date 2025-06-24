import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout'; // Adjust path as necessary
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock NavigationBar component (used by ConditionalNavigationBar)
jest.mock('@/app/components/NavigationBar', () => {
  return function DummyNavigationBar() {
    return <div data-testid="navbar">NavigationBar</div>;
  };
});

// We are testing the behavior that RootLayout delegates to ConditionalNavigationBar
describe('RootLayout content based on path (via ConditionalNavigationBar)', () => {
  let ConditionalNavigationBar;
  let usePathname;

  beforeEach(() => {
    // Reset modules to ensure fresh mocks for each test
    jest.resetModules();

    // Re-require next/navigation and get usePathname
    const nextNavigation = require('next/navigation');
    usePathname = nextNavigation.usePathname;

    // Re-require ConditionalNavigationBar after mocks are set up
    ConditionalNavigationBar = require('@/app/components/ConditionalNavigationBar').default;
  });

  it('does not render NavigationBar when pathname is "/"', () => {
    usePathname.mockImplementation(() => '/');
    render(<ConditionalNavigationBar />);
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  it('renders NavigationBar when pathname is not "/"', () => {
    usePathname.mockImplementation(() => '/books');
    render(<ConditionalNavigationBar />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
