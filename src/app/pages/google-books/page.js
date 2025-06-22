'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GoogleBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for startIndex
  const [totalItems, setTotalItems] = useState(0); // Store total items for pagination
  const booksPerPage = 20;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      // Reset books and totalItems on new fetch, especially for page changes
      // setBooks([]);
      // setTotalItems(0);
      // We might not want to clear books immediately if we want to show old items while new ones load,
      // but for simplicity and to avoid stale data if an error occurs mid-way, clearing is safer.
      // Let's only clear if it's a new search, not just pagination. For now, this is fine.

      try {
        // Using a more specific query for Stephen King as the author
        const query = "inauthor:stephen king";
        const startIndex = currentPage * booksPerPage;
        // Note: You might need an API key for more requests or specific features.
        // For now, we'll proceed without one, but it's good practice to use one.
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${booksPerPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Google Books API Response:', data);
        setBooks(data.items || []); // data.items can be undefined if no books are found
        setTotalItems(data.totalItems || 0);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError(err.message);
        setBooks([]); // Clear books on error
        setTotalItems(0); // Clear total items on error
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]); // Refetch when currentPage changes

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

  const totalPages = Math.ceil(totalItems / booksPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Stephen King Books</h1>

      {books.length === 0 && !loading && (
        <p className="text-center">No books found for Stephen King, or all books have been loaded.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <Link href={`/pages/google-books/${book.id}`} className="flex flex-col flex-grow">
              <div className="flex-grow flex flex-col justify-center">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-full h-64 object-contain mb-4 rounded"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2 truncate" title={book.volumeInfo.title}>
                {book.volumeInfo.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1 truncate">
                {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
              </p>
              {book.volumeInfo.publishedDate && (
                <p className="text-sm text-gray-500">
                  Published: {book.volumeInfo.publishedDate}
                </p>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0 || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage + 1} {totalPages > 0 ? `of ${totalPages}` : ''}
          </span>
          <button
            onClick={handleNextPage}
            disabled={loading || (currentPage + 1) >= totalPages || books.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
