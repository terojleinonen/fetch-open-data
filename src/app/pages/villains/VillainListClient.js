"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import StatusFilterMenu from '@/app/components/StatusFilterMenu'; // Import the new component
import SearchAndSortControls from '@/app/components/SearchAndSortControls'; // Import the new component

/**
 * VillainListClient component for displaying and filtering a list of villains.
 * @param {object} props - Component props.
 * @param {object} props.initialVillains - Initial list of villains to display.
 * @returns {JSX.Element} The VillainListClient component.
 */
export default function VillainListClient({ initialVillains }) {
  // State variable for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // New sortConfig state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  // State variable for search bar visibility - will be removed
  // const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
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
    let processableVillains = [...initialVillains.data];

    // Filter by search term first
    if (searchTerm) {
      processableVillains = processableVillains.filter(villain =>
        villain.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== 'All') {
      processableVillains = processableVillains.filter(villain => villain.status === selectedStatus);
    }

    // Sort villains using sortConfig
    if (sortConfig.key) { // key will be 'name'
      processableVillains.sort((a, b) => {
        const valA = a[sortConfig.key].toLowerCase();
        const valB = b[sortConfig.key].toLowerCase();

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processableVillains;
  }, [initialVillains, searchTerm, sortConfig, selectedStatus]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
          {/* Use new SearchAndSortControls component */}
          <SearchAndSortControls
            searchTerm={searchTerm}
            sortConfig={sortConfig}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onRequestSort={requestSort}
            sortOptions={[{ key: 'name', label: 'Name', title: 'Name' }]} // Property is 'name'
            searchPlaceholder="Search by villain name..."
          />
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