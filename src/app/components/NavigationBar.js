'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavigationBar = () => {
  const pathname = usePathname();

  return (
    <nav className="p-8 flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
      <Link href="/" className={`text-xl font-extrabold ${pathname === '/' ? 'underline' : ''}`}>
        HOME
      </Link>
      <Link href="/pages/books" className={`text-xl font-extrabold ${pathname === '/pages/books' ? 'underline' : ''}`}>
        BOOKS
      </Link>
      <Link href="/pages/shorts" className={`text-xl font-extrabold ${pathname === '/pages/shorts' ? 'underline' : ''}`}>
        SHORTS
      </Link>
      <Link href="/pages/villains" className={`text-xl font-extrabold ${pathname === '/pages/villains' ? 'underline' : ''}`}>
        VILLAINS
      </Link>
    </nav>
  );
};

export default NavigationBar;
