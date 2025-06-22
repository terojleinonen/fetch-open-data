import React from 'react';
import Link from 'next/link';
import Request from '@/app/components/request';
import VillainBookAppearances from './VillainBookAppearances';

export default async function VillainDetailPage({ params }) {
  const villainData = await Request(`villain/${params.id}`);

  if (!villainData || !villainData.data) {
    return (
      <div>
        <h1>Villain Not Found</h1>
        <Link href="/pages/villains">Back to Villains List</Link>
      </div>
    );
  }

  const villain = villainData.data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{villain.name ? villain.name : 'Villain Detail'}</h1>
      <p className="mb-2"><b>ID:</b> {params.id}</p>
      {villain.gender && <p className="mb-2"><b>Gender:</b> {villain.gender}</p>}
      {villain.status && <p className="mb-2"><b>Status:</b> {villain.status}</p>}
      {villain.notes && villain.notes.length > 0 && (
        <div className="mb-2">
          <p><b>Notes:</b></p>
          <ul className="list-disc pl-5">
            {villain.notes.map((note, index) => (
              <li key={index} className="mb-1">{note}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-3 mt-6">Book Appearances:</h2>
      <VillainBookAppearances villainId={params.id} />

      <br />
      <Link href="/pages/villains" className="mt-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow">
        Back to Villains List
      </Link>
    </div>
  );
}
