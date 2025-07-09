'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch books by Stephen King from the Google Books API proxy
        const response = await fetch('/api/google-books-proxy?q=Stephen%20King');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Filter out items without imageLinks or title to avoid errors
        const validBooks = data.items.filter(book => book.volumeInfo.imageLinks?.thumbnail && book.volumeInfo.title);
        setBooks(validBooks.slice(0, 10)); // Limiting to 10 books for the carousel
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch books:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
  };

  if (loading) {
    return <div className="text-center p-10">Loading books...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-[var(--accent-color)]">Error loading books: {error}</div>;
  }

  if (books.length === 0) {
    return <div className="text-center p-10">No books found.</div>;
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center mb-6">Stephen King Books</h2>
      <div className="overflow-hidden relative h-96"> {/* Fixed height for carousel items */}
        {books.map((book, index) => (
          <div
            key={book.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <Link href={`/pages/google-books/${book.id}`} legacyBehavior>
              <a className="flex flex-col items-center justify-center h-full">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    src={book.volumeInfo.imageLinks.thumbnail.replace("http://", "https://")} // Ensure HTTPS
                    alt={book.volumeInfo.title}
                    width={128} // Standardized width
                    height={192} // Standardized height
                    className="object-contain rounded-lg shadow-lg"
                  />
                ) : (
                   <div className="w-32 h-48 bg-[var(--sk-shadow-light)] dark:bg-[var(--sk-shadow-dark)] flex items-center justify-center rounded-lg shadow-lg">
                     <span className="text-xs text-[var(--text-color)] opacity-70">No Image</span>
                  </div>
                )}
                <p className="mt-2 text-center text-sm font-semibold">{book.volumeInfo.title}</p>
              </a>
            </Link>
          </div>
        ))}
      </div>
      {books.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
            aria-label="Previous book"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
            aria-label="Next book"
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
};

export default BookCarousel;
