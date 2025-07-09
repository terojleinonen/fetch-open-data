import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
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
      <Link href="/pages/villains" className="text-blue-500 hover:underline mb-6 inline-block">
            &larr; Back to Villains List
          </Link>
      <div className="details-box">
        <div className="md:flex md:space-x-6"> {/* Flex container for medium screens and up */}
          {/* Image Placeholder (Left Column on MD+) */}
          <div className="md:w-1/3 mb-4 md:mb-0"> {/* Takes 1/3 width on medium screens, full on small */}
            <div className="relative w-full aspect-[4/3] bg-neutral-700 overflow-hidden rounded-lg flex items-center justify-center">
              {villain.image_url ? (
                <Image
                  src={villain.image_url}
                  alt={`Image of ${villain.name}`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Details (Right Column on MD+) */}
          <div className="md:w-2/3"> {/* Takes 2/3 width on medium screens, full on small */}
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
          </div>
        </div>

        {/* Book Appearances and Back Link - Full Width Below */}
        <div className="mt-6"> {/* Added margin-top for spacing */}
          <h2 className="text-2xl font-semibold mb-3">Appearances:</h2>
          <VillainBookAppearances books={villain.books || []} shorts={villain.shorts || []} />
        </div>

        <div className="mt-8 text-center md:text-left"> {/* Adjusted margin and text alignment for button */}          
        </div>
      </div>
    </div>
  );
}