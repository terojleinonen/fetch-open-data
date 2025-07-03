"use client";

import React, { useState, useMemo} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TypeFilterMenu from '@/app/components/TypeFilterMenu'; // Import the new component

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
  // State variable for the selected type
  const [selectedType, setSelectedType] = useState('');
  const router = useRouter();

  // Memoized variable for unique types
  const uniqueTypes = useMemo(() => {
    if (!initialShorts || !initialShorts.data) return [];
    const types = new Set(initialShorts.data.map(short => short.type).filter(Boolean));
    return ['All', ...Array.from(types)];
  }, [initialShorts]);

  // Memoized variable for filtered short stories based on the search term and sort order
  const filteredShorts = useMemo(() => {
      if (!initialShorts || !initialShorts.data) return [];
      let shortsArray = initialShorts.data.filter(short =>
        short.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (selectedType && selectedType !== 'All') {
        shortsArray = shortsArray.filter(short => short.type === selectedType);
      }

      if (sortOrder === 'alphabetical') {
        shortsArray.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOrder === 'year_newest_to_oldest') {
        shortsArray.sort((a, b) => b.year - a.year);
      } else if (sortOrder === 'year_oldest_to_newest') {
        shortsArray.sort((a, b) => a.year - b.year);
      }

      return shortsArray;
    }, [initialShorts, searchTerm, sortOrder, selectedType]);

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
    <div className="py-12"> {/* Removed pr-8 to allow full width for centering */}

      {/* Main layout: Flex container for sidebar and content */}
      {/* Added md:justify-center to center the content block on medium screens and up */}
      <div className="flex flex-col md:flex-row gap-6 md:justify-center"> {/* Adjusted flex direction for mobile and gap */}
        {/* Left Sidebar for Type Filters ONLY - Hidden on mobile, shown on md and up */}
        {/* Reduced width from md:w-1/4 to md:w-1/8 */}
        <div className="hidden md:block md:w-1/8">
          <TypeFilterMenu
            uniqueTypes={uniqueTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
        </div>

        {/* Right Content Area for Search, Sort, and Shorts List - Takes full width on mobile, 6/8 (3/4) on medium+ */}
        {/* Adjusted width to md:w-6/8 */}
        <div className="w-full md:w-6/8 px-4 md:px-0"> {/* Added horizontal padding for mobile, removed for md+ to rely on parent centering */}
          {/* Search and Sort Controls Container */}
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

          {/* Header Row for List */}
          <div className="flex justify-between items-center p-4 text-[var(--accent-color)] text-lg font-bold">
            <div className="flex-1 text-left">Title</div>
            <div className="flex-1 text-center">Type</div>
            <div className="flex-1 text-right">Year</div>
          </div>
          {/* Separator Line */}
          <hr className="mb-2 border-[var(--accent-color)] border-t-2" />

          {/* Shorts List Display */}
          {/* Renders the list of filtered short stories */}
          <div className="shorts-list-container flex flex-col gap-2">
            {filteredShorts.map(short => (
                <div key={short.id} className="short-item p-4 rounded-lg shadow transition-colors"> {/* Removed border classes */}
                  <Link href={`/pages/shorts/${short.id}`} className="flex justify-between items-center w-full">
                      <div className="flex-1 text-left text-base text-[var(--text-color)] truncate pr-2">
                          {short.title}
                      </div>
                      <div className="flex-1 text-center text-base text-[var(--text-color)] px-2 capitalize">
                          {short.type || 'N/A'} {/* Display type or N/A if not available */}
                      </div>
                      <div className="flex-1 text-right text-base text-[var(--text-color)] pl-2">
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
          {/* Display a message if no short stories match the type filter */}
          {filteredShorts.length === 0 && selectedType && selectedType !== 'All' && (
            <p className="text-center text-[var(--text-color)] mt-4">No shorts found for the type &apos;{selectedType}&apos;.</p>
          )}
        </div>
        {/* Empty div for right-side spacing on medium screens and up, matches sidebar width */}
        <div className="hidden md:block md:w-1/8"></div>
      </div>
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}