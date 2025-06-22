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
  const [searchInputText, setSearchInputText] = useState(''); // For direct input binding
  const [searchQuery, setSearchQuery] = useState(''); // Debounced value for API
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
    // Load debounced search query for API, and also set the input text to match
    const savedSearchQuery = sessionStorage.getItem('googleBooks_searchQuery');
    if (savedSearchQuery) {
      const parsedQuery = JSON.parse(savedSearchQuery);
      setSearchQuery(parsedQuery);
      setSearchInputText(parsedQuery); 
    }

    const savedSortConfig = sessionStorage.getItem('googleBooks_sortConfig');
    if (savedSortConfig) setSortConfig(JSON.parse(savedSortConfig));
    
    const savedFilters = sessionStorage.getItem('googleBooks_filters');
    if (savedFilters) setFilters(JSON.parse(savedFilters));

    const savedCurrentPage = sessionStorage.getItem('googleBooks_currentPage');
    if (savedCurrentPage) setCurrentPage(JSON.parse(savedCurrentPage));
  }, []);


  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchQuery(searchInputText);
      setCurrentPage(0); // Reset page when debounced search query changes
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchInputText]);


  // Save state to sessionStorage whenever they change
  // Note: We save the debounced `searchQuery` to session, not `searchInputText`
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

  // Loading and error states styled to match dark theme
  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4"><p className="text-xl">Loading books...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <p className="text-xl text-red-500">Error fetching books:</p>
      <p className="text-md text-red-400 mt-2">{error}</p>
    </div>;
  }

  const totalPages = Math.ceil(totalItemsFromAPI / booksPerPage);

  const handleSearchInputChange = (event) => {
    setSearchInputText(event.target.value);
  };

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    setCurrentPage(0); 
  };

  const sortOptions = [
    { key: 'relevance', direction: 'desc', label: 'Relevance' },
    { key: 'newest', direction: 'desc', label: 'Newest First' },
    { key: 'title', direction: 'asc', label: 'Title (A-Z)' },
    { key: 'title', direction: 'desc', label: 'Title (Z-A)' },
    { key: 'publishedDate', direction: 'asc', label: 'Year (Oldest)' },
    { key: 'publishedDate', direction: 'desc', label: 'Year (Newest)' },
  ];
  
  const isSortActive = (key, direction) => {
    return sortConfig.key === key && sortConfig.direction === direction;
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    setCurrentPage(0); 
  };

  const handleClearAll = () => {
    setSearchInputText(''); 
    setSearchQuery('');     
    setFilters({
      publishYear: '',
      pageCountMin: '',
      pageCountMax: '',
      publisher: '',
      language: '',
    });
    setSortConfig({ key: 'relevance', direction: 'desc' }); 
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
    
    const currentSortOption = sortOptions.find(opt => opt.key === sortConfig.key && opt.direction === sortConfig.direction);
    if (currentSortOption && (currentSortOption.key !== 'relevance' || searchQuery)) {
        active.push(`Sort: ${currentSortOption.label}`);
    }
    return active;
  };

  const activeFiltersForDisplay = getActiveFiltersForDisplay();

  const inputBaseClasses = "w-full p-2 bg-[var(--background-color-dark)] text-[var(--text-color-dark)] border border-[var(--shadow-color-dark)] rounded-md shadow-sm text-sm focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)] placeholder-gray-500";
  const labelBaseClasses = "block text-sm font-medium text-[var(--text-color-dark)] opacity-80 mb-1";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color-dark)] via-[var(--hover-accent-color-dark)] to-[var(--accent-color-dark)] py-2">
          Google Books Explorer
        </h1>
        
        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchInputText} 
            onChange={handleSearchInputChange}
            placeholder="Search by title (e.g., The Shining)..."
            className={`${inputBaseClasses} p-3 text-base focus:ring-2`}
          />
        </div>

        <div className="mb-8 p-4 md:p-6 bg-[var(--shadow-color-dark)] bg-opacity-50 rounded-lg shadow-xl border border-neutral-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sort Options Section */}
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-semibold mb-3 text-foreground opacity-90">Sort Options</h2>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(opt => (
                  <button
                    key={`${opt.key}-${opt.direction}`}
                    onClick={() => handleSortChange(opt.key, opt.direction)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
                      ${isSortActive(opt.key, opt.direction) 
                        ? 'bg-[var(--accent-color-dark)] text-white shadow-md ring-2 ring-offset-2 ring-offset-[var(--shadow-color-dark)] ring-[var(--hover-accent-color-dark)]' 
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600 hover:text-white'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Options Section */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground opacity-90">Filter Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label htmlFor="filterPublishYear" className={labelBaseClasses}>Publish Year</label>
                  <input type="number" id="filterPublishYear" name="publishYear" value={filters.publishYear} onChange={(e) => handleFilterChange('publishYear', e.target.value)} placeholder="e.g., 1984" className={inputBaseClasses}/>
                </div>
                <div>
                  <label htmlFor="filterPageCountMin" className={labelBaseClasses}>Min Pages</label>
                  <input type="number" id="filterPageCountMin" name="pageCountMin" value={filters.pageCountMin} onChange={(e) => handleFilterChange('pageCountMin', e.target.value)} placeholder="e.g., 100" className={inputBaseClasses}/>
                </div>
                <div>
                  <label htmlFor="filterPageCountMax" className={labelBaseClasses}>Max Pages</label>
                  <input type="number" id="filterPageCountMax" name="pageCountMax" value={filters.pageCountMax} onChange={(e) => handleFilterChange('pageCountMax', e.target.value)} placeholder="e.g., 500" className={inputBaseClasses}/>
                </div>
                <div>
                  <label htmlFor="filterPublisher" className={labelBaseClasses}>Publisher</label>
                  <input type="text" id="filterPublisher" name="publisher" value={filters.publisher} onChange={(e) => handleFilterChange('publisher', e.target.value)} placeholder="e.g., Viking" className={inputBaseClasses}/>
                </div>
                <div>
                  <label htmlFor="filterLanguage" className={labelBaseClasses}>Language (code)</label>
                  <input type="text" id="filterLanguage" name="language" value={filters.language} onChange={(e) => handleFilterChange('language', e.target.value)} placeholder="e.g., en" className={inputBaseClasses}/>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-700 flex justify-end">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent-color-dark)] rounded-md hover:bg-[var(--hover-accent-color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--hover-accent-color-dark)] focus:ring-opacity-75 transition-colors shadow-md"
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      {activeFiltersForDisplay.length > 0 && (
        <div className="mb-6 p-3 bg-[var(--shadow-color-dark)] bg-opacity-40 border border-neutral-700 rounded-lg text-sm text-neutral-300">
          <strong>Active:</strong> {activeFiltersForDisplay.join('; ')}
        </div>
      )}
      
      {displayedBooks.length === 0 && !loading && (
        <p className="text-center text-neutral-400 py-10 text-lg">
          No books found matching your criteria.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayedBooks.map((book) => (
          <div key={book.id} className="bg-neutral-800 bg-opacity-50 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden border border-neutral-700 hover:border-[var(--accent-color-dark)]">
            <Link href={`/pages/google-books/${book.id}`} className="flex flex-col flex-grow">
              <div className="relative w-full h-72 flex items-center justify-center bg-neutral-700 overflow-hidden">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img 
                    src={book.volumeInfo.imageLinks.thumbnail} 
                    alt={book.volumeInfo.title} 
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" // group-hover might need parent with 'group'
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-md font-semibold text-foreground mb-1 truncate" title={book.volumeInfo.title}>
                  {book.volumeInfo.title}
                </h2>
                <p className="text-xs text-neutral-400 mb-2 truncate">
                  {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
                </p>
                {book.volumeInfo.publishedDate && (
                  <p className="text-xs text-neutral-500 mt-auto">
                    {book.volumeInfo.publishedDate.substring(0,4)} {/* Show only year for brevity */}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalItemsFromAPI > 0 && displayedBooks.length > 0 && (
        <div className="mt-12 flex justify-center items-center space-x-4">
          <button 
            onClick={handlePreviousPage} 
            disabled={currentPage === 0 || loading}
            className="px-5 py-2 bg-[var(--accent-color-dark)] text-white font-semibold rounded-md shadow-md hover:bg-[var(--hover-accent-color-dark)] disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-lg text-foreground">
            Page {currentPage + 1} {totalPages > 0 ? `of ${totalPages}` : ''}
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={loading || (currentPage + 1) >= totalPages}
            className="px-5 py-2 bg-[var(--accent-color-dark)] text-white font-semibold rounded-md shadow-md hover:bg-[var(--hover-accent-color-dark)] disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}