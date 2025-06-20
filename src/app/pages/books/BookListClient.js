"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FilterPopup from './FilterPopup';

/**
 * BookListClient component for displaying and filtering a list of books.
 * @param {object} props - Component props.
 * @param {object} props.initialBooks - Initial list of books to display.
 * @returns {JSX.Element} The BookListClient component.
 */
export default function BookListClient({ initialBooks }) {
   // State variable for the search term
   const [searchTerm, setSearchTerm] = useState('');
   // State variable for the sort order
   const [sortOrder, setSortOrder] = useState('alphabetical');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [minPages, setMinPages] = useState('');
  const [maxPages, setMaxPages] = useState('');
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const router = useRouter();

  // Memoized variable for filtered books based on the search term and sort order
  const filteredBooks = useMemo(() => {
    if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) return [];

    const minPagesNumeric = minPages !== '' ? parseInt(minPages, 10) : null;
    const maxPagesNumeric = maxPages !== '' ? parseInt(maxPages, 10) : null;
    const yearNumeric = selectedYear !== '' ? parseInt(selectedYear, 10) : null;

    let booksArray = initialBooks.data.filter(book => {
      // Search term filter (existing)
      const searchTermMatch = book.Title.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchTermMatch) return false;

      // Year filter
      if (yearNumeric !== null && book.Year !== yearNumeric) {
        return false;
      }

      // Publisher filter
      if (selectedPublisher && book.Publisher && book.Publisher.toLowerCase() !== selectedPublisher.toLowerCase()) {
        return false;
      }

      // Min pages filter
      if (minPagesNumeric !== null && (!book.Pages || book.Pages < minPagesNumeric)) {
        return false;
      }

      // Max pages filter
      if (maxPagesNumeric !== null && (!book.Pages || book.Pages > maxPagesNumeric)) {
        return false;
      }

      return true;
    });

    if (sortOrder === 'alphabetical') {
      booksArray.sort((a, b) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
    } else if (sortOrder === 'year_newest_to_oldest') {
      booksArray.sort((a, b) => b.Year - a.Year);
    } else if (sortOrder === 'year_oldest_to_newest') {
      booksArray.sort((a, b) => a.Year - b.Year);
    }

    return booksArray;
  }, [initialBooks, searchTerm, sortOrder, selectedYear, selectedPublisher, minPages, maxPages]);

  if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) {
    return (
      <div>
        <h1>সমস্যা</h1>
        <p>Book data is currently unavailable or malformed. Please try again later. The filter menu has been temporarily disabled.</p>
      </div>
    );
  }

  // Function to handle selecting and navigating to a random book
  const handleRandomBook = () => {
    // Check if there are books available
    if (initialBooks && initialBooks.data && Array.isArray(initialBooks.data) && initialBooks.data.length > 0) {
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
    <div className={`transition-[margin-right] duration-300 ease-in-out ${isFilterPopupOpen ? 'md:mr-80' : 'md:mr-0'}`}>
      {/* Button to get a random book */}
      <div className="flex justify-center my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRandomBook}
        >
          Get Random Book
        </button>
      </div>
      
      {/* Search and Sort Controls */}
      <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow flex gap-4">
         <input
             type="text"
             placeholder="Search books..."
             className="w-full p-2 rounded bg-gray-700 text-white"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
         <select
          className="p-2 rounded bg-gray-700 text-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="year_newest_to_oldest">Year (Newest to Oldest)</option>
          <option value="year_oldest_to_newest">Year (Oldest to Newest)</option>
        </select>
        <button
          onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)} // Toggle behavior
          className="p-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-medium"
        >
          Filters
        </button>
     </div>

      <FilterPopup
        isOpen={isFilterPopupOpen}
        initialBooks={initialBooks}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedPublisher={selectedPublisher}
        setSelectedPublisher={setSelectedPublisher}
        minPages={minPages}
        setMinPages={setMinPages}
        maxPages={maxPages}
        setMaxPages={setMaxPages}
        onApplyFilters={() => {
          console.log('Apply filters clicked');
          // Implement actual filter logic here in a future step
          setIsFilterPopupOpen(false);
        }}
        onResetFilters={() => {
          setSelectedYear('');
          setSelectedPublisher('');
          setMinPages('');
          setMaxPages('');
          console.log('Reset filters clicked');
          // Optionally, re-apply filters or close popup
        }}
        onClose={() => setIsFilterPopupOpen(false)}
      />

      {/* Books List Display */}
      {/* Renders the list of filtered books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredBooks.map(book => (
             <div key={book.id} className="p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition-colors">
                 <h2 className="text-xl font-semibold text-purple-400">
                     <Link href={`/pages/books/${book.id}`}>
                         {book.Title}
                     </Link>
                 </h2>
                 {/* Add any other brief details if desired, e.g., book.status */}
                 {book.Year && <p className="text-sm text-gray-400">Year: {book.Year}</p>}
                 {book.status && <p className="text-sm text-gray-400">Status: {book.status}</p>}
             </div>
         ))}
     </div>
     {/* Display a message if no books match the search term */}
     {filteredBooks.length === 0 && searchTerm && (
         <p className="text-center text-gray-400 mt-4">No books found matching your search.</p>
     )}
    </div>
  );
}
