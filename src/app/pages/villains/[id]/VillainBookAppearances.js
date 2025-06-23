"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Request from '@/app/components/request';

export default function VillainBookAppearances({ villainId }) {
  const [initialSkBooks, setInitialSkBooks] = useState([]); // Books from SK API without Google enrichment
  const [connectedSkBooks, setConnectedSkBooks] = useState([]); // Filtered SK books for this villain
  const [enrichedConnectedBooks, setEnrichedConnectedBooks] = useState([]); // Connected books after Google enrichment

  const [loadingSkBooks, setLoadingSkBooks] = useState(true); // Loading state for initial SK books fetch
  const [enrichingBooks, setEnrichingBooks] = useState(false); // Loading state for Google Books enrichment phase

  // Effect 1: Fetch all books from SK API (without Google Books data)
  useEffect(() => {
    async function fetchInitialBooks() {
      setLoadingSkBooks(true);
      try {
        const booksData = await Request('books', { skipGoogleBooks: true });
        if (booksData && booksData.data) {
          setInitialSkBooks(Array.isArray(booksData.data) ? booksData.data : []);
        } else {
          setInitialSkBooks([]);
          console.error("Failed to fetch initial books or data format is incorrect:", booksData);
        }
      } catch (error) {
        console.error("Error fetching initial SK books:", error);
        setInitialSkBooks([]);
      }
      setLoadingSkBooks(false);
    }
    fetchInitialBooks();
  }, []); // Fetch initial SK books only once when the component mounts

  // Effect 2: Filter SK books once they are loaded and villainId is available
  useEffect(() => {
    if (initialSkBooks.length > 0 && villainId) {
      const filtered = initialSkBooks.filter(book => {
        if (book.villains && Array.isArray(book.villains)) {
          return book.villains.some(v => {
            const urlParts = v.url ? String(v.url).split('/') : [];
            const villainIdFromBook = urlParts[urlParts.length - 1];
            return villainIdFromBook === String(villainId);
          });
        }
        return false;
      });
      setConnectedSkBooks(filtered);
    } else {
      setConnectedSkBooks([]); // Reset if no initial books or villainId
    }
  }, [initialSkBooks, villainId]);

  // Effect 3: Enrich connected SK books with Google Books data
  useEffect(() => {
    async function enrichBooks() {
      if (connectedSkBooks.length === 0) {
        setEnrichedConnectedBooks([]); // Clear if no connected books
        return;
      }
      setEnrichingBooks(true);
      setEnrichedConnectedBooks([]); // Clear previous results before enriching new ones

      try {
        const enrichedPromises = connectedSkBooks.map(skBook =>
          Request(`book/${skBook.id}`) // This call will include Google Books data by default
        );
        const results = await Promise.all(enrichedPromises);

        // Process results: API returns { data: bookObject }, so extract .data
        const successfullyEnriched = results
          .filter(result => result && result.data)
          .map(result => result.data);

        setEnrichedConnectedBooks(successfullyEnriched);
      } catch (error) {
        console.error("Error enriching books with Google Books data:", error);
        // Optionally, set connectedSkBooks here if you want to display them without enrichment on error
        // For now, we'll just show an empty list or whatever enrichedConnectedBooks was before the error.
      }
      setEnrichingBooks(false);
    }

    enrichBooks();
  }, [connectedSkBooks]); // Re-run when connectedSkBooks changes

  if (loadingSkBooks) {
    return <p>Loading book appearances (Phase 1)...</p>;
  }

  if (initialSkBooks.length === 0 && !loadingSkBooks) {
    return <p>Book data is currently unavailable or failed to load.</p>;
  }

  if (enrichingBooks && connectedSkBooks.length > 0) {
    return <p>Loading book details (Phase 2)...</p>;
  }

  // Display enriched books if available, otherwise message
  const booksToDisplay = enrichedConnectedBooks.length > 0 ? enrichedConnectedBooks : [];

  return (
    <div>
      {booksToDisplay.length > 0 ? (
        <ul className="list-disc pl-5">
          {booksToDisplay.map(book => (
            <li key={book.id} className="mb-1">
              <Link href={`/pages/books/${book.id}`} className="text-blue-600 hover:underline">
                {book.Title || `Book ID: ${book.id}`}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No book appearances found for this villain after checking all data.</p>
      )}
    </div>
  );
}
