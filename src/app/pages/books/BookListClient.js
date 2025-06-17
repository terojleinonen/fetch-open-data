"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Search from "@/app/pages/books/search"; // Path to your Search component

export default function BookListClient({ initialBooks }) {
  const router = useRouter();

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
      <Search data={initialBooks} />
    </div>
  );
}
