import Layout from '../components/Layout';
import ListItemCard from '../components/ListItemCard';
import { useState, useEffect, useCallback } from 'react';

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

export default function GoogleBooksPage({ initialBooksData = { items: [], error: null } }) {
  const [searchTerm, setSearchTerm] = useState('Stephen King');
  const [books, setBooks] = useState(initialBooksData.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialBooksData.error);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(initialBooksData.totalItems || 0);
  const itemsPerPage = 20; // Google Books API maxResults can be up to 40

  const fetchGoogleBooks = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      setBooks([]);
      setTotalItems(0);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const startIndex = (page - 1) * itemsPerPage;

    try {
      const res = await fetch(
        `/api/search-google-books?q=${encodeURIComponent(query)}&maxResults=${itemsPerPage}&startIndex=${startIndex}`
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
  }, []);

  const debouncedFetchGoogleBooks = useCallback(debounce(fetchGoogleBooks, 500), [fetchGoogleBooks]);

  useEffect(() => {
    // Fetch initial books only if not provided by SSR/SSG or if search term changes
    // For this setup, initialBooksData comes from getStaticProps
    if (searchTerm !== 'Stephen King' || !initialBooksData.items?.length) {
        debouncedFetchGoogleBooks(searchTerm, currentPage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, currentPage, debouncedFetchGoogleBooks]); // initialBooksData.items?.length removed to allow search

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchGoogleBooks(searchTerm, 1); // Immediate fetch on submit
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Optionally trigger debounced search on input change:
    // setCurrentPage(1);
    // debouncedFetchGoogleBooks(e.target.value, 1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        <p className="text-center text-gray-600 my-4">No books found for "{searchTerm}". Try a different search.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {loading && books.length === 0 && Array.from({ length: itemsPerPage }).map((_, index) => (
            // Skeleton Card
            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-56 bg-gray-300 rounded-t-lg mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
        ))}
        {!loading && books.map((book) => (
          <ListItemCard
            key={book.id + (book.etag || '')} // Etag can help with key uniqueness if ID repeats
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

      {/* Pagination */}
      {totalItems > itemsPerPage && !loading && !error && (
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

// Optional: Initial fetch for default display (e.g., popular SK books)
export async function getStaticProps() {
  const initialQuery = 'Stephen King';
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  let initialBooks = [];
  let error = null;
  let totalItems = 0;

  if (!apiKey) {
    console.warn("GOOGLE_BOOKS_API_KEY is not set. Initial Google Books page load will be client-side only.");
    // No server-side fetching if API key is missing
    return { props: { initialBooksData: { items: [], error: "API Key not configured for initial load.", totalItems: 0 } } };
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(initialQuery)}&maxResults=${itemsPerPage}&startIndex=0&key=${apiKey}`
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
    error = e.message; // Pass error to be displayed on the page
  }
  return {
    props: {
      initialBooksData: { items: initialBooks, error, totalItems }
    },
    revalidate: 3600 * 6 // Revalidate every 6 hours for initial load
  };
}
