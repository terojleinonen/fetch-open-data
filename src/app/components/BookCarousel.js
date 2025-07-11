'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Request component is no longer directly used here

// MAX_CAROUSEL_BOOKS is handled by the API route, but can be kept for consistency if needed
// const MAX_CAROUSEL_BOOKS = 10;

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCarouselBooks = async () => {
      setLoading(true);
      try {
        // Fetch from the new API route
        const response = await fetch('/api/books/carousel');
        if (!response.ok) {
          // Try to parse error message from response body if available
          let errorMsg = `HTTP error ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (parseError) {
            // Ignore if response is not JSON or empty
          }
          throw new Error(errorMsg);
        }
        const data = await response.json();
        // The API route now returns the already sliced and processed books
        setBooks(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch books for carousel:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselBooks();
  }, []);

  useEffect(() => {
    if (books.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(timer); // Cleanup interval on component unmount
    }
  }, [books.length]);

  if (loading) {
    return <div className="home-carousel-status text-center p-10">Loading books...</div>;
  }

  if (error) {
    return <div className="home-carousel-status text-center p-10 text-[var(--accent-color)]">Error loading books: {error}</div>;
  }

  if (books.length === 0) {
    return <div className="home-carousel-status text-center p-10">No books found for carousel.</div>;
  }

  return (
    <div className="home-carousel">
      {books.map((book, index) => {
        // Data from Stephen King API (augmented by Request.js)
        // SK API uses 'id', 'Title', and `request.js` adds 'coverImageUrl'
        const imageSrc = book.coverImageUrl && book.coverImageUrl !== "NO_COVER_AVAILABLE"
          ? book.coverImageUrl
          : `https://via.placeholder.com/200x300.png?text=${encodeURIComponent(book.Title || "Book Cover")}`;
        
        return (
          <div
            key={book.id || index} // SK API provides 'id'
            className={`home-carousel-item slideshow-item ${index === currentIndex ? 'active' : ''}`}
          >
            {/* Link to the standard book detail page */}
            <Link href={`/pages/books/${book.id}`} passHref legacyBehavior>
              <a className="slideshow-link-content">
                <Image
                  src={imageSrc}
                  alt={book.Title || 'Book cover'}
                  width={200}
                  height={300}
                  className="home-carousel-image"
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    // Prevent infinite loop if placeholder itself fails
                    if (!e.currentTarget.src.includes('via.placeholder.com')) {
                      e.currentTarget.src = `https://via.placeholder.com/200x300.png?text=${encodeURIComponent(book.Title || "Book Cover")}+Error`;
                    }
                  }}
                />
                <div className="home-carousel-caption">{book.Title}</div>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BookCarousel;