"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * BookListClient component for displaying and filtering a list of books.
 * @param {object} props - Component props.
 * @param {object} props.initialBooks - Initial list of books to display.
 * @returns {JSX.Element} The BookListClient component.
 */
export default function BookListClient({ initialBooks }) {
   // State variable for the search term
   const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Memoized variable for filtered books based on the search term
  const filteredBooks = useMemo(() => {
      if (!initialBooks || !initialBooks.data) return [];
      return initialBooks.data.filter(books =>
        books.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [initialBooks, searchTerm]);

  // Function to handle selecting and navigating to a random book
  const handleRandomBook = () => {
    // Check if there are books available
    if (initialBooks && initialBooks.data && initialBooks.data.length > 0) {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * initialBooks.data.length);
      // Get the random book
      const randomBook = initialBooks.data[randomIndex];
      // Check if the book and its ID are valid
      if (randomBook && randomBook.id) {
        // Navigate to the book's page
        router.push(`/pages/books/${randomBook.id}`);
      } else {
        console.error("Failed to get random book or book ID is missing", randomBook);
      }
    } else {
      console.error("No books available to select a random one from.");
    }
  };

  return (
    <div>
      {/* Button to get a random book */}
      <div className="flex justify-center my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRandomBook}
        >
          Get Random Book
        </button>
      </div>
      
      {/* Search input */}
      <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow">
         <input
             type="text"
             placeholder="Search villains..."
             className="w-full p-2 rounded bg-gray-700 text-white"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
     </div>

      {/* Books List Display */}
      {/* Renders the list of filtered books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredBooks.map(books => (
             <div key={books.id} className="p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition-colors">
                 <h2 className="text-xl font-semibold text-purple-400">
                     <Link href={`/pages/books/${books.id}`}>
                         {books.Title}
                     </Link>
                 </h2>
                 {/* Add any other brief details if desired, e.g., villain.status */}
                 {books.status && <p className="text-sm text-gray-400">Status: {books.status}</p>}
             </div>
         ))}
     </div>
     {/* Display a message if no books match the search term */}
     {filteredBooks.length === 0 && searchTerm && (
         <p className="text-center text-gray-400 mt-4">No villains found matching your search.</p>
     )}
    </div>
  );
}
