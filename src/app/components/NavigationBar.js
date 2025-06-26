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
    <nav className="p-4 md:p-8 flex flex-col md:flex-row md:items-center md:space-x-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Stephen King Universe</div>
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {/* Simple SVG Hamburger Icon */}
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

      {/* Navigation Links: Hidden on mobile by default, shown when isMobileMenuOpen is true. Always visible on md+ */}
      <div
        data-testid="nav-links-container"
        className={`${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } mobile-menu-bg flex-col items-stretch space-y-2 mt-4 p-4 rounded-md shadow-lg md:bg-transparent md:shadow-none md:mt-0 md:flex md:flex-row md:items-center md:space-y-0 md:space-x-4 md:ml-auto w-full md:w-auto`}
      >
        <Link href="/" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover ${pathname === '/' ? 'underline' : ''}`} onClick={handleLinkClick}>
          HOME
        </Link>
        <Link href="/pages/books" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover ${pathname === '/pages/books' ? 'underline' : ''}`} onClick={handleLinkClick}>
          BOOKS
        </Link>
        <Link href="/pages/shorts" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover ${pathname === '/pages/shorts' ? 'underline' : ''}`} onClick={handleLinkClick}>
          SHORTS
        </Link>
        <Link href="/pages/villains" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover ${pathname === '/pages/villains' ? 'underline' : ''}`} onClick={handleLinkClick}>
          VILLAINS
        </Link>
        <Link href="/pages/google-books" className={`text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover ${pathname === '/pages/google-books' ? 'underline' : ''}`} onClick={handleLinkClick}>
          GOOGLE BOOKS
        </Link>
        <a href="https://stephenking.com" target="_blank" rel="noopener noreferrer" className="text-xl font-extrabold py-2 px-4 rounded-md mobile-menu-link-hover" onClick={handleLinkClick}>
          STEPHENKING.COM <span className="text-sm opacity-75">(Official Site)</span>
        </a>
      </div>
    </nav>
  );
};

export default NavigationBar;
