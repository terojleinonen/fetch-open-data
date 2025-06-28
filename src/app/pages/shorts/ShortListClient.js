"use client";

import React, { useState, useMemo} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * ShortListClient component for displaying and filtering a list of short stories.
 * @param {object} props - Component props.
 * @param {object} props.initialShorts - Initial list of short stories to display.
 * @returns {JSX.Element} The ShortListClient component.
 */
export default function ShortListClient({ initialShorts }) {
  // State variable for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // State variable for the sort order
  const [sortOrder, setSortOrder] = useState('alphabetical');
  const router = useRouter();

  // Memoized variable for filtered short stories based on the search term and sort order
  const filteredShorts = useMemo(() => {
      if (!initialShorts || !initialShorts.data) return [];
      let shortsArray = initialShorts.data.filter(short =>
        short.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (sortOrder === 'alphabetical') {
        shortsArray.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOrder === 'year_newest_to_oldest') {
        shortsArray.sort((a, b) => b.year - a.year);
      } else if (sortOrder === 'year_oldest_to_newest') {
        shortsArray.sort((a, b) => a.year - b.year);
      }

      return shortsArray;
    }, [initialShorts, searchTerm, sortOrder]);
    
  return (
    <div className="px-8 py-12">

      {/* Search and Sort Controls */}
      <div className="controls-container mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
         <input
             type="text"
             id="search-shorts-input"
             name="search-shorts-input"
             placeholder="Search shorts..."
             className="w-full md:w-auto flex-grow p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
         <select
          id="sort-shorts-select"
          name="sort-shorts-select"
          className="p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="year_newest_to_oldest">Year (Newest to Oldest)</option>
          <option value="year_oldest_to_newest">Year (Oldest to Newest)</option>
        </select>
        {/* TODO: Add a filter button if necessary */}
     </div>

      {/* Shorts List Display */}
      {/* Renders the list of filtered short stories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Responsive grid */}
        {filteredShorts.map(short => (
          <div key={short.id} className="group bg-[var(--background-color)] rounded-lg shadow border border-[var(--accent-color)] hover:border-[var(--hover-accent-color)] transition-all duration-300 ease-in-out flex flex-col overflow-hidden h-full hover:shadow-lg">
            {/* Placeholder for image or icon */}
            <div className="relative w-full h-72 flex items-center justify-center bg-neutral-700 overflow-hidden rounded-t-lg">
              <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                No Image
              </div>
            </div>
            {/* Short Story Details */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] mb-1 truncate" title={short.title}>
                <Link href={`/pages/shorts/${short.id}`}>
                  {short.title}
                </Link>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Type: {short.type || 'N/A'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Year: {short.year || 'N/A'}</p>
              <div className="mt-auto pt-2">
                <Link href={`/pages/shorts/${short.id}`} className="text-sm text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] font-medium">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
     {/* Display a message if no short stories match the search term */}
     {filteredShorts.length === 0 && searchTerm && (
         <p className="text-center text-[var(--text-color)] mt-4">No shorts found matching your search.</p>
     )}
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}