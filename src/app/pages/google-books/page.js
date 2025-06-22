'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GoogleBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base data from API
  const [allFetchedBooks, setAllFetchedBooks] = useState([]);
  // Data to display after filtering and sorting
  const [displayedBooks, setDisplayedBooks] = useState([]);

  // Search, Sort, Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'relevance', direction: 'desc' }); // API default is relevance
  const [filters, setFilters] = useState({
    publishYear: '',
    pageCountMin: '',
    pageCountMax: '',
    publisher: '',
    language: '',
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for startIndex for API
  const [totalItemsFromAPI, setTotalItemsFromAPI] = useState(0); // Total items from API for a given query
  const booksPerPage = 20; // Max results per API call

  // State Initialization from sessionStorage (runs once on mount)
  useEffect(() => {
    const savedSearchQuery = sessionStorage.getItem('googleBooks_searchQuery');
    if (savedSearchQuery) setSearchQuery(JSON.parse(savedSearchQuery));

    const savedSortConfig = sessionStorage.getItem('googleBooks_sortConfig');
    if (savedSortConfig) setSortConfig(JSON.parse(savedSortConfig));

    const savedFilters = sessionStorage.getItem('googleBooks_filters');
    if (savedFilters) setFilters(JSON.parse(savedFilters));

    const savedCurrentPage = sessionStorage.getItem('googleBooks_currentPage');
    if (savedCurrentPage) setCurrentPage(JSON.parse(savedCurrentPage));

    // We set loading to false *after* attempting to load state and *before* the first API fetch useEffect runs,
    // or let the API fetch useEffect handle its own loading state.
    // For simplicity, the API fetch will set loading true then false.
    // If all values are loaded from sessionStorage, the API fetch will use them.
  }, []);


  // Save state to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('googleBooks_searchQuery', JSON.stringify(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('googleBooks_sortConfig', JSON.stringify(sortConfig));
  }, [sortConfig]);

  useEffect(() => {
    sessionStorage.setItem('googleBooks_filters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    sessionStorage.setItem('googleBooks_currentPage', JSON.stringify(currentPage));
  }, [currentPage]);


  // This useEffect will be responsible for fetching books from the API
  useEffect(() => {
    // Only fetch if not loading initial state from session or if critical states are defined
    // This check helps prevent fetching with default/empty states if session state is pending
    // However, the initial load from session is synchronous if sessionStorage is fast.
    // The main fetch depends on searchQuery, currentPage, sortConfig.key.
    // If these are correctly initialized from session, the first fetch will use them.

    const fetchBooksFromAPI = async () => {
      setLoading(true);
      setError(null);

      let apiQueryParts = ['inauthor:stephen king'];
      // Ensure searchQuery is a string before calling trim, especially if loaded from session as null
      const currentSearchQuery = typeof searchQuery === 'string' ? searchQuery : '';
      if (currentSearchQuery.trim() !== '') {
        apiQueryParts.push(`intitle:${currentSearchQuery.trim()}`);
      }

      const queryString = apiQueryParts.join('+');
      const startIndex = currentPage * booksPerPage;
      let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(queryString)}&startIndex=${startIndex}&maxResults=${booksPerPage}`;

      if (sortConfig.key === 'newest') {
        apiUrl += `&orderBy=newest`;
      } else {
        apiUrl += `&orderBy=relevance`;
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllFetchedBooks(data.items || []);
        setTotalItemsFromAPI(data.totalItems || 0);
      } catch (err) {
        setError(err.message);
        setAllFetchedBooks([]);
        setTotalItemsFromAPI(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksFromAPI();
  }, [searchQuery, currentPage, sortConfig.key]); // sortConfig.key because only API relevant keys trigger refetch

  // This useEffect will handle client-side filtering and sorting
  useEffect(() => {
    let booksToProcess = [...allFetchedBooks];

    // Apply Filters
    if (filters.publishYear) {
      booksToProcess = booksToProcess.filter(book =>
        book.volumeInfo.publishedDate && book.volumeInfo.publishedDate.startsWith(filters.publishYear)
      );
    }
    if (filters.pageCountMin) {
      const minPages = parseInt(filters.pageCountMin, 10);
      if (!isNaN(minPages)) {
        booksToProcess = booksToProcess.filter(book =>
          book.volumeInfo.pageCount && book.volumeInfo.pageCount >= minPages
        );
      }
    }
    if (filters.pageCountMax) {
      const maxPages = parseInt(filters.pageCountMax, 10);
      if (!isNaN(maxPages)) {
        booksToProcess = booksToProcess.filter(book =>
          book.volumeInfo.pageCount && book.volumeInfo.pageCount <= maxPages
        );
      }
    }
    if (filters.publisher) {
      const publisherLower = filters.publisher.toLowerCase();
      booksToProcess = booksToProcess.filter(book =>
        book.volumeInfo.publisher && book.volumeInfo.publisher.toLowerCase().includes(publisherLower)
      );
    }
    if (filters.language) {
      const langLower = filters.language.toLowerCase();
      booksToProcess = booksToProcess.filter(book =>
        book.volumeInfo.language && book.volumeInfo.language.toLowerCase() === langLower
      );
    }

    // Apply Client-Side Sorting (if not handled by API)
    if (sortConfig.key !== 'relevance' && sortConfig.key !== 'newest') { // These are API-handled sort keys
      booksToProcess.sort((a, b) => {
        let valA, valB;

        if (sortConfig.key === 'title') {
          valA = a.volumeInfo.title?.toLowerCase() || '';
          valB = b.volumeInfo.title?.toLowerCase() || '';
        } else if (sortConfig.key === 'publishedDate') {
          // For publishedDate, handle potentially incomplete dates (e.g., "YYYY" or "YYYY-MM")
          // We'll sort them as strings, which is usually fine for YYYY or YYYY-MM-DD formats.
          // For more robust date sorting, parsing into Date objects would be needed.
          valA = a.volumeInfo.publishedDate || '';
          valB = b.volumeInfo.publishedDate || '';
        }
        // Add other sortable keys here if needed

        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    // Note: if sortConfig.key is 'newest' or 'relevance', the API already sorted.
    // If client-side 'publishedDate' sort is selected with direction 'desc',
    // and API sort was 'newest', the order might be subtly different if API 'newest'
    // uses more precise timestamp data not available client-side.
    // Our client-side 'publishedDate' sort is based on the string date.

    setDisplayedBooks(booksToProcess);
  }, [allFetchedBooks, filters, sortConfig]);


  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(0, prevPage - 1)); // Prevent going below page 0
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading books...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error fetching books: {error}</div>;
  }

  // Calculate total pages based on totalItemsFromAPI (for API pagination)
  // Or, if we were doing purely client-side pagination after one large fetch, it would be based on displayedBooks.length.
  // For now, pagination is still tied to API responses.
  const totalPages = Math.ceil(totalItemsFromAPI / booksPerPage);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    // Optional: Trigger search on type, perhaps with debounce. For now, explicit trigger or useEffect handles it.
    // To ensure search resets pagination:
    setCurrentPage(0);
  };

  // Placeholder for a more formal search submission if needed, though useEffect handles it.
  // const handleSearchSubmit = (event) => {
  //   event.preventDefault();
  //   setCurrentPage(0); // Reset to first page on new search
  //   // The useEffect for fetchBooksFromAPI will pick up the searchQuery change
  // };

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    setCurrentPage(0); // Reset to first page when sort changes, especially if API sort key changes
  };

  const sortOptions = [
    { key: 'relevance', direction: 'desc', label: 'Relevance' }, // API handled
    { key: 'newest', direction: 'desc', label: 'Newest First' }, // API handled
    { key: 'title', direction: 'asc', label: 'Title (A-Z)' }, // Client-side
    { key: 'title', direction: 'desc', label: 'Title (Z-A)' }, // Client-side
    { key: 'publishedDate', direction: 'asc', label: 'Year (Oldest First)' }, // Client-side
    { key: 'publishedDate', direction: 'desc', label: 'Year (Newest First)' }, // Client-side (distinct from API 'newest' if we want to sort current page only)
  ];

  // Helper to determine if a sort button is active
  const isSortActive = (key, direction) => {
    return sortConfig.key === key && sortConfig.direction === direction;
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(0); // Reset to first page when filters change, as results will differ
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setFilters({
      publishYear: '',
      pageCountMin: '',
      pageCountMax: '',
      publisher: '',
      language: '',
    });
    setSortConfig({ key: 'relevance', direction: 'desc' }); // Reset to default sort
    setCurrentPage(0);
  };

  const getActiveFiltersForDisplay = () => {
    const active = [];
    if (searchQuery) active.push(`Search: "${searchQuery}"`);
    if (filters.publishYear) active.push(`Year: ${filters.publishYear}`);
    if (filters.pageCountMin) active.push(`Min Pages: ${filters.pageCountMin}`);
    if (filters.pageCountMax) active.push(`Max Pages: ${filters.pageCountMax}`);
    if (filters.publisher) active.push(`Publisher: "${filters.publisher}"`);
    if (filters.language) active.push(`Lang: ${filters.language}`);

    // Display for sort
    const currentSortOption = sortOptions.find(opt => opt.key === sortConfig.key && opt.direction === sortConfig.direction);
    if (currentSortOption && (currentSortOption.key !== 'relevance' || searchQuery)) { // Show sort if not default relevance or if search is active
        active.push(`Sort: ${currentSortOption.label}`);
    } else if (currentSortOption && currentSortOption.key === 'relevance' && !searchQuery) {
        // Don't show "Sort: Relevance" if it's the default and no search query is active
    }


    return active;
  };

  const activeFiltersForDisplay = getActiveFiltersForDisplay();


  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Stephen King Books Explorer</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search by title (e.g., The Shining)"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        {/* Sort and Filter controls area */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
          {/* Sort Options */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Sort Options</h2>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(opt => (
                <button
                  key={`${opt.key}-${opt.direction}`}
                  onClick={() => handleSortChange(opt.key, opt.direction)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    ${isSortActive(opt.key, opt.direction)
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Options */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
              {/* Publish Year */}
              <div>
                <label htmlFor="filterPublishYear" className="block text-sm font-medium text-gray-600 mb-1">Publish Year</label>
                <input
                  type="number"
                  id="filterPublishYear"
                  name="publishYear"
                  value={filters.publishYear}
                  onChange={(e) => handleFilterChange('publishYear', e.target.value)}
                  placeholder="e.g., 1984"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Page Count Min */}
              <div>
                <label htmlFor="filterPageCountMin" className="block text-sm font-medium text-gray-600 mb-1">Min Pages</label>
                <input
                  type="number"
                  id="filterPageCountMin"
                  name="pageCountMin"
                  value={filters.pageCountMin}
                  onChange={(e) => handleFilterChange('pageCountMin', e.target.value)}
                  placeholder="e.g., 100"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Page Count Max */}
              <div>
                <label htmlFor="filterPageCountMax" className="block text-sm font-medium text-gray-600 mb-1">Max Pages</label>
                <input
                  type="number"
                  id="filterPageCountMax"
                  name="pageCountMax"
                  value={filters.pageCountMax}
                  onChange={(e) => handleFilterChange('pageCountMax', e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Publisher */}
              <div>
                <label htmlFor="filterPublisher" className="block text-sm font-medium text-gray-600 mb-1">Publisher</label>
                <input
                  type="text"
                  id="filterPublisher"
                  name="publisher"
                  value={filters.publisher}
                  onChange={(e) => handleFilterChange('publisher', e.target.value)}
                  placeholder="e.g., Viking"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Language */}
              <div>
                <label htmlFor="filterLanguage" className="block text-sm font-medium text-gray-600 mb-1">Language (code)</label>
                <input
                  type="text"
                  id="filterLanguage"
                  name="language"
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  placeholder="e.g., en, es"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Clear All Button */}
          <div>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
            >
              Clear All Search, Filters & Sort
            </button>
          </div>

        </div>
      </header>

      {/* Display Active Filters and Sort */}
      {activeFiltersForDisplay.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <strong>Active:</strong> {activeFiltersForDisplay.join('; ')}
        </div>
      )}

      {displayedBooks.length === 0 && !loading && (
        <p className="text-center text-gray-600 py-8">
          No books found matching your criteria for Stephen King. Try adjusting your search or filters.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedBooks.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col bg-white">
            <Link href={`/pages/google-books/${book.id}`} className="flex flex-col flex-grow">
              <div className="flex-grow flex flex-col justify-center mb-3">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-full h-64 object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold mb-1 text-gray-800 truncate" title={book.volumeInfo.title}>
                {book.volumeInfo.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1 truncate">
                {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
              </p>
              {book.volumeInfo.publishedDate && (
                <p className="text-xs text-gray-500">
                  Published: {book.volumeInfo.publishedDate}
                </p>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls - ensure this uses totalItemsFromAPI and current page for API based pagination */}
      {totalItemsFromAPI > 0 && displayedBooks.length > 0 && ( // Show pagination if there are items and results displayed
        <div className="mt-10 flex justify-center items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0 || loading}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-lg text-gray-700">
            Page {currentPage + 1} {totalPages > 0 ? `of ${totalPages}` : ''}
          </span>
          <button
            onClick={handleNextPage}
            disabled={loading || (currentPage + 1) >= totalPages}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
