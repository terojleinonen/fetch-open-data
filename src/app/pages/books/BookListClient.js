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
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold text-[var(--accent-color)] mb-4">সমস্যা</h1>
        <p className="text-[var(--text-color)]">Book data is currently unavailable or malformed. Please try again later. The filter menu has been temporarily disabled.</p>
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
    <div className={`px-8 py-12 transition-[margin-right] duration-300 ease-in-out ${isFilterPopupOpen ? 'md:mr-80' : 'md:mr-0'}`}>
      <h1 className="text-5xl md:text-6xl mb-4 text-center text-[var(--text-color)]" style={{ fontFamily: 'Georgia, serif' }}>Books</h1>
      {/* Button to get a random book */}
      <div className="flex justify-center my-4">
        <button
          className="bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] font-bold py-2 px-4 rounded"
          onClick={handleRandomBook}
        >
          Get Random Book
        </button>
      </div>
      
      {/* Search and Sort Controls */}
      <div className="mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
         <input
             type="text"
             placeholder="Search books..."
             className="w-full md:w-auto flex-grow p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
         <select
          className="p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="year_newest_to_oldest">Year (Newest to Oldest)</option>
          <option value="year_oldest_to_newest">Year (Oldest to Newest)</option>
        </select>
        <button
          onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)} // Toggle behavior
          className="bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] font-bold py-2 px-4 h-10 rounded"
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
      <div className="grid grid-cols-1 gap-4"> {/* Changed to single column grid */}
         {filteredBooks.map(book => (
             <div key={book.id} className="p-4 bg-[var(--background-color)] rounded-lg shadow border border-[var(--accent-color)] hover:border-[var(--hover-accent-color)] transition-colors flex flex-row items-start"> {/* Changed to flex-row and items-start */}
                 {/* Book Cover Image */}
                 <div className="flex-none w-1/4 mr-4"> {/* Adjusted width and added margin */}
                     {book.coverImageUrl && book.coverImageUrl !== "NO_COVER_AVAILABLE" ? (
                       <img
                         src={book.coverImageUrl}
                         alt={`Cover of ${book.Title}`}
                         className="h-auto object-contain rounded" // Adjusted styling (removed w-full)
                       />
                     ) : (
                       <div
                         className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500 rounded" // Adjusted styling
                       >
                         No Cover Available
                       </div>
                     )}
                 </div>
                 {/* Book Details */}
                 <div className="flex-grow"> {/* Takes remaining space */}
                     <h2 className="text-xl font-semibold text-[var(--accent-color)] hover:text-[var(--hover-accent-color)]">
                         <Link href={`/pages/books/${book.id}`}>
                             {book.Title}
                         </Link>
                     </h2>
                     {book.Year && <p className="text-sm text-[var(--text-color)]">Year: {book.Year}</p>}
                     {book.Publisher && <p className="text-sm text-[var(--text-color)]">Publisher: {book.Publisher}</p>}
                     {book.Pages && <p className="text-sm text-[var(--text-color)]">Pages: {book.Pages}</p>}
                     {book.status && <p className="text-sm text-[var(--text-color)]">Status: {book.status}</p>}
                 </div>
             </div>
         ))}
     </div>
     {/* Display a message if no books match the search term */}
     {filteredBooks.length === 0 && searchTerm && (
         <p className="text-center text-[var(--text-color)] mt-4">No books found matching your search.</p>
     )}
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}
