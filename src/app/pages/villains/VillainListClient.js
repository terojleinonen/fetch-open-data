"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VillainListClient({ initialVillains }) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredVillains = useMemo(() => {
    if (!initialVillains || !initialVillains.data) return [];
    return initialVillains.data.filter(villain =>
      villain.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialVillains, searchTerm]);

  const handleRandomVillain = () => {
    if (initialVillains && initialVillains.data && initialVillains.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * initialVillains.data.length);
      const randomVillain = initialVillains.data[randomIndex];
      if (randomVillain && randomVillain.id) {
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
      <div className="flex justify-center my-4">
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRandomVillain}
        >
          Get Random Villain
        </button>
      </div>

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
     {filteredVillains.length === 0 && searchTerm && (
         <p className="text-center text-gray-400 mt-4">No villains found matching your search.</p>
     )}

    </div>
  );
}
