'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GoogleBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data to display (formerly allFetchedBooks)
  const [displayedBooks, setDisplayedBooks] = useState([]); 

  // Search States
  const [searchInputText, setSearchInputText] = useState(''); // For direct input binding
  const [searchQuery, setSearchQuery] = useState(''); // Value for API query, set on search execution
  // const [language, setLanguage] = useState(''); // Language for API query - REMOVED, will be passed from advanced search or not used

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for startIndex for API
  const [totalItemsFromAPI, setTotalItemsFromAPI] = useState(0); // Total items from API for a given query
  const booksPerPage = 20; // Max results per API call

  // State Initialization from sessionStorage and URL parameters (runs once on mount)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const advancedSearchTerm = params.get('adv_searchTerm');

    if (advancedSearchTerm) {
      // If an advanced search term is present in the URL, use it
      setSearchInputText(advancedSearchTerm);
      setSearchQuery(advancedSearchTerm);
      setCurrentPage(0); // Reset to first page for new search
      // Clear the adv_searchTerm from URL to prevent re-triggering on refresh if not desired,
      // and rely on sessionStorage for subsequent state persistence.
      // Or, keep it if you want the URL to be the source of truth for this specific search.
      // For this implementation, let's clear it and let sessionStorage take over.
      const newUrl = window.location.pathname; // Get path without query params
      window.history.replaceState({...window.history.state, as: newUrl, url: newUrl }, '', newUrl);

    } else {
      // Otherwise, load from sessionStorage as before
      const savedSearchQuery = sessionStorage.getItem('googleBooks_searchQuery');
      if (savedSearchQuery) {
        const parsedQuery = JSON.parse(savedSearchQuery);
        setSearchQuery(parsedQuery);
        setSearchInputText(parsedQuery);
      }

      const savedCurrentPage = sessionStorage.getItem('googleBooks_currentPage');
      if (savedCurrentPage) setCurrentPage(JSON.parse(savedCurrentPage));
    }
    
    // Language is independent of advanced search term, load from session - REMOVED
    // const savedLanguage = sessionStorage.getItem('googleBooks_language');
    // if (savedLanguage) setLanguage(JSON.parse(savedLanguage));

  }, []); // Empty dependency array means this runs once on mount

  const executeSearch = () => {
    setSearchQuery(searchInputText);
    setCurrentPage(0);
    // Language is set directly by its own dropdown, no need to include in executeSearch logic explicitly
    // unless future requirements link them more directly (e.g. language change triggers search)
  };

  // Save state to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('googleBooks_searchQuery', JSON.stringify(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('googleBooks_currentPage', JSON.stringify(currentPage));
  }, [currentPage]);

  // useEffect(() => { // REMOVED language saving to session storage
  //   sessionStorage.setItem('googleBooks_language', JSON.stringify(language));
  // }, [language]);


  // This useEffect will be responsible for fetching books from the API
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const advLang = params.get('adv_lang');
    const advFilter = params.get('adv_filter');
    const advPrintType = params.get('adv_printType');
    const advOrderBy = params.get('adv_orderBy');
    const advInPublisher = params.get('adv_inPublisher');


    // Only fetch if not loading initial state from session or if critical states are defined
    // This check helps prevent fetching with default/empty states if session state is pending
    // However, the initial load from session is synchronous if sessionStorage is fast.
    // The main fetch depends on searchQuery, currentPage. 
    // If these are correctly initialized from session, the first fetch will use them.

    const fetchBooksFromAPI = async () => {
      setLoading(true);
      setError(null);
      
      let apiQueryParts = ['inauthor:stephen king'];
      const currentSearchQuery = typeof searchQuery === 'string' ? searchQuery : '';
      
      // Prefer advanced search term if it came from URL, otherwise use current searchQuery
      const titleQuery = params.get('adv_searchTerm') || currentSearchQuery;

      if (titleQuery.trim() !== '') {
        apiQueryParts.push(`intitle:${titleQuery.trim()}`);
      }
      if (advInPublisher && advInPublisher.trim() !== '') {
        apiQueryParts.push(`inpublisher:${advInPublisher.trim()}`);
      }
      
      const queryString = apiQueryParts.join('+');
      const startIndex = currentPage * booksPerPage;
      
      let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(queryString)}&startIndex=${startIndex}&maxResults=${booksPerPage}`;

      // Apply advanced parameters from URL
      if (advLang) {
        apiUrl += `&langRestrict=${advLang}`;
      }
      if (advFilter) {
        apiUrl += `&filter=${advFilter}`;
      }
      if (advPrintType) {
        apiUrl += `&printType=${advPrintType}`;
      }
      // Use advOrderBy if present, otherwise default to relevance (API default or explicitly set)
      apiUrl += `&orderBy=${advOrderBy || 'relevance'}`;


      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDisplayedBooks(data.items || []); // Changed from setAllFetchedBooks
        setTotalItemsFromAPI(data.totalItems || 0);
      } catch (err) {
        setError(err.message);
        setDisplayedBooks([]); // Changed from setAllFetchedBooks
        setTotalItemsFromAPI(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksFromAPI();
  }, [searchQuery, currentPage, typeof window !== 'undefined' ? window.location.search : '']); // Re-fetch if URL query params change


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
    // Search is now triggered by executeSearch (Enter key or icon click)
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  };

  const inputBaseClasses = "w-full p-2 bg-[var(--background-color-dark)] text-[var(--text-color-dark)] border border-[var(--shadow-color-dark)] rounded-md shadow-sm text-sm focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)] placeholder-gray-500";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color-dark)] via-[var(--hover-accent-color-dark)] to-[var(--accent-color-dark)] py-2">
          Google Books Explorer
        </h1>
        
        <div className="max-w-2xl mx-auto">
          {/* Flex container for search bar and language dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Input with relative positioning for the icon */}
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchInputText}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by title (e.g., The Shining)..."
                className={`${inputBaseClasses} p-3 text-base focus:ring-2 pr-10 w-full`} // Ensure w-full for responsiveness
              />
              <button
                onClick={executeSearch}
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-neutral-400 hover:text-[var(--accent-color-dark)] focus:outline-none"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>

            {/* Language Dropdown - REMOVED */}
            {/* <div className="flex-shrink-0 sm:w-auto w-full"> ... </div> */}
          </div>
          <div className="text-center mt-3"> {/* Increased margin-top for better spacing */}
            <Link href="/pages/google-books/advanced-search" className="inline-block px-4 py-2 text-sm font-medium text-[var(--accent-color-dark)] border border-[var(--accent-color-dark)] rounded-md hover:bg-[var(--accent-color-dark)] hover:text-white transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color-dark)] focus:ring-offset-[var(--background-color-dark)]">
              Go to Advanced Search
            </Link>
          </div>
        </div>
      </header>

      {displayedBooks.length === 0 && !loading && (
        <p className="text-center text-neutral-400 py-10 text-lg">
          No books found matching your criteria.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {displayedBooks.map((book) => (
          <div key={book.id} className="bg-neutral-800 bg-opacity-50 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden border border-neutral-700 hover:border-[var(--accent-color-dark)]">
            <Link href={`/pages/google-books/${book.id}`} className="flex flex-col flex-grow group"> {/* Added group class here */}
              <div className="relative w-full h-72 flex items-center justify-center bg-neutral-700 overflow-hidden">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    fill
                    style={{ objectFit: "contain" }}
                    className="transition-transform duration-300 group-hover:scale-105"
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