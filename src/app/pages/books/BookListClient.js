"use client";

import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchAndSortControls from '@/app/components/SearchAndSortControls';
import ViewSwitcher from '@/app/components/ViewSwitcher';
import ContentDisplay from '@/app/components/ContentDisplay';
import Request from '@/app/components/request'; // Import Request

/**
 * BookListClient component for displaying and filtering a list of books.
 * @param {object} props - Component props.
 * @param {object} props.initialBooks - Initial list of books to display.
 * @returns {JSX.Element} The BookListClient component.
 */
export default function BookListClient({ initialBooks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Title', direction: 'ascending' });
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [minPages, setMinPages] = useState('');
  const [maxPages, setMaxPages] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const router = useRouter();

  // State to hold detailed book data fetched on demand
  const [detailedBooksData, setDetailedBooksData] = useState({});

  const bookColumns = [
    { key: 'title', label: 'Title', isLink: true },
    { key: 'authorsDisplay', label: 'Authors' },
    { key: 'yearDisplay', label: 'Year' }
  ];

  const uniqueYears = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const years = new Set(initialBooks.data.map(book => book.Year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
  }, [initialBooks]);

  const uniquePublishers = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const publishers = new Set(initialBooks.data.map(book => book.Publisher).filter(Boolean));
    return Array.from(publishers).sort();
  }, [initialBooks]);

  const handleResetFilters = () => {
    setSelectedYear('');
    setSelectedPublisher('');
    setMinPages('');
    setMaxPages('');
  };

  // Function to fetch detailed data for a single book
  const fetchBookDetails = async (bookId) => {
    if (detailedBooksData[bookId] && !detailedBooksData[bookId].isLoading) {
      // console.log(`[INFO] BookListClient: Data for book ${bookId} already fetched or being fetched.`);
      return; // Already fetched or currently fetching
    }

    // console.log(`[INFO] BookListClient: Fetching details for book ${bookId}...`);
    setDetailedBooksData(prev => ({ ...prev, [bookId]: { isLoading: true } })); // Mark as loading

    try {
      const result = await Request(`book/${bookId}`); // Use the Request utility
      if (result && result.data) {
        // console.log(`[INFO] BookListClient: Successfully fetched details for book ${bookId}.`);
        setDetailedBooksData(prev => ({ ...prev, [bookId]: result.data }));
      } else {
        console.warn(`[WARN] BookListClient: No data returned for book ${bookId}. Result:`, result);
        setDetailedBooksData(prev => ({ ...prev, [bookId]: { error: true, isLoading: false } }));
      }
    } catch (error) {
      console.error(`[ERROR] BookListClient: Error fetching details for book ${bookId}:`, error);
      setDetailedBooksData(prev => ({ ...prev, [bookId]: { error: true, isLoading: false } }));
    }
  };


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
    
    return booksArray.map(book => {
      const details = detailedBooksData[book.id];
      return {
        id: book.id,
        title: book.Title,
        // Use detailed image URL if available, otherwise the one from initialBooks (which might be null or basic)
        imageUrl: (details && !details.isLoading && !details.error) ? (details.largeCoverImageUrl || details.coverImageUrl) : (book.coverImageUrl && book.coverImageUrl !== "NO_COVER_AVAILABLE" ? book.coverImageUrl : null),
        authorsDisplay: book.authors ? book.authors.join(', ') : (details && details.authors ? details.authors.join(', ') : 'Unknown Author'),
        yearDisplay: book.Year ? String(book.Year) : (details && details.Year ? String(details.Year) : 'Unknown Year'),
        linkUrl: `/pages/books/${book.id}`,
        // Pass through loading/error state if needed by ImageItem for more specific placeholders
        isLoading: details?.isLoading,
        hasError: details?.error,
      };
    });
  }, [initialBooks, searchTerm, sortConfig, selectedYear, selectedPublisher, minPages, maxPages, detailedBooksData]);

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
        <div className="hidden md:block md:w-1/8"></div>

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