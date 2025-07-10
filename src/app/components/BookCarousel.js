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
      setLoading(true);
      try {
        const response = await fetch('/api/google-books-proxy?q=Stephen%20King&maxResults=10'); // Fetch 10 results
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const validBooks = data.items?.filter(book => book.volumeInfo?.title) || [];
        setBooks(validBooks);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch books:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
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
    return <div className="home-carousel-status text-center p-10">No books found.</div>;
  }

  // The main container will get the 'home-carousel' class for styling.
  // It needs a fixed height to contain the absolutely positioned items.
  // CSS for 'home-carousel' will need to be adjusted from flex-scroll to relative positioning.
  return (
    <div className="home-carousel">
      {books.map((book, index) => {
        const bookInfo = book.volumeInfo;
        const thumbnailUrl = bookInfo.imageLinks?.thumbnail?.replace("http://", "https://");
        const placeholderText = encodeURIComponent(bookInfo.title) || "Book+Cover";
        const imageSrc = thumbnailUrl || `https://via.placeholder.com/200x300.png?text=${placeholderText}`;

        return (
          <div
            key={book.id || index}
            className={`home-carousel-item slideshow-item ${index === currentIndex ? 'active' : ''}`}
          >
            <Link href={`/pages/google-books/${book.id}`} passHref legacyBehavior>
              <a className="slideshow-link-content">
                <Image
                  src={imageSrc}
                  alt={bookInfo.title || 'Book cover'}
                  width={200}
                  height={300}
                  className="home-carousel-image"
                  style={{ objectFit: 'contain' }} // Changed to 'contain' to ensure full title on placeholder is visible
                  onError={(e) => {
                    // Fallback if image loading fails (e.g. broken thumbnail URL)
                    e.currentTarget.src = `https://via.placeholder.com/200x300.png?text=${placeholderText}+Error`;
                  }}
                />
                <div className="home-carousel-caption">{bookInfo.title}</div>
              </a>
            </Link>
          </div>
        );
      })}
      {/* Optional: Add manual controls or indicators if desired later */}
    </div>
  );
};

export default BookCarousel;
