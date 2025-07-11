'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BookCarousel.module.css';

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for book title and author elements for direct manipulation (fade effect)
  const bookTitleRef = useRef(null);
  const bookAuthorRef = useRef(null);

  useEffect(() => {
    const fetchCarouselBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/books/carousel');
        if (!response.ok) {
          let errorMsg = `HTTP error ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (parseError) { /* Ignore */ }
          throw new Error(errorMsg);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setBooks(data);
          // Initialize with the first book's details if refs are available
          // This happens after the first render, so refs should be set
          if (bookTitleRef.current && bookAuthorRef.current && data[0]) {
            bookTitleRef.current.textContent = data[0].Title || '';
            bookAuthorRef.current.textContent = Array.isArray(data[0].authors) ? data[0].authors.join(', ') : (data[0].authors || '');
            bookTitleRef.current.style.opacity = '1';
            bookAuthorRef.current.style.opacity = '1';
          }
        } else {
          setBooks([]);
        }
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch books for carousel:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCarouselBooks();
  }, []);

  const updateCarousel = useCallback((newIndex) => {
    if (isAnimating || books.length === 0) return;

    setIsAnimating(true);
    const normalizedNewIndex = (newIndex + books.length) % books.length;

    // Fade out current book title/author
    if (bookTitleRef.current) bookTitleRef.current.style.opacity = '0';
    if (bookAuthorRef.current) bookAuthorRef.current.style.opacity = '0';

    // Set current index after a short delay to allow card transition to start
    // The actual card classing is handled by getCardClass based on `currentIndex`
    // So, we just need to update `currentIndex` which triggers a re-render
    setTimeout(() => {
      setCurrentIndex(normalizedNewIndex);

      // Update book title/author and fade in
      const nextBook = books[normalizedNewIndex];
      if (nextBook && bookTitleRef.current && bookAuthorRef.current) {
        bookTitleRef.current.textContent = nextBook.Title || '';
        bookAuthorRef.current.textContent = Array.isArray(nextBook.authors) ? nextBook.authors.join(', ') : (nextBook.authors || '');
        setTimeout(() => { // Ensure DOM has updated with new text before fading in
            if (bookTitleRef.current) bookTitleRef.current.style.opacity = '1';
            if (bookAuthorRef.current) bookAuthorRef.current.style.opacity = '1';
        }, 50); // Small delay for text update
      }
    }, 100); // This delay can be adjusted. Codepen uses 300ms for text, 800ms for animation lock.

    // Release animation lock
    // The CSS transition is 0.8s, so wait for that.
    setTimeout(() => {
      setIsAnimating(false);
    }, 800); // Match CSS transition duration

  }, [isAnimating, books, currentIndex]);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (books.length === 0) return;
      if (e.key === "ArrowLeft") {
        updateCarousel(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        updateCarousel(currentIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, updateCarousel, books.length]);


  if (loading) {
    return <div className={`${styles.carouselStatus} text-center p-10`}>Loading books...</div>;
  }
  if (error) {
    return <div className={`${styles.carouselStatus} ${styles.errorStatus} text-center p-10`}>Error loading books: {error}</div>;
  }
  if (books.length === 0) {
    return <div className={`${styles.carouselStatus} text-center p-10`}>No books found for carousel.</div>;
  }

  const getCardClass = (index, localCurrentIndex, totalBooks) => {
    if (totalBooks === 0) return styles.hidden;
    const offset = (index - localCurrentIndex + totalBooks) % totalBooks;

    // Show up to 5 cards: center, 2 left, 2 right.
    // More cards will be 'hidden'.
    // This logic is from the CodePen example.
    if (offset === 0) return styles.center;
    if (offset === 1) return styles.right1;
    if (offset === 2) return styles.right2;
    // For a large number of books, cards beyond right2 should be hidden
    // For a small number of books (e.g. 3), offset 2 is also left1.
    if (offset === totalBooks - 1) return styles.left1;
    if (offset === totalBooks - 2) return styles.left2;

    return styles.hidden;
  };

  // Initial book details (will be updated by updateCarousel)
  // We need to ensure currentBook is valid even if books array is temporarily empty during loading sequence.
  const currentBookForDisplay = books[currentIndex] || {};


  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer}>
        <button
          className={`${styles.navArrow} ${styles.leftArrow}`}
          onClick={() => updateCarousel(currentIndex - 1)}
          aria-label="Previous book"
          disabled={isAnimating}
        >
          ‹
        </button>
        <div className={styles.carouselTrack}>
          {books.map((book, index) => {
            const imageSrc = book.coverImageUrl && book.coverImageUrl !== "NO_COVER_AVAILABLE"
              ? book.coverImageUrl
              : `https://via.placeholder.com/220x330.png?text=${encodeURIComponent(book.Title || "Book Cover")}`;

            return (
              <div
                key={book.id || index}
                className={`${styles.card} ${getCardClass(index, currentIndex, books.length)}`}
                data-index={index}
                onClick={() => {
                  if (index !== currentIndex) updateCarousel(index);
                }}
              >
                {/* Link only for the center card or all cards?
                    For now, all cards are links. If only center, conditional rendering needed. */}
                <Link href={`/pages/books/${book.id}`} passHref legacyBehavior>
                  <a
                    className={styles.cardLink}
                    aria-label={`View details for ${book.Title}`}
                    // Prevent navigation if card is not center and carousel is animating
                    onClick={(e) => { if (isAnimating && index !== currentIndex) e.preventDefault();}}
                  >
                    <Image
                      src={imageSrc}
                      alt={book.Title || 'Book cover'}
                      width={220}
                      height={330}
                      className={styles.cardImage}
                      style={{ objectFit: 'cover' }}
                      priority={index === currentIndex}
                      onError={(e) => {
                        if (!e.currentTarget.src.includes('via.placeholder.com')) {
                          e.currentTarget.src = `https://via.placeholder.com/220x330.png?text=${encodeURIComponent(book.Title || "No Cover")}`;
                        }
                      }}
                    />
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
        <button
          className={`${styles.navArrow} ${styles.rightArrow}`}
          onClick={() => updateCarousel(currentIndex + 1)}
          aria-label="Next book"
          disabled={isAnimating}
        >
          ›
        </button>
      </div>

      <div className={styles.bookInfo}>
        <h2 ref={bookTitleRef} className={styles.bookTitle} style={{opacity: 0}}>
            {/* Initial text set by useEffect or leave empty until first update */}
        </h2>
        <p ref={bookAuthorRef} className={styles.bookAuthor} style={{opacity: 0}}>
            {/* Initial text set by useEffect or leave empty until first update */}
        </p>
      </div>

      <div className={styles.dotsContainer}>
        {books.map((_, index) => (
          <div
            key={`dot-${index}`}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
            onClick={() => updateCarousel(index)}
            aria-label={`Go to book ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BookCarousel;