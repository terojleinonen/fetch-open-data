"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Request from '@/app/components/request';

export default function VillainBookAppearances({ villainId }) {
  const [allBooks, setAllBooks] = useState([]);
  const [connectedBooks, setConnectedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const booksData = await Request('books');
      if (booksData && booksData.data) {
        setAllBooks(booksData.data);
      } else {
        setAllBooks([]); // Ensure allBooks is an array even if fetch fails
      }
      setLoading(false);
    }
    fetchBooks();
  }, []); // Fetch books only once when the component mounts

  useEffect(() => {
    if (allBooks.length > 0) {
      const filtered = allBooks.filter(book => {
        if (book.villains && Array.isArray(book.villains)) {
          return book.villains.some(v => {
            const urlParts = v.url ? v.url.split('/') : [];
            const villainIdFromBook = urlParts[urlParts.length - 1];
            return villainIdFromBook === villainId;
          });
        }
        return false;
      });
      setConnectedBooks(filtered);
    }
  }, [allBooks, villainId]); // Recalculate connectedBooks if allBooks or villainId changes

  if (loading) {
    return <p>Loading book appearances...</p>;
  }

  if (allBooks.length === 0 && !loading) {
    return <p>Book data is currently unavailable.</p>;
  }

  return (
    <div>
      {connectedBooks.length > 0 ? (
        <ul className="list-disc pl-5">
          {connectedBooks.map(book => (
            <li key={book.id} className="mb-1">
              <Link href={`/pages/books/${book.id}`} className="text-blue-600 hover:underline">
                {book.Title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No book appearances found for this villain.</p>
      )}
    </div>
  );
}
