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
  return (
    <div className="pt-8">
      <h1 className="text-4xl md:text-6xl horror-headline pt-8">
        {title}
      </h1>
    </div>
  );
};
export default PageTitle;