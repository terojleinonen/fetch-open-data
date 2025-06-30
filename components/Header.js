"use client"; // Required because this component uses the useRouter hook

import Link from 'next/link';
import { useRouter } from 'next/router'; // To style active links

const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} legacyBehavior>
      <a
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-classic-red text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                    md:text-base`} // Slightly larger text on medium screens up
      >
        {children}
      </a>
    </Link>
  );
};

const Header = () => {
  // Placeholder for mobile menu state
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/books', label: 'Books' },
    { href: '/shorts', label: 'Shorts' },
    { href: '/villains', label: 'Villains' },
    { href: '/google-books', label: 'Google Books' },
    { href: '/about', label: 'About SK' },
  ];

  return (
    <header className="bg-dark-gray shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Site Title/Logo */}
          <div className="flex-shrink-0">
            <Link href="/" legacyBehavior>
              <a className="text-classic-red hover:text-red-700 text-2xl font-bold">
                SK Fan Hub
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.label} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button (placeholder) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              // onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false" // This would be dynamic with state
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              {/* Heroicon name: outline/menu */}
              {/* <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} ... /> */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              {/* Icon when menu is open. */}
              {/* Heroicon name: outline/x */}
              {/* <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} ... /> */}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state (placeholder) */}
      {/* <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <NavLink key={item.label + "-mobile"} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div> */}
    </header>
  );
};

export default Header;
