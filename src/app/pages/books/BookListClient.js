"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import dynamic from 'next/dynamic';

const FilterPopup = dynamic(() => import('./FilterPopup'), {
  suspense: true,
});

/**
 * BookListClient component for displaying and filtering a list of books.
 * @param {object} props - Component props.
 * @param {object} props.initialBooks - Initial list of books to display.
 * @returns {JSX.Element} The BookListClient component.
 */
export default function BookListClient({ initialBooks }) {
   // State variable for the search term
   const [searchTerm, setSearchTerm] = useState('');
   // State variable for the sort order
   const [sortOrder, setSortOrder] = useState('alphabetical');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [minPages, setMinPages] = useState('');
  const [maxPages, setMaxPages] = useState('');
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const router = useRouter();

  // Memoized variable for filtered books based on the search term and sort order
  const filteredBooks = useMemo(() => {
    if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) return [];

    const minPagesNumeric = minPages !== '' ? parseInt(minPages, 10) : null;
    const maxPagesNumeric = maxPages !== '' ? parseInt(maxPages, 10) : null;
    const yearNumeric = selectedYear !== '' ? parseInt(selectedYear, 10) : null;

    let booksArray = initialBooks.data.filter(book => {
      // Search term filter (existing)
      const searchTermMatch = book.Title.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchTermMatch) return false;

      // Year filter
      if (yearNumeric !== null && book.Year !== yearNumeric) {
        return false;
      }

      // Publisher filter
      if (selectedPublisher && book.Publisher && book.Publisher.toLowerCase() !== selectedPublisher.toLowerCase()) {
        return false;
      }

      // Min pages filter
      if (minPagesNumeric !== null && (!book.Pages || book.Pages < minPagesNumeric)) {
        return false;
      }

      // Max pages filter
      if (maxPagesNumeric !== null && (!book.Pages || book.Pages > maxPagesNumeric)) {
        return false;
      }

      return true;
    });

    if (sortOrder === 'alphabetical') {
      booksArray.sort((a, b) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
    } else if (sortOrder === 'year_newest_to_oldest') {
      booksArray.sort((a, b) => b.Year - a.Year);
    } else if (sortOrder === 'year_oldest_to_newest') {
      booksArray.sort((a, b) => a.Year - b.Year);
    }

    return booksArray;
  }, [initialBooks, searchTerm, sortOrder, selectedYear, selectedPublisher, minPages, maxPages]);

  if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) {
    return (
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold text-[var(--accent-color)] mb-4">সমস্যা</h1>
        <p className="text-[var(--text-color)]">Book data is currently unavailable or malformed. Please try again later. The filter menu has been temporarily disabled.</p>
      </div>
    );
  }

  return (
    <div className={`px-8 py-12 transition-[margin-right] duration-300 ease-in-out ${isFilterPopupOpen ? 'md:mr-80' : 'md:mr-0'}`}>
      
      {/* Search and Sort Controls */}
      <div className="controls-container mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
         <input
             type="text"
             id="search-books-input"
             name="search-books-input"
             placeholder="Search books..."
             className="w-full md:w-auto flex-grow p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
         <select
          id="sort-books-select"
          name="sort-books-select"
          className="p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="year_newest_to_oldest">Year (Newest to Oldest)</option>
          <option value="year_oldest_to_newest">Year (Oldest to Newest)</option>
        </select>
        <button
          onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)} // Toggle behavior
          className="bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] font-bold py-2 px-4 h-10 rounded"
        >
          Filters
        </button>
     </div>

      {isFilterPopupOpen && (
        <Suspense fallback={<div>Loading filters...</div>}>
          <FilterPopup
            isOpen={isFilterPopupOpen}
            initialBooks={initialBooks}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedPublisher={selectedPublisher}
            setSelectedPublisher={setSelectedPublisher}
            minPages={minPages}
            setMinPages={setMinPages}
            maxPages={maxPages}
            setMaxPages={setMaxPages}
            onApplyFilters={() => {
              console.log('Apply filters clicked');
              // Implement actual filter logic here in a future step
              setIsFilterPopupOpen(false);
            }}
            onResetFilters={() => {
              setSelectedYear('');
              setSelectedPublisher('');
              setMinPages('');
              setMaxPages('');
              console.log('Reset filters clicked');
              // Optionally, re-apply filters or close popup
            }}
            onClose={() => setIsFilterPopupOpen(false)}
          />
        </Suspense>
      )}

      {/* Books List Display */}
      {/* Renders the list of filtered books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Responsive grid */}
        {filteredBooks.map((book, index) => (
            <div key={book.id} className="group bg-[var(--background-color)] rounded-lg shadow border border-[var(--accent-color)] hover:border-[var(--hover-accent-color)] transition-all duration-300 ease-in-out flex flex-col overflow-hidden h-full hover:shadow-lg"> {/* Added h-full for consistent height and hover effect, ADDED group CLASS */}
                {/* Book Cover Image */}
                <div className="relative w-full h-72 flex items-center justify-center bg-neutral-700 overflow-hidden rounded-t-lg">
                  {book.coverImageUrl && book.coverImageUrl !== "NO_COVER_AVAILABLE" ? (
                    <Image
                      src={book.coverImageUrl}
                      alt={`Cover of ${book.Title}`}
                      fill
                      style={{ objectFit: "contain" }}
                      className="transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                      priority={index < 8} // Approximate priority with eager loading for first few images
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-neutral-500 text-sm"
                    >
                      No Image
                    </div>
                  )}
                </div>
                {/* Book Details */}
                <div className="p-4 flex flex-col flex-grow"> {/* Added flex-grow to push content to bottom if needed */}
                     <h2 className="text-lg font-semibold text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] mb-1 truncate" title={book.Title}> {/* Truncate title */}
                         <Link href={`/pages/books/${book.id}`}>
                             {book.Title}
                         </Link>
                     </h2>
                     {book.authors && Array.isArray(book.authors) && book.authors.length > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate" title={book.authors.join(', ')}> {/* Truncate authors */}
                            By: {book.authors.join(', ')}
                        </p>
                     )}
                     {/* Display publishedDate if available (from Google Books), otherwise fallback to Year */}
                     {book.publishedDate && <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Published: {book.publishedDate}</p>}
                     {!book.publishedDate && book.Year && <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Year: {book.Year}</p>}

                     <div className="mt-auto pt-2"> {/* Pushes the link to the bottom */}
                        <Link href={`/pages/books/${book.id}`} className="text-sm text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] font-medium">
                            View Details
                        </Link>
                     </div>
                 </div>
             </div>
         ))}
     </div>
     {/* Display a message if no books match the search term */}
     {filteredBooks.length === 0 && searchTerm && (
         <p className="text-center text-[var(--text-color)] mt-4">No books found matching your search.</p>
     )}
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}