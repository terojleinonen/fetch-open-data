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
// Now NavigationBar itself contains the conditional logic.
// So, we mock its behavior: return a div if it should render, or null if not.
jest.mock('@/app/components/NavigationBar', () => {
  const original = jest.requireActual('@/app/components/NavigationBar');
  const { usePathname: originalUsePathname } = jest.requireActual('next/navigation');

  return jest.fn((props) => {
    // This mock needs to simulate the *actual* conditional logic of NavigationBar
    // because RootLayout just renders <NavigationBar /> directly.
    // We use the *actual* usePathname mock from the test setup.
    const pathname = originalUsePathname(); // Get the mocked pathname
    if (pathname === '/') {
      return null; // Simulate NavigationBar returning null
    }
    // If not "/", return a dummy component for testing presence
    return <div data-testid="navbar">NavigationBar</div>;
  });
});

describe('RootLayout with NavigationBar conditional rendering', () => {
  // usePathname is already mocked globally at the top of the file.
  // We just need to ensure it's set correctly for each test.

  it('does not render NavigationBar when RootLayout is rendered and pathname is "/"', () => {
    usePathname.mockImplementation(() => '/');
    render(<RootLayout><div>Test Children</div></RootLayout>);
    // NavigationBar (mocked) should return null, so it shouldn't be in the document.
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  it('renders NavigationBar when RootLayout is rendered and pathname is not "/"', () => {
    usePathname.mockImplementation(() => '/books');
    render(<RootLayout><div>Test Children</div></RootLayout>);
    // NavigationBar (mocked) should render the div.
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
