'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Correct hook for App Router
import Link from 'next/link';
import Image from 'next/image';

export default function BookDetailsPage() {
  const params = useParams(); // Hook to access route parameters
  const id = params ? params.id : null; // Get the book ID from the URL

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      // Should not happen if routing is set up correctly, but good for robustness
      setError("Book ID is missing.");
      setLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/google-books-proxy?volumeId=${id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.statusText}` }));
          if (response.status === 404) {
            throw new Error(`Book with ID ${id} not found. ${errorData.error || ''}`);
          }
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Proxy API Response (BookDetails):', data);
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]); // Refetch if the ID changes

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading book details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!book) {
    return <div className="container mx-auto p-4 text-center">Book details not available.</div>;
  }

  const { volumeInfo } = book;

  // Helper function to ensure HTTPS and optionally remove &edge=curl
  const getSecureImageUrl = (url) => {
    if (!url) return null;
    let secureUrl = url.replace(/^http:\/\//i, 'https://');
    // secureUrl = secureUrl.replace(/&edge=curl/gi, ''); // Optionally remove &edge=curl
    return secureUrl;
  };

  const imageUrl = getSecureImageUrl(volumeInfo.imageLinks?.large || volumeInfo.imageLinks?.medium || volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail);

  return (
    <div className="container mx-auto p-4">
      <Link href="/pages/google-books" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to Book List
      </Link>

      <div className="details-box shadow-xl rounded-lg overflow-hidden md:flex">
        <div className="relative w-full md:w-1/3 h-96 p-4"> {/* Added position: relative and defined height */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Cover of ${volumeInfo.title}`}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"> {/* Adjusted to fill parent */}
            No Image Available
          </div>
        )}
        </div> {/* Closing the div for image container */}
        <div className="p-6 md:w-2/3">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{volumeInfo.title}</h1>
          {volumeInfo.subtitle && (
            <h2 className="text-xl text-gray-600 mb-4">{volumeInfo.subtitle}</h2>
          )}

          <div className="mb-4">
            <strong>Author(s):</strong> {volumeInfo.authors ? volumeInfo.authors.join(', ') : 'N/A'}
          </div>
          <div className="mb-4">
            <strong>Publisher:</strong> {volumeInfo.publisher || 'N/A'}
          </div>
          <div className="mb-4">
            <strong>Published Date:</strong> {volumeInfo.publishedDate || 'N/A'}
          </div>
          <div className="mb-4">
            <strong>Page Count:</strong> {volumeInfo.pageCount || 'N/A'}
          </div>
          {volumeInfo.categories && (
            <div className="mb-4">
              <strong>Categories:</strong> {volumeInfo.categories.join(', ')}
            </div>
          )}
          {volumeInfo.averageRating && (
            <div className="mb-4">
              <strong>Average Rating:</strong> {volumeInfo.averageRating} ({volumeInfo.ratingsCount || 0} ratings)
            </div>
          )}
          {volumeInfo.language && (
             <div className="mb-4">
              <strong>Language:</strong> {volumeInfo.language.toUpperCase()}
            </div>
          )}

          <h3 className="text-2xl font-semibold mt-6 mb-2">Description</h3>
          {volumeInfo.description ? (
            <div dangerouslySetInnerHTML={{ __html: volumeInfo.description }} className="prose max-w-none"></div>
          ) : (
            <p>No description available.</p>
          )}

          {volumeInfo.previewLink && (
            <a
              href={volumeInfo.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Preview on Google Books
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
