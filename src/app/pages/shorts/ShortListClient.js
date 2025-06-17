"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Search from "@/app/pages/shorts/search"; // Adjust path if necessary

export default function ShortListClient({ initialShorts }) {
  const router = useRouter();

  const handleRandomShort = () => {
    if (initialShorts && initialShorts.data && initialShorts.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * initialShorts.data.length);
      const randomShort = initialShorts.data[randomIndex];
      if (randomShort && randomShort.id) {
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
      <div className="flex justify-center my-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRandomShort}
        >
          Get Random Short Story
        </button>
      </div>
      <Search data={initialShorts} />
    </div>
  );
}
