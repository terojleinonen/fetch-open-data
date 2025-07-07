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
  } else if (pathname === '/pages/about-stephen-king') {
    title = 'Kinggraphy'; // Updated title
  } else if (pathname === '/pages/adapted-works') {
    title = 'Adapted Works';
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
  // Applying consistent style for all titles, using theme-aware CSS variables for the gradient.
  const titleStyle = "text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-gradient-from)] via-[var(--title-gradient-via)] to-[var(--title-gradient-to)] py-2 hidden md:block";

  // The Google Books Explorer page has its own title.
  // This component will render titles for other pages.
  // If this PageTitle component is used in a layout that also includes the Google Books page,
  // returning null for that specific path prevents duplicate titles.
  if (pathname === '/pages/google-books') {
    return null;
  }

  return (
    <h1 className={titleStyle}>
      {title}
    </h1>
  );
};

export default PageTitle;
