"use client"; // This directive can be helpful in test files too, though not strictly necessary for this one.

import React from 'react';
import { render, screen } from '@testing-library/react';
import ConditionalNavigationBar from '../ConditionalNavigationBar';
import { usePathname } from 'next/navigation'; // To help with mocking
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock NavigationBar component
jest.mock('@/app/components/NavigationBar', () => {
  // The actual path to NavigationBar from ConditionalNavigationBar is '@/app/components/NavigationBar'
  // So, the mock path should match this.
  return function DummyNavigationBar() {
    return <div data-testid="mocked-navbar">MockedNavigationBar</div>;
  };
});

describe('ConditionalNavigationBar', () => {
  it('renders null when pathname is "/"', () => {
    usePathname.mockReturnValue('/');
    const { container } = render(<ConditionalNavigationBar />);
    expect(screen.queryByTestId('mocked-navbar')).not.toBeInTheDocument();
    // Check if the component renders nothing (or null)
    expect(container.firstChild).toBeNull();
  });

  it('renders NavigationBar when pathname is not "/"', () => {
    usePathname.mockReturnValue('/books');
    render(<ConditionalNavigationBar />);
    expect(screen.getByTestId('mocked-navbar')).toBeInTheDocument();
    expect(screen.getByText('MockedNavigationBar')).toBeInTheDocument();
  });
});
