"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import Image from 'next/image'; // No longer directly used here, ContentDisplay handles images
import SearchAndSortControls from '@/app/components/SearchAndSortControls';
import ViewSwitcher from '@/app/components/ViewSwitcher'; // Added
import ContentDisplay from '@/app/components/ContentDisplay'; // Added


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
   // New sortConfig state for SearchAndSortControls
   const [sortConfig, setSortConfig] = useState({ key: 'Title', direction: 'ascending' });
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [minPages, setMinPages] = useState('');
  const [maxPages, setMaxPages] = useState('');
  const [currentView, setCurrentView] = useState('grid'); // Added state for view, default to grid
  const router = useRouter();

  const bookColumns = [
    { key: 'title', label: 'Title', isLink: true },
    { key: 'authorsDisplay', label: 'Authors' },
    { key: 'yearDisplay', label: 'Year' }
  ];

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

  // Memoized variable for filtered and processed books
  const processedBooks = useMemo(() => {
    if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) return [];

    const minPagesNumeric = minPages !== '' ? parseInt(minPages, 10) : null;
    const maxPagesNumeric = maxPages !== '' ? parseInt(maxPages, 10) : null;
    const yearNumeric = selectedYear !== '' ? parseInt(selectedYear, 10) : null;

    let booksArray = initialBooks.data.filter(book => {
      const searchTermMatch = book.Title.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchTermMatch) return false;
      if (yearNumeric !== null && book.Year !== yearNumeric) return false;
      if (selectedPublisher && book.Publisher && book.Publisher.toLowerCase() !== selectedPublisher.toLowerCase()) return false;
      if (minPagesNumeric !== null && (!book.Pages || book.Pages < minPagesNumeric)) return false;
      if (maxPagesNumeric !== null && (!book.Pages || book.Pages > maxPagesNumeric)) return false;
      return true;
    });

    if (sortConfig.key) {
      booksArray.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'Year') {
          valA = parseInt(valA, 10) || 0;
          valB = parseInt(valB, 10) || 0;
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    
    // Transform data for ContentDisplay (List and Grid views)
    return booksArray.map(book => ({
      id: book.id,
      title: book.Title,
      // For GridView
      imageUrl: book.coverImageUrl && book.coverImageUrl !== "NO_COVER_AVAILABLE" ? book.coverImageUrl : null,
      // For ListView (tabular)
      authorsDisplay: book.authors ? book.authors.join(', ') : 'Unknown Author',
      yearDisplay: book.Year ? String(book.Year) : 'Unknown Year',
      // For general linking
      linkUrl: `/pages/books/${book.id}`,
      // The 'description' field for ListItem (if it were still generic) is now split into authorsDisplay and yearDisplay for the table.
      // If ImageItem needs a description, it would typically use the 'title' or we could add a specific one.
      // For ListItem (if it were still the old version), it would need this combined description:
      // description: `${book.authors ? book.authors.join(', ') : 'Unknown Author'} - ${book.Year || 'Unknown Year'}`,
    }));
  }, [initialBooks, searchTerm, sortConfig, selectedYear, selectedPublisher, minPages, maxPages]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) {
    return (
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold text-[var(--accent-color)] mb-4">সমস্যা</h1>
        <p className="text-[var(--text-color)]">Book data is currently unavailable or malformed. Please try again later. The filter menu has been temporarily disabled.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-6 md:justify-center">
        {/* Left Sidebar for Filters */}
        <div className="hidden md:block md:w-1/8 p-4 bg-[var(--background-color)] rounded-lg shadow self-start">
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
          
          <button
            onClick={handleResetFilters}
            className="w-full bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] font-bold py-2 px-4 rounded"
          >
            Reset Filters
          </button>
        </div>

        {/* Main Content Area: Search, Sort, ViewSwitcher, and ContentDisplay */}
        <div className="w-full md:w-6/8 px-4 md:px-0">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:space-x-2">
            <div className="flex-grow w-full sm:w-auto">
              <SearchAndSortControls
                searchTerm={searchTerm}
                sortConfig={sortConfig}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onRequestSort={requestSort}
                sortOptions={[
                  { key: 'Title', label: 'Title', title: 'Title' },
                  { key: 'Year', label: 'Year', year: 'Year' }
                ]}
                searchPlaceholder="Search by book title..."
              />
            </div>
            <div className="mt-2 sm:mt-0">
                <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
            </div>
          </div>

          <ContentDisplay items={processedBooks} view={currentView} columns={bookColumns} />

          {processedBooks.length === 0 && searchTerm && (
            <p className="text-center text-[var(--text-color)] mt-4">No books found matching your search.</p>
          )}
          {processedBooks.length === 0 && !searchTerm && (selectedYear || selectedPublisher || minPages || maxPages) && (
            <p className="text-center text-[var(--text-color)] mt-4">No books found matching your filter criteria.</p>
          )}
           {processedBooks.length === 0 && !searchTerm && !selectedYear && !selectedPublisher && !minPages && !maxPages && initialBooks?.data?.length > 0 && (
            <p className="text-center text-[var(--text-color)] mt-4">No books to display with current filters. Try broadening your criteria.</p>
          )}
           {initialBooks?.data?.length === 0 && (
             <p className="text-center text-[var(--text-color)] mt-4">There are no books to display at the moment.</p>
           )}
        </div>

        {/* Right Empty Sidebar for spacing */}
        <div className="hidden md:block md:w-1/8"></div>
      </div>
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}