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
  } else if (pathname === '/pages/google-books') {
    title = 'Google Books Explorer';
  }
  // Add more pages and titles here as needed

  if (!title) {
    return null; // Don't render anything if no title is matched
  }

  // Styling consistent with the previous static title in RootLayout, and responsive behavior
  // For "Google Books Explorer", the original page has a more complex, centered, gradient style.
  // We'll use a consistent style for all layout titles for now.
  // If specific pages need their own unique title styling like the original Google Books page,
  // that title should be part of the page's content itself rather than this layout component.
  const titleStyle = pathname === '/pages/google-books'
    ? "text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color-dark)] via-[var(--hover-accent-color-dark)] to-[var(--accent-color-dark)] py-2 hidden md:block"
    : "text-3xl font-bold mb-4 hidden md:block";


  // If the title is "Google Books Explorer", it's handled by its own page component.
  // This PageTitle component is for the titles that appear in the main layout.
  // Therefore, we will not render "Google Books Explorer" from here to avoid duplication.
  if (title === 'Google Books Explorer') {
      // The Google Books page has its own title within its component.
      // We return null here to avoid duplicating it if this PageTitle component is placed in the global layout.
      // Or, if the intent is to *replace* that one, this logic needs adjustment.
      // For now, assuming we don't want to duplicate.
      return null;
  }

  return (
    <h1 className={titleStyle}>
      {title}
    </h1>
  );
};

export default PageTitle;
