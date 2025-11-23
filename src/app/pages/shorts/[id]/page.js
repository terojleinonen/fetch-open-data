import React from 'react';
import Link from 'next/link';
import Request from '@/app/components/request';
import AdaptationList from '@/app/components/AdaptationList';
import allAdaptationsData from '@/app/data/adaptations.json';

// Helper function to normalize title for matching
const normalizeTitleForMatch = (title) => {
  if (!title) return '';
  return title.toLowerCase()
    .replace(/\b(the|a|an)\b/g, '')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '')
    .trim();
};

export default async function ShortStoryDetailPage({ params }) {
  // `params` may be a thenable; await it before reading properties
  const awaitedParams = await params;
  const id = awaitedParams?.id;
  const shortData = await Request(`short/${id}`);

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
      <Link href="/pages/shorts" className="mb-6 inline-block">
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

        <AdaptationList adaptations={
          allAdaptationsData.filter(adaptation => {
            const normStoryTitle = normalizeTitleForMatch(story.title);
            const normOriginalWorkTitle = normalizeTitleForMatch(adaptation.originalWorkTitle);

            return normOriginalWorkTitle === normStoryTitle ||
                   (adaptation.originalWorkTitle === adaptation.adaptationTitle && normalizeTitleForMatch(adaptation.adaptationTitle) === normStoryTitle);
          })
        } />

      </div>
    </div>
  );
}
