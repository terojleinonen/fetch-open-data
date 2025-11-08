import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout'; // Adjust path as necessary
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock NavigationBar component
jest.mock('@/app/components/NavigationBar', () => {
  const { usePathname: mockUsePathname } = require('next/navigation');
  return jest.fn(() => {
    const pathname = mockUsePathname();
    if (pathname === '/') {
      return null;
    }
    return <div data-testid="navbar">NavigationBar</div>;
  });
});

describe('RootLayout with NavigationBar conditional rendering', () => {
  it('does not render NavigationBar when RootLayout is rendered and pathname is "/"', () => {
    usePathname.mockImplementation(() => '/');
    render(<RootLayout>Test Children</RootLayout>);
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  it('renders NavigationBar when RootLayout is rendered and pathname is not "/"', () => {
    usePathname.mockImplementation(() => '/books');
    render(<RootLayout>Test Children</RootLayout>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
