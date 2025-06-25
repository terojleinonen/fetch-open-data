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

  // Function to handle selecting and navigating to a random short story
  const handleRandomShort = () => {
    // Check if there are short stories available
    if (initialShorts && initialShorts.data && initialShorts.data.length > 0) {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * initialShorts.data.length);
      // Get the random short story
      const randomShort = initialShorts.data[randomIndex];
      // Check if the short story and its ID are valid
      if (randomShort && randomShort.id) {
        // Navigate to the short story's page
        router.push(`/pages/shorts/${randomShort.id}`);
      } else {
        console.error("Failed to get random short story or ID is missing", randomShort);
      }
    } else {
      console.error("No short stories available to select a random one from.");
    }
  };

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
     </div>

      {/* Header Row */}
      <div className="flex justify-between items-center p-4 text-[var(--accent-color)] font-semibold">
        <div className="flex-1 text-left">Title</div>
        <div className="flex-1 text-center">Type</div>
        <div className="flex-1 text-right">Year</div>
      </div>
      {/* Separator Line */}
      <hr className="mb-2 border-[var(--accent-color)] opacity-50" />

      {/* Shorts List Display */}
      {/* Renders the list of filtered short stories */}
      <div className="shorts-list-container flex flex-col gap-2">
         {filteredShorts.map(short => (
             <div key={short.id} className="short-item p-4 rounded-lg shadow transition-colors"> {/* Removed border classes */}
                <Link href={`/pages/shorts/${short.id}`} className="flex justify-between items-center w-full">
                    <div className="flex-1 text-left text-xl font-semibold text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] truncate pr-2">
                        {short.title}
                    </div>
                    <div className="flex-1 text-center text-sm text-[var(--text-color)] opacity-75 px-2 capitalize">
                        {short.type || 'N/A'} {/* Display type or N/A if not available */}
                    </div>
                    <div className="flex-1 text-right text-sm text-[var(--text-color)] opacity-75 pl-2">
                        {short.year || 'N/A'} {/* Display year or N/A if not available */}
                    </div>
                </Link>
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
