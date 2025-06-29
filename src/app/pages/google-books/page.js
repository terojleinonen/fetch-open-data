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
  const [language, setLanguage] = useState(''); // Language for API query

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

    const savedCurrentPage = sessionStorage.getItem('googleBooks_currentPage');
    if (savedCurrentPage) setCurrentPage(JSON.parse(savedCurrentPage));

    const savedLanguage = sessionStorage.getItem('googleBooks_language');
    if (savedLanguage) setLanguage(JSON.parse(savedLanguage));
  }, []);

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

  useEffect(() => {
    sessionStorage.setItem('googleBooks_language', JSON.stringify(language));
  }, [language]);


  // This useEffect will be responsible for fetching books from the API
  useEffect(() => {
    // Only fetch if not loading initial state from session or if critical states are defined
    // This check helps prevent fetching with default/empty states if session state is pending
    // However, the initial load from session is synchronous if sessionStorage is fast.
    // The main fetch depends on searchQuery, currentPage. // sortConfig.key removed
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
      // Always orderBy relevance, or whatever Google's default is if not specified.
      // The `orderBy=relevance` is often the default if no specific `orderBy` is given for general queries.
      let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(queryString)}&startIndex=${startIndex}&maxResults=${booksPerPage}&orderBy=relevance`;

      if (language) {
        apiUrl += `&langRestrict=${language}`;
      }

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
  }, [searchQuery, currentPage]);


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
        
        <div className="mb-8 max-w-2xl mx-auto relative flex items-center">
          <input
            type="text"
            value={searchInputText}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search by title (e.g., The Shining)..."
            className={`${inputBaseClasses} p-3 text-base focus:ring-2 pr-10`} // Added pr-10 for icon spacing
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

        <div className="mt-4 max-w-2xl mx-auto">
          <label htmlFor="language-select" className="block text-sm font-medium text-neutral-300 mb-1">
            Filter by Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCurrentPage(0); // Reset to first page on language change
            }}
            className={`${inputBaseClasses} p-3 text-base focus:ring-2`}
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            {/* Add more languages as needed */}
          </select>
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