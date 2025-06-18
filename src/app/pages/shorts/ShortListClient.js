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
  const router = useRouter();

  // Memoized variable for filtered short stories based on the search term
  const filteredShorts = useMemo(() => {
      if (!initialShorts || !initialShorts.data) return [];
      return initialShorts.data.filter(shorts =>
        shorts.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [initialShorts, searchTerm]);

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
    <div>
      {/* Button to get a random short story */}
      <div className="flex justify-center my-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRandomShort}
        >
          Get Random Short Story
        </button>
      </div>

      {/* Search input */}
      <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow">
         <input
             type="text"
             placeholder="Search shorts..."
             className="w-full p-2 rounded bg-gray-700 text-white"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
         />
     </div>

      {/* Shorts List Display */}
      {/* Renders the list of filtered short stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredShorts.map(shorts => (
             <div key={shorts.id} className="p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition-colors">
                 <h2 className="text-xl font-semibold text-purple-400">
                     <Link href={`/pages/shorts/${shorts.id}`}>
                         {shorts.title}
                     </Link>
                 </h2>
                 {/* Add any other brief details if desired, e.g., villain.status */}
                 {shorts.status && <p className="text-sm text-gray-400">Status: {shorts.status}</p>}
             </div>
         ))}
     </div>
     {/* Display a message if no short stories match the search term */}
     {filteredShorts.length === 0 && searchTerm && (
         <p className="text-center text-gray-400 mt-4">No shorts found matching your search.</p>
     )}
    </div>
  );
}
