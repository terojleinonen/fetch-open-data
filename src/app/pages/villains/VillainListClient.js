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
  const router = useRouter();

  // Memoized variable for filtered villains based on the search term
  const filteredVillains = useMemo(() => {
    if (!initialVillains || !initialVillains.data) return [];
    return initialVillains.data.filter(villain =>
      villain.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialVillains, searchTerm]);

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
    <div>
      {/* Button to get a random villain */}
      <div className="flex justify-center my-4">
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRandomVillain}
        >
          Get Random Villain
        </button>
      </div>

      {/* Search input */}
      <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow">
         <input
             type="text"
             placeholder="Search villains..."
             className="w-full p-2 rounded bg-gray-700 text-white"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
     </div>

      {/* Villains List Display */}
      {/* Renders the list of filtered villains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredVillains.map(villain => (
             <div key={villain.id} className="p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition-colors">
                 <h2 className="text-xl font-semibold text-purple-400">
                     <Link href={`/pages/villains/${villain.id}`}>
                         {villain.name}
                     </Link>
                 </h2>
                 {/* Add any other brief details if desired, e.g., villain.status */}
                 {villain.status && <p className="text-sm text-gray-400">Status: {villain.status}</p>}
             </div>
         ))}
     </div>
     {/* Display a message if no villains match the search term */}
     {filteredVillains.length === 0 && searchTerm && (
         <p className="text-center text-gray-400 mt-4">No villains found matching your search.</p>
     )}

    </div>
  );
}
