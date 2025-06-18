"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookListClient({ initialBooks }) {
   const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredBooks = useMemo(() => {
      if (!initialBooks || !initialBooks.data) return [];
      return initialBooks.data.filter(books =>
        books.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [initialBooks, searchTerm]);

  const handleRandomBook = () => {
    if (initialBooks && initialBooks.data && initialBooks.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * initialBooks.data.length);
      const randomBook = initialBooks.data[randomIndex];
      if (randomBook && randomBook.id) {
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
      <div className="flex justify-center my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRandomBook}
        >
          Get Random Book
        </button>
      </div>
      
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
     {filteredBooks.length === 0 && searchTerm && (
         <p className="text-center text-gray-400 mt-4">No villains found matching your search.</p>
     )}
    </div>
  );
}
