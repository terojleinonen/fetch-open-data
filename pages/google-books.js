import Layout from '../components/Layout';
import ListItemCard from '../components/ListItemCard';
import { useState, useEffect, useCallback, useMemo } from 'react';

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

// Define itemsPerPage outside component if it's static
const ITEMS_PER_PAGE = 20;

export default function GoogleBooksPage({ initialBooksData = { items: [], error: null, totalItems: 0 } }) {
  const [searchTerm, setSearchTerm] = useState('Stephen King');
  const [books, setBooks] = useState(initialBooksData.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialBooksData.error);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(initialBooksData.totalItems);

  const fetchGoogleBooks = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      setBooks([]);
      setTotalItems(0);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    try {
      const res = await fetch(
        `/api/search-google-books?q=${encodeURIComponent(query)}&maxResults=${ITEMS_PER_PAGE}&startIndex=${startIndex}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `HTTP error ${res.status}`}));
        throw new Error(errorData.error || errorData.message || `Failed to fetch from Google Books API, status: ${res.status}`);
      }
      const data = await res.json();
      setBooks(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      setError(err.message);
      setBooks([]);
      setTotalItems(0);
      console.error(err);
    }
    setLoading(false);
  }, []); // Empty dependency array means fetchGoogleBooks is stable

  const debouncedFetchGoogleBooks = useMemo(
    () => debounce(fetchGoogleBooks, 500),
    [fetchGoogleBooks] // This is correct, will only re-create if fetchGoogleBooks changes (it won't)
  );

  useEffect(() => {
    // Fetch on initial load if not SSR/SSG, or if search term/page changes
    // Check if it's not the initial default search term OR if initial books weren't loaded
    if (searchTerm !== 'Stephen King' || !initialBooksData.items || initialBooksData.items.length === 0 || currentPage !== 1) {
        debouncedFetchGoogleBooks(searchTerm, currentPage);
    } else if (searchTerm === 'Stephen King' && currentPage === 1 && initialBooksData.items && initialBooksData.items.length > 0) {
        // If it IS the initial search term, page 1, and we have initial books, use them.
        setBooks(initialBooksData.items);
        setTotalItems(initialBooksData.totalItems);
        setError(initialBooksData.error);
    }
  }, [searchTerm, currentPage, debouncedFetchGoogleBooks, initialBooksData]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchGoogleBooks(searchTerm, 1); // Immediate fetch on submit
  };

  const handleSearchInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset page on new search term
    // No need to call debouncedFetchGoogleBooks here if useEffect handles it
    // If you want instant feedback while typing (debounced), then call it:
    // debouncedFetchGoogleBooks(newSearchTerm, 1);
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <Layout title="Search Google Books - Stephen King Fan Hub">
      <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-8 text-center">
        Explore Stephen King on Google Books
      </h1>
      <form onSubmit={handleSearchSubmit} className="mb-8 flex flex-col sm:flex-row gap-2 items-center max-w-xl mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          placeholder="Search (e.g., The Shining, IT...)"
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-classic-red focus:border-classic-red"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-classic-red text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-600 text-center my-4 bg-red-100 p-3 rounded-md">Error: {error}</p>}

      {!loading && !error && books.length === 0 && searchTerm && (
        <p className="text-center text-gray-600 my-4">No books found for &ldquo;{searchTerm}&rdquo;. Try a different search.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {loading && books.length === 0 && Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-56 bg-gray-300 rounded-t-lg mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
        ))}
        {!loading && books.map((book) => (
          <ListItemCard
            key={book.id + (book.etag || '')}
            title={book.volumeInfo.title}
            year={book.volumeInfo.publishedDate?.substring(0, 4)}
            imageUrl={book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail}
            altText={`Cover of ${book.volumeInfo.title}`}
            keyInfo={`By: ${book.volumeInfo.authors?.join(', ') || 'N/A'}`}
            description={book.volumeInfo.description ? (book.volumeInfo.description.substring(0, 100) + (book.volumeInfo.description.length > 100 ? '...' : '')) : undefined}
            detailsLink={book.volumeInfo.infoLink || book.volumeInfo.previewLink}
            externalLink={true}
          />
        ))}
      </div>

      {totalItems > ITEMS_PER_PAGE && !loading && !error && (
        <div className="mt-10 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-dark-gray rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-dark-gray rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const initialQuery = 'Stephen King';
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  let initialBooks = [];
  let error = null;
  let totalItems = 0;
  // const itemsPerPage = 20; // Defined globally in component now

  if (!apiKey) {
    console.warn("GOOGLE_BOOKS_API_KEY is not set. Initial Google Books page load will be client-side only.");
    return { props: { initialBooksData: { items: [], error: "API Key not configured for initial load.", totalItems: 0 } } };
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(initialQuery)}&maxResults=${ITEMS_PER_PAGE}&startIndex=0&key=${apiKey}`
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP error ${res.status}`}));
      throw new Error(errorData.error || errorData.message || `Failed to fetch initial Google Books, status: ${res.status}`);
    }
    const data = await res.json();
    initialBooks = data.items || [];
    totalItems = data.totalItems || 0;
  } catch (e) {
    console.error("Google Books initial fetch error (getStaticProps):", e.message);
    error = e.message;
  }
  return {
    props: {
      initialBooksData: { items: initialBooks, error, totalItems }
    },
    revalidate: 3600 * 6
  };
}
