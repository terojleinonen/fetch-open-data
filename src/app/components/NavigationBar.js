'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NavLink = ({ href, title, summary, currentPathname, onClick }) => (
  <div className="flex flex-col items-start">
    <Link
      href={href}
      className={`text-lg font-bold py-2 px-4 rounded-md mobile-menu-link-hover nav-link-desktop-hover ${currentPathname === href ? 'underline' : ''}`}
      onClick={onClick}
    >
      {title}
    </Link>
    {summary && <p className="text-sm text-gray-600 px-4 pb-2">{summary}</p>}
  </div>
);

const NavigationBar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", title: "HOME", summary: "Return to the homepage." },
    { href: "/pages/books", title: "BOOKS", summary: "Explore a comprehensive list of Stephen King's novels." },
    { href: "/pages/shorts", title: "SHORTS", summary: "Discover Stephen King's captivating short stories and novellas." },
    { href: "/pages/villains", title: "VILLAINS", summary: "Delve into the dark world of Stephen King's most memorable villains." },
    { href: "/pages/google-books", title: "GOOGLE BOOKS", summary: "Search and browse Stephen King's works available on Google Books." },
    { href: "/pages/about-stephen-king", title: "ABOUT STEPHEN KING", summary: "Learn more about the life and career of the master of horror." },
    { href: "https://stephenking.com", title: "STEPHENKING.COM", summary: "Visit the official website for the latest news and updates.", isExternal: true },
  ];

  return (
    <nav className="w-full p-4 md:flex md:items-start md:justify-start shadow-md bg-background">
      {/* Hamburger menu toggle for mobile */}
      <div className="flex items-center justify-end md:hidden"> {/* Changed justify-between to justify-end */}
        <button
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--nav-link-focus-ring)]"
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

      {/* Navigation Links Container */}
      <div
        data-testid="nav-links-container"
        className={`${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } flex-col items-start space-y-1 mt-4 p-2 rounded-md shadow-lg mobile-menu-bg
           md:flex md:flex-col md:items-start md:space-y-1 md:mt-0 md:p-0 md:shadow-none md:bg-transparent w-full md:w-auto`}
      >
        {navLinks.map(link => (
          link.isExternal ? (
            <div key={link.href} className="flex flex-col items-start">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold py-2 px-4 rounded-md mobile-menu-link-hover nav-link-desktop-hover"
                onClick={handleLinkClick}
              >
                {link.title} <span className="text-sm opacity-75">(Official Site)</span>
              </a>
              {link.summary && <p className="text-sm text-gray-600 px-4 pb-2">{link.summary}</p>}
            </div>
          ) : (
            <NavLink
              key={link.href}
              href={link.href}
              title={link.title}
              summary={link.summary}
              currentPathname={pathname}
              onClick={handleLinkClick}
            />
          )
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
