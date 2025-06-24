"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  // Function to handle selecting and navigating to a random villain
  const handleRandomVillain = () => {
    // Check if there are villains available
    if (initialVillains && initialVillains.data && initialVillains.data.length > 0) {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * initialVillains.data.length);
      // Get the random villain
      const randomVillain = initialVillains.data[randomIndex];
      // Check if the villain and its ID are valid
      if (randomVillain && randomVillain.id) {
        // Navigate to the villain's page
        router.push(`/pages/villains/${randomVillain.id}`);
      } else {
        console.error("Failed to get random villain or villain ID is missing", randomVillain);
      }
    } else {
      console.error("No villains available to select a random one from.");
    }
  };

  return (
    <div className="px-8 py-12">

      {/* Search input and Sort button */}
      <div className="controls-container mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
         <input
             type="text"
             placeholder="Search villains..."
             className="w-full md:w-auto flex-grow p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] hover:text-[var(--background-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] transition-colors md:w-auto w-full"
        >
          Sort by Name ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </button>
     </div>

      {/* Villains List Display */}
      {/* Renders the list of filtered villains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredVillains.map(villain => (
             <div key={villain.id} className="p-4 bg-[var(--background-color)] rounded-lg shadow border border-[var(--accent-color)] hover:border-[var(--hover-accent-color)] transition-colors">
                 <h2 className="text-xl font-semibold text-[var(--accent-color)] hover:text-[var(--hover-accent-color)]">
                     <Link href={`/pages/villains/${villain.id}`}>
                         {villain.name}
                     </Link>
                 </h2>
                 {/* Add any other brief details if desired, e.g., villain.status */}
                 {villain.status && <p className="text-sm text-[var(--text-color)] opacity-75">Status: {villain.status}</p>}
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