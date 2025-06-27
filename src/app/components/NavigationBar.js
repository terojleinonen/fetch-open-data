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
    // On desktop (md+): fixed width, flex-col, and padding for sidebar.
    <nav className="bg-background md:w-64 md:flex-shrink-0 p-4 md:h-screen md:overflow-y-auto">
      {/* Header: Contains site title and hamburger menu toggle. Visible on all screen sizes. */}
      <div className="flex items-center justify-between md:flex-col md:items-start">
        <div className="text-2xl font-bold mb-0 md:mb-4">Stephen King Universe</div>
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
        } mobile-menu-bg flex-col items-stretch space-y-2 mt-4 p-4 rounded-md shadow-lg
           md:flex md:bg-transparent md:shadow-none md:mt-0 md:p-0 md:space-y-2 w-full`}
      >
        <Link href="/" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover md:hover:bg-gray-700 ${pathname === '/' ? 'underline' : ''}`} onClick={handleLinkClick}>
          HOME
        </Link>
        <Link href="/pages/books" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover md:hover:bg-gray-700 ${pathname === '/pages/books' ? 'underline' : ''}`} onClick={handleLinkClick}>
          BOOKS
        </Link>
        <Link href="/pages/shorts" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover md:hover:bg-gray-700 ${pathname === '/pages/shorts' ? 'underline' : ''}`} onClick={handleLinkClick}>
          SHORTS
        </Link>
        <Link href="/pages/villains" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover md:hover:bg-gray-700 ${pathname === '/pages/villains' ? 'underline' : ''}`} onClick={handleLinkClick}>
          VILLAINS
        </Link>
        <Link href="/pages/google-books" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover md:hover:bg-gray-700 ${pathname === '/pages/google-books' ? 'underline' : ''}`} onClick={handleLinkClick}>
          GOOGLE BOOKS
        </Link>
        <Link href="/pages/about-stephen-king" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover md:hover:bg-gray-700 ${pathname === '/pages/about-stephen-king' ? 'underline' : ''}`} onClick={handleLinkClick}>
          ABOUT STEPHEN KING
        </Link>
        <a href="https://stephenking.com" target="_blank" rel="noopener noreferrer" className="text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover md:hover:bg-gray-700" onClick={handleLinkClick}>
          STEPHENKING.COM <span className="text-sm opacity-75">(Official Site)</span>
        </a>
      </div>
    </nav>
  );
};

export default NavigationBar;
