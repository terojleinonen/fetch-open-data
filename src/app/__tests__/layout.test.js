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
  return function DummyNavigationBar() {
    return <div data-testid="navbar">NavigationBar</div>;
  };
});

describe('RootLayout', () => {
  it('does not render NavigationBar when pathname is "/"', () => {
    usePathname.mockImplementation(() => '/');
    render(<RootLayout><div>Test Children</div></RootLayout>);
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  it('renders NavigationBar when pathname is not "/"', () => {
    usePathname.mockImplementation(() => '/books');
    render(<RootLayout><div>Test Children</div></RootLayout>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
