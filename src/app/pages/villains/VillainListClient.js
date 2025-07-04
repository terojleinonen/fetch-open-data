"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import StatusFilterMenu from '@/app/components/StatusFilterMenu'; // Import the new component

/**
 * VillainListClient component for displaying and filtering a list of villains.
 * @param {object} props - Component props.
 * @param {object} props.initialVillains - Initial list of villains to display.
 * @returns {JSX.Element} The VillainListClient component.
 */
export default function VillainListClient({ initialVillains }) {
  // State variable for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // State variable for search bar visibility
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  // State variable for the sort order
  const [nameSortOrder, setNameSortOrder] = useState('A-Z'); // 'A-Z', 'Z-A'
  // State variable for the selected status
  const [selectedStatus, setSelectedStatus] = useState('');
  const router = useRouter();

  // Memoized variable for unique statuses
  const uniqueStatuses = useMemo(() => {
    if (!initialVillains || !initialVillains.data) return [];
    const statuses = new Set(initialVillains.data.map(villain => villain.status).filter(Boolean));
    return ['All', ...Array.from(statuses)];
  }, [initialVillains]);

  // Memoized variable for filtered villains based on the search term, sort order, and selected status
  const filteredVillains = useMemo(() => {
    if (!initialVillains || !initialVillains.data) return [];
    let villains = [...initialVillains.data];

    // Filter by status
    if (selectedStatus && selectedStatus !== 'All') {
      villains = villains.filter(villain => villain.status === selectedStatus);
    }

    // Sort villains
    if (nameSortOrder === 'A-Z') {
      villains.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    } else if (nameSortOrder === 'Z-A') {
      villains.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
    }

    // Filter villains by search term
    return villains.filter(villain =>
      villain.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialVillains, searchTerm, nameSortOrder, selectedStatus]);

  return (
    <div className="py-12"> {/* Removed pr-8 to allow full width for centering */}

      {/* Main layout: Flex container for sidebar and content */}
      {/* Added md:justify-center to center the content block on medium screens and up */}
      <div className="flex flex-col md:flex-row gap-6 md:justify-center"> {/* Adjusted flex direction for mobile and gap */}
        {/* Left Sidebar for Status Filters ONLY - Hidden on mobile, shown on md and up */}
        {/* Reduced width from md:w-1/4 to md:w-1/8 */}
        <div className="hidden md:block md:w-1/8">
          <StatusFilterMenu
            uniqueStatuses={uniqueStatuses}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
          />
        </div>

        {/* Right Content Area for Search, Sort, and Villains List - Takes full width on mobile, 6/8 (3/4) on medium+ */}
        {/* Adjusted width to md:w-6/8 */}
        <div className="w-full md:w-6/8 px-4 md:px-0"> {/* Added horizontal padding for mobile, removed for md+ to rely on parent centering */}
          {/* Search and Sort Controls Container */}
          <div className="controls-container mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
            {/* Sort Button on the left */}
            <div className="flex gap-2">
              <button
                onClick={() => setNameSortOrder(nameSortOrder === 'A-Z' ? 'Z-A' : 'A-Z')}
                className="px-3 py-2 h-10 rounded border किताब-बटन-सीमा किताब-बटन-पाठ किताब-बटन-पृष्ठभूमि hover:किताब-बटन-पृष्ठभूमि-होवर focus:ring-1 focus:ring-[var(--hover-accent-color)] text-xs flex items-center justify-center"
                style={{ minWidth: '4rem' }}
              >
                {nameSortOrder}
              </button>
            </div>

            {/* Search bar and Icon on the right */}
            <div className="flex-grow flex justify-end items-center gap-2 ml-4">
              {isSearchBarVisible && (
                <div className="relative flex-grow">
                  <input
                    type="text"
                    id="search-villains-input"
                    name="search-villains-input"
                    placeholder="Search villains..."
                    className="w-full p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
                className="p-2 h-10 rounded border किताब-बटन-सीमा किताब-बटन-पाठ किताब-बटन-पृष्ठभूमि hover:किताब-बटन-पृष्ठभूमि-होवर focus:ring-1 focus:ring-[var(--hover-accent-color)] flex items-center justify-center flex-shrink-0"
                style={{ minWidth: '2.5rem', width: '2.5rem' }}
                aria-label={isSearchBarVisible ? "Close search bar" : "Open search bar"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
      {/* Header Row for List */}
      <div className="flex justify-between items-center p-4 text-[var(--accent-color)] text-lg font-bold">
        <div className="flex-1 text-left">Name</div>
        <div className="flex-1 text-right">Status</div>
      </div>
      {/* Separator Line */}
      <hr className="mb-2 border-[var(--accent-color)] border-t-2" />

      {/* Villains List Display */}
      {/* Renders the list of filtered villains */}
      <div className="villains-list-container flex flex-col gap-2">
        {filteredVillains.map((villain, index) => (
          <div
            key={villain.id}
            className={`villain-item p-4 rounded-lg shadow transition-colors ${
              index % 2 === 0 ? 'bg-[var(--row-bg-even)]' : 'bg-[var(--row-bg-odd)]'
            }`}
          >
            <Link href={`/pages/villains/${villain.id}`} className="flex justify-between items-center w-full">
              <div className="flex-1 text-left text-base text-[var(--text-color)] truncate pr-2">
                {villain.name}
              </div>
              <div className="flex-1 text-right text-base text-[var(--text-color)] pl-2 capitalize">
                {villain.status || 'N/A'} {/* Display status or N/A if not available */}
              </div>
            </Link>
          </div>
        ))}
      </div>
      {/* Display a message if no villains match the search term */}
     {filteredVillains.length === 0 && searchTerm && (
         <p className="text-center text-[var(--text-color)] mt-4">No villains found matching your search.</p>
     )}
      {/* Display a message if no villains match the status filter */}
      {filteredVillains.length === 0 && selectedStatus && selectedStatus !== 'All' && (
        <p className="text-center text-[var(--text-color)] mt-4">No villains found for the status &apos;{selectedStatus}&apos;.</p>
      )}
        </div>
        {/* Empty div for right-side spacing on medium screens and up, matches sidebar width */}
        <div className="hidden md:block md:w-1/8"></div>
      </div>
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}