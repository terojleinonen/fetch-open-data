'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import "./NavigationBar.css";

const NavigationBar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-header">
        <Link href="/" className="nav-logo" onClick={(e) => { handleLinkClick(); scrollToSection(e, 'top', '/'); }}>The Stephen King Universe</Link>
        <button
           className="mobile-menu-button"
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

      <div
        data-testid="nav-links-container"
        className={`nav-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
      >
        <Link href="/pages/about-stephen-king" className={`nav-links-item ${pathname === '/pages/about-stephen-king' ? 'underline' : ''}`} onClick={handleLinkClick}>
          ABOUT
        </Link>
        <Link href="/pages/books" className={`nav-links-item ${pathname === '/pages/books' ? 'underline' : ''}`} onClick={handleLinkClick}>
          BOOKS
        </Link>
        <Link href="/pages/shorts" className={`nav-links-item ${pathname === '/pages/shorts' ? 'underline' : ''}`} onClick={handleLinkClick}>
          SHORTS
        </Link>
        <Link href="/pages/adapted-works" className={`nav-links-item ${pathname === '/pages/adapted-works' ? 'underline' : ''}`} onClick={handleLinkClick}>
          ADAPTED WORKS
        </Link>
        <Link href="/pages/villains" className={`nav-links-item ${pathname === '/pages/villains' ? 'underline' : ''}`} onClick={handleLinkClick}>
          VILLAINS
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;
