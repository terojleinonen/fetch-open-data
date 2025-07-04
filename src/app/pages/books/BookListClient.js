"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import SearchIcon from '../../../../public/search-icon.svg'; // Import the search icon
// import dynamic from 'next/dynamic'; // FilterPopup no longer dynamically imported

// const FilterPopup = dynamic(() => import('./FilterPopup'), { // FilterPopup component removed
//   suspense: true,
// });

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
   const [titleSortOrder, setTitleSortOrder] = useState('A-Z'); // 'A-Z' or 'Z-A'
   const [dateSortOrder, setDateSortOrder] = useState('Newest-Oldest'); // 'Newest-Oldest' or 'Oldest-Newest'
   const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [minPages, setMinPages] = useState('');
  const [maxPages, setMaxPages] = useState('');
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false); // This will be removed
  const router = useRouter();

  // Memoized lists for dropdowns (moved from FilterPopup)
  const uniqueYears = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const years = new Set(initialBooks.data.map(book => book.Year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a); // Descending order
  }, [initialBooks]);

  const uniquePublishers = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const publishers = new Set(initialBooks.data.map(book => book.Publisher).filter(Boolean));
    return Array.from(publishers).sort(); // Ascending order
  }, [initialBooks]);

  // Handler for resetting filters (moved and adapted from FilterPopup)
  const handleResetFilters = () => {
    setSelectedYear('');
    setSelectedPublisher('');
    setMinPages('');
    setMaxPages('');
    // setSearchTerm(''); // Optionally reset search term as well
    // setSortOrder('alphabetical'); // Optionally reset sort order
  };

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

    // Apply sorting
    if (titleSortOrder === 'A-Z') {
      booksArray.sort((a, b) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
    } else if (titleSortOrder === 'Z-A') {
      booksArray.sort((a, b) => b.Title.toLowerCase().localeCompare(a.Title.toLowerCase()));
    }

    if (dateSortOrder === 'Newest-Oldest') {
      // Assuming 'Year' can be used for date sorting, adjust if a more specific date field is available
      booksArray.sort((a, b) => (b.publishedDate || b.Year) - (a.publishedDate || a.Year));
    } else if (dateSortOrder === 'Oldest-Newest') {
      // Assuming 'Year' can be used for date sorting, adjust if a more specific date field is available
      booksArray.sort((a, b) => (a.publishedDate || a.Year) - (b.publishedDate || b.Year));
    }


    return booksArray;
  }, [initialBooks, searchTerm, titleSortOrder, dateSortOrder, selectedYear, selectedPublisher, minPages, maxPages]);

  if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) {
    return (
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold text-[var(--accent-color)] mb-4">সমস্যা</h1>
        <p className="text-[var(--text-color)]">Book data is currently unavailable or malformed. Please try again later. The filter menu has been temporarily disabled.</p>
      </div>
    );
  }

  return (
    <div className="py-12"> {/* Removed px-8 and transition classes */}
      {/* Main layout: Flex container for sidebar and content */}
      <div className="flex flex-col md:flex-row gap-6 md:justify-center">
        {/* Left Sidebar for Filters */}
        <div className="hidden md:block md:w-1/8 p-4 bg-[var(--background-color)] rounded-lg shadow self-start"> {/* Added self-start for alignment */}
          <h2 className="text-xl font-semibold text-[var(--text-color)] mb-4">Filters</h2>
          {/* Year Filter */}
          <div className="mb-4">
            <label htmlFor="filter-year" className="block text-sm font-medium text-[var(--text-color)] mb-1">Year</label>
            <select
              id="filter-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Publisher Filter */}
          <div className="mb-4">
            <label htmlFor="filter-publisher" className="block text-sm font-medium text-[var(--text-color)] mb-1">Publisher</label>
            <select
              id="filter-publisher"
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
              className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
            >
              <option value="">All Publishers</option>
              {uniquePublishers.map(publisher => (
                <option key={publisher} value={publisher}>{publisher}</option>
              ))}
            </select>
          </div>

          {/* Page Count Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Page Count</label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                id="filter-min-pages"
                name="filter-min-pages"
                placeholder="Min"
                value={minPages}
                onChange={(e) => setMinPages(e.target.value)}
                className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
                min="0"
              />
              <input
                type="number"
                id="filter-max-pages"
                name="filter-max-pages"
                placeholder="Max"
                value={maxPages}
                onChange={(e) => setMaxPages(e.target.value)}
                className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
                min="0"
              />
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            className="w-full bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] font-bold py-2 px-4 rounded"
          >
            Reset Filters
          </button>
        </div>

        {/* Main Content Area: Search, Sort, and Books List */}
        <div className="w-full md:w-6/8 px-4 md:px-0">
          {/* Search and Sort Controls */}
          <div className="controls-container mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
            {isSearchBarVisible ? (
              <div className="relative flex-grow">
                <input
                  type="text"
                  id="search-books-input"
                  name="search-books-input"
                  placeholder="Search books..."
                  className="w-full md:w-auto flex-grow p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] pl-10" // Add padding for icon
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image src={SearchIcon} alt="Search" width={20} height={20} />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchBarVisible(true)}
                className="p-2 h-10 rounded bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] flex items-center"
              >
                <Image src={SearchIcon} alt="Search" width={20} height={20} className="mr-2" />
                Search
              </button>
            )}
            {/* Sort by Title Button */}
            <button
              onClick={() => setTitleSortOrder(titleSortOrder === 'A-Z' ? 'Z-A' : 'A-Z')}
              className="p-2 h-10 rounded bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
            >
              Sort by Title: {titleSortOrder}
            </button>

            {/* Sort by Date Button */}
            <button
              onClick={() => setDateSortOrder(dateSortOrder === 'Newest-Oldest' ? 'Oldest-Newest' : 'Newest-Oldest')}
              className="p-2 h-10 rounded bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
            >
              Sort by Date: {dateSortOrder}
            </button>
            {/* Filter toggle button removed */}
          </div>

          {/* Books List Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Responsive grid */}
        {filteredBooks.map((book, index) => (
          <Link key={book.id} href={`/pages/books/${book.id}`} className="group bg-[var(--background-color)] rounded-lg shadow border border-black hover:border-black transition-all duration-300 ease-in-out flex flex-col overflow-hidden h-full hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black"> {/* Changed border to black and focus ring to black */}
            {/* Entire card is a link, so no separate key needed on the inner div if we remove it or change its role */}
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
                <div className="p-4 flex flex-col flex-grow bg-gray-700 text-gray-200"> {/* Dark background and light text for contrast */}
                     <h2 className="text-lg font-semibold text-red-500 mb-1 truncate" title={book.Title}> {/* Ensure title is visible and red */}
                        {book.Title}
                     </h2>
                     {book.authors && Array.isArray(book.authors) && book.authors.length > 0 && (
                        <p className="text-xs text-gray-300 mb-1 truncate" title={book.authors.join(', ')}> {/* Adjusted for dark bg */}
                            By: {book.authors.join(', ')}
                        </p>
                     )}
                     {/* Display publishedDate if available (from Google Books), otherwise fallback to Year */}
                     {book.publishedDate && <p className="text-xs text-gray-300 mb-1">Published: {book.publishedDate}</p>}
                     {!book.publishedDate && book.Year && <p className="text-xs text-gray-300 mb-1">Year: {book.Year}</p>}

                     {/* "View Details" link removed as the whole card is a link */}
                     {/* <div className="mt-auto pt-2">  */}
                        {/* <span className="text-sm text-[var(--accent-color)] font-medium">View Details</span> */}
                     {/* </div> */}
                 </div>
          </Link>
         ))}
     </div>
     {/* Display a message if no books match the search term */}
     {filteredBooks.length === 0 && searchTerm && (
         <p className="text-center text-[var(--text-color)] mt-4">No books found matching your search.</p>
     )}
          {/* Display a message if no books match the filters (excluding search) */}
          {filteredBooks.length === 0 && !searchTerm && (selectedYear || selectedPublisher || minPages || maxPages) && (
            <p className="text-center text-[var(--text-color)] mt-4">No books found matching your filter criteria.</p>
          )}
        </div> {/* End of Main Content Area */}

        {/* Right Empty Sidebar for spacing */}
        <div className="hidden md:block md:w-1/8"></div>
      </div> {/* End of Main Flex Container */}
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}