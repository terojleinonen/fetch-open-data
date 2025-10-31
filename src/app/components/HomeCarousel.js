
"use client";
// src/app/components/HomeCarousel.js
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HomeCarousel = () => {
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books/carousel');
        if (!response.ok) {
          throw new Error('Failed to fetch carousel books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [books]);

  if (loading) {
    return <div className="home-carousel-status">Loading...</div>;
  }

  if (books.length === 0) {
    return <div className="home-carousel-status">No books to display.</div>;
  }

  return (
    <section className="home-carousel">
      {books.map((book, index) => (
        <div
          key={book.id}
          className={`home-carousel-item slideshow-item ${index === currentIndex ? 'active' : ''}`}>
          <Link href={`/books/${book.id}`} legacyBehavior>
            <a className="slideshow-link-content">
              <Image
                src={book.coverImageUrl || '/next.svg'} // Fallback image
                alt={book.title}
                width={200}
                height={300}
                className="home-carousel-image"
              />
              <div className="home-carousel-caption">
                <p>{book.title}</p>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </section>
  );
};

export default HomeCarousel;
