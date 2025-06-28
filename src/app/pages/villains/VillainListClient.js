"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component

/**
 * VillainListClient component for displaying and filtering a list of villains.
 * @param {object} props - Component props.
 * @param {object} props.initialVillains - Initial list of villains to display.
 * @returns {JSX.Element} The VillainListClient component.
 */
export default function VillainListClient({ initialVillains }) {
  // State variable for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // State variable for the sort order
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'
  const router = useRouter();

  // Memoized variable for filtered villains based on the search term and sort order
  const filteredVillains = useMemo(() => {
    if (!initialVillains || !initialVillains.data) return [];
    let villains = [...initialVillains.data];

    // Sort villains
    if (sortOrder !== 'none') {
      villains.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Filter villains
    return villains.filter(villain =>
      villain.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialVillains, searchTerm, sortOrder]);

  return (
    <div className="px-8 py-12">

      {/* Search and Sort Controls */}
      <div className="controls-container mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
         <input
             type="text"
             id="search-villains-input"
             name="search-villains-input"
             placeholder="Search villains..."
             className="w-full md:w-auto flex-grow p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
        <select
          id="sort-villains-select"
          name="sort-villains-select"
          className="p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sort by...</option>
          <option value="asc">Name (A-Z)</option>
          <option value="desc">Name (Z-A)</option>
        </select>
        {/* TODO: Add a filter button if necessary */}
     </div>
      {/* Villains List Display */}
      {/* Renders the list of filtered villains */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Responsive grid */}
        {filteredVillains.map((villain, index) => (
            <div key={villain.id} className="group bg-[var(--background-color)] rounded-lg shadow border border-[var(--accent-color)] hover:border-[var(--hover-accent-color)] transition-all duration-300 ease-in-out flex flex-col overflow-hidden h-full hover:shadow-lg"> {/* Added h-full for consistent height and hover effect, ADDED group CLASS */}
                {/* Villain Image */}
                <div className="relative w-full h-72 flex items-center justify-center bg-neutral-700 overflow-hidden rounded-t-lg">
                  {villain.image_url ? (
                    <Image
                      src={villain.image_url}
                      alt={`Image of ${villain.name}`}
                      fill
                      style={{ objectFit: "contain" }}
                      className="transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                      priority={index < 8} // Approximate priority with eager loading for first few images
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-neutral-500 text-sm"
                    >
                      No image available
                    </div>
                  )}
                </div>
                {/* Villain Details */}
                <div className="p-4 flex flex-col flex-grow"> {/* Added flex-grow to push content to bottom if needed */}
                     <h2 className="text-lg font-semibold text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] mb-1 truncate" title={villain.name}> {/* Truncate title */}
                         <Link href={`/pages/villains/${villain.id}`}>
                             {villain.name}
                         </Link>
                     </h2>
                     {villain.status && <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Status: {villain.status}</p>}

                     <div className="mt-auto pt-2"> {/* Pushes the link to the bottom */}
                        <Link href={`/pages/villains/${villain.id}`} className="text-sm text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] font-medium">
                            View Details
                        </Link>
                     </div>
                 </div>
             </div>
         ))}
     </div>
     {/* Display a message if no villains match the search term */}
     {filteredVillains.length === 0 && searchTerm && (
         <p className="text-center text-[var(--text-color)] mt-4">No villains found matching your search.</p>
     )}

      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}