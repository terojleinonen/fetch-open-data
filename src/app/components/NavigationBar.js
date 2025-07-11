'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NavigationBar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    // On mobile (default): full width, flex-col for header and links.
    // On desktop (md+): full width, flex-row, and padding for horizontal navbar.
    <nav className="w-full p-4 md:flex md:items-center md:justify-between shadow-md bg-background z-50 relative">
      {/* Header: Contains site title and hamburger menu toggle. Visible on all screen sizes. */}
      <div className="flex items-center justify-between">
        <div className="text-xl lg:text-2xl font-bold whitespace-nowrap">Stephen King Universe</div> {/* Updated title, reverted font size class */}
        <button
           className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--nav-link-focus-ring)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links Container:
          - Mobile: Toggles visibility, full width, specific background.
          - Desktop (md+): Always visible (flex), flex-col, no special background needed (inherits from nav).
      */}
      <div
        data-testid="nav-links-container"
        className={`${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } flex-col items-stretch space-y-2 mt-4 p-4 rounded-md shadow-lg mobile-menu-bg
           md:flex md:flex-row md:items-center md:space-y-0 md:space-x-1 md:mt-0 md:p-0 md:shadow-none md:bg-transparent w-full md:w-auto`}
      >
        <Link href="/" className={`text-sm lg:text-base font-bold py-2 px-3 rounded-md mobile-menu-link-hover nav-link-desktop-hover ${pathname === '/' ? 'underline' : ''}`} onClick={handleLinkClick}>
          HOME
        </Link>
        <Link href="/pages/books" className={`text-sm lg:text-base font-bold py-2 px-3 rounded-md mobile-menu-link-hover nav-link-desktop-hover ${pathname === '/pages/books' ? 'underline' : ''}`} onClick={handleLinkClick}>
          BOOKS
        </Link>
        <Link href="/pages/shorts" className={`text-sm lg:text-base font-bold py-2 px-3 rounded-md mobile-menu-link-hover nav-link-desktop-hover ${pathname === '/pages/shorts' ? 'underline' : ''}`} onClick={handleLinkClick}>
          SHORTS
        </Link>
        <Link href="/pages/adapted-works" className={`text-sm lg:text-base font-bold py-2 px-3 rounded-md mobile-menu-link-hover nav-link-desktop-hover ${pathname === '/pages/adapted-works' ? 'underline' : ''}`} onClick={handleLinkClick}>
          ADAPTED WORKS
        </Link>
        <Link href="/pages/villains" className={`text-sm lg:text-base font-bold py-2 px-3 rounded-md mobile-menu-link-hover nav-link-desktop-hover ${pathname === '/pages/villains' ? 'underline' : ''}`} onClick={handleLinkClick}>
          VILLAINS
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;
