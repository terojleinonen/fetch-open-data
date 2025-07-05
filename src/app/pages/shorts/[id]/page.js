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

// Moved imports to the top level
import AdaptationList from '@/app/components/AdaptationList';
// Dynamically importing JSON is fine, but for consistency with books page and typical server component patterns,
// a static import is also okay if not specifically needing lazy load for the JSON itself.
// However, the await import() pattern is valid in Server Components for data.
// For this fix, ensuring AdaptationList is a top-level static import is key.
// Let's assume direct import for allAdaptationsData for simplicity like in books page,
// unless lazy loading of the JSON data itself was a specific performance goal.
import allAdaptationsData from '@/app/data/adaptations.json';

  const story = shortData.data;
  const filteredNotes = story.notes ? story.notes.filter(note => note && note.trim() !== '') : [];

  // Helper function to normalize title for matching (can be moved to a shared util if used in more places)
  const normalizeTitleForMatch = (title) => {
    if (!title) return '';
    return title.toLowerCase()
      .replace(/\b(the|a|an)\b/g, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '')
      .trim();
  };

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

      {/* Adaptations Section */}
      {/* Removed React.Suspense and React.lazy as AdaptationList is now directly imported */}
      <AdaptationList adaptations={
        allAdaptationsData.filter(adaptation => {
          const normStoryTitle = normalizeTitleForMatch(story.title);
            const normOriginalWorkTitle = normalizeTitleForMatch(adaptation.originalWorkTitle);

            return normOriginalWorkTitle === normStoryTitle ||
                   (adaptation.originalWorkTitle === adaptation.adaptationTitle && normalizeTitleForMatch(adaptation.adaptationTitle) === normStoryTitle);
          })
        } />
      </React.Suspense>

      </div>
    </div>
  );
}
