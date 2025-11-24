'use client';

import { usePathname } from 'next/navigation';

const PageTitle = () => {
  const pathname = usePathname();

  let title = null;

  // Determine title based on pathname
  if (pathname === '/pages/books') {
    title = 'Books';
  } else if (pathname === '/pages/shorts') {
    title = 'Short Stories';
  } else if (pathname === '/pages/villains') {
    title = 'Villains';
  } else if (pathname === '/pages/about-stephen-king') {
    title = 'About Stephen King'; // Updated title
  } else if (pathname === '/pages/adapted-works') {
    title = 'Adapted Works';
  }
  // Add more pages and titles here as needed

  if (!title) {
    return null; // Don't render anything if no title is matched
  }
  // Determine if this page should use the horror-style headline
  const isHorror = pathname === '/pages/books' || pathname === '/pages/adapted-works' || pathname === '/pages/shorts' || pathname === '/pages/villains';

  const baseClasses = 'mb-8 py-2 text-center pt-8';

  const normalTitle = `${baseClasses} text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-gradient-from)] via-[var(--title-gradient-via)] to-[var(--title-gradient-to)]`;

  const horrorTitle = `${baseClasses} text-4xl md:text-6xl horror-headline`;

  return (
    <h1 className={isHorror ? horrorTitle : normalTitle}>
      {title}
    </h1>
  );
};

export default PageTitle;
