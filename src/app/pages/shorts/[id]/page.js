import React from 'react';
import Link from 'next/link';
import Request from '@/app/components/request';

export default async function ShortStoryDetailPage({ params }) {
  const shortData = await Request(`short/${params.id}`);

  if (!shortData || !shortData.data) {
    return (
      <div>
        <h1>Short Story Not Found</h1>
        <Link href="/pages/shorts">Back to Shorts List</Link>
      </div>
    );
  }

  const story = shortData.data;
  const filteredNotes = story.notes ? story.notes.filter(note => note && note.trim() !== '') : [];


  return (
    <div className="container mx-auto p-4">
      <Link href="/pages/shorts" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to Shorts List
      </Link>
      <div className="details-box">
        <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
        <p className="mb-2"><strong>Year:</strong> {story.year}</p>
        <p className="mb-2"><strong>Type:</strong> {story.type}</p>
      <p className="mb-2"><strong>Originally Published In:</strong> {story.originallyPublishedIn || 'N/A'}</p>
      <p className="mb-2"><strong>Collected In:</strong> {story.collectedIn || 'N/A'}</p>
      {filteredNotes.length > 0 && (
        <div className="mt-4">
          <strong className="text-lg">Notes:</strong>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            {filteredNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
      <br />      
      </div>
    </div>
  );
}
