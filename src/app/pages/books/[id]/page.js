import React from 'react';
import Link from 'next/link';
import SafeImage from '@/app/components/SafeImage';
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

export default async function BookDetailPage({ params }) {
  // `params` can be a thenable in some Next.js streaming scenarios — await it
  const awaitedParams = await params;
  const id = awaitedParams?.id;

  console.log(`[INFO] /pages/books/${id}: Fetching book data...`);
  let bookData;
  try {
    bookData = await Request(`book/${id}`);
    if (!bookData || !bookData.data) {
      console.warn(`[WARN] /pages/books/${id}: No bookData or bookData.data found.`);
    } else {
      console.log(`[INFO] /pages/books/${id}: Successfully fetched data for "${bookData.data.Title}".`);
    }
  } catch (error) {
    console.error(`[ERROR] /pages/books/${id}: Error fetching book data:`, error);
    bookData = { error: `Failed to load book data for ID ${id} due to an error.`, data: null };
  }

  if (!bookData || !bookData.data) {
    return (
      <div className="container mx-auto p-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--accent-color)] mb-4">Book Not Found</h1>
        <p className="text-[var(--text-color)] mb-6">Sorry, we couldn&apos;t find the book you were looking for.</p>
        <Link href="/pages/books" className="inline-block bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--sk-text-dark)] font-semibold py-2 px-4 rounded shadow transition-colors">
          Back to Books List
        </Link>
      </div>
    );
  }

  const book = bookData.data;
  const filteredNotes = book.Notes ? book.Notes.filter(note => note.trim() !== '') : [];

  const renderDetail = (label, value) => {
    if (!value) return null;
    return (
      <p className="mb-1 text-sm text-[var(--text-color)]">
        <span className="font-semibold">{label}:</span> {value}
      </p>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href="/pages/books" className="mb-6 inline-block pt-8">
          &larr; Back to Books List
        </Link>
      <div className="details-box">
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
            <div className="relative w-full max-w-xs md:max-w-sm h-auto aspect-[2/3]">
              {book.largeCoverImageUrl && book.largeCoverImageUrl !== "NO_COVER_AVAILABLE" ? (
                <SafeImage
                  src={book.largeCoverImageUrl}
                  alt={`Cover of ${book.Title}`}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
                  className="rounded-lg shadow-lg object-contain"
                  priority
                  fallbackText="No Cover Available"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--sk-shadow-light)] dark:bg-[var(--sk-shadow-dark)] text-[var(--text-color)] opacity-70 rounded-lg shadow-md">
                  No Cover Available
                </div>
              )}
            </div>
          </div>

        <div className="md:w-2/3 md:pl-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent-color)] mb-2">{book.Title}</h1>
          {book.subtitle && <p className="text-xl text-[var(--text-color)] opacity-80 mb-3">{book.subtitle}</p>}

          {book.authors && book.authors.length > 0 && (
            <p className="text-lg text-[var(--text-color)] mb-4">
              By: <span className="font-medium">{book.authors.join(', ')}</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-4">
            <div>
              {renderDetail("Year", book.Year)}
              {renderDetail("Published Date", book.publishedDate)}
              {renderDetail("Publisher", book.Publisher)}
            </div>
            <div>
              {renderDetail("ISBN", book.ISBN)}
              {renderDetail("Pages", book.Pages || book.pageCount)}
              {renderDetail("Language", book.language?.toUpperCase())}
            </div>
          </div>

          {book.categories && book.categories.length > 0 && (
            <div className="mb-4">
              <strong className="text-sm font-semibold">Categories:</strong>
              <span className="ml-2 text-sm">{book.categories.join(', ')}</span>
            </div>
          )}

          {typeof book.averageRating === 'number' && (
            <p className="mb-4 text-sm">
              <span className="font-semibold">Average Rating:</span> {book.averageRating} (based on {book.ratingsCount || 'N/A'} ratings)
            </p>
          )}

          {book.description && (
            <div className="mt-4 mb-6">
              <h2 className="text-xl font-semibold text-[var(--accent-color)] mb-2">Description</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed">{book.description}</p>
            </div>
          )}

          {book.summary && (!book.description || book.description !== book.summary) && (
            <div className="mt-4 mb-6">
              <h2 className="text-xl font-semibold text-[var(--accent-color)] mb-2">Summary</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed">{book.summary}</p>
            </div>
          )}
        </div>
      </div>

      {filteredNotes.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
          <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-3">Notes</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {filteredNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {book.villains && book.villains.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
          <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-3">Villains in this Book</h2>
          <ul className="list-disc pl-5 space-y-1">
            {book.villains.map(villain => {
              if (!villain.url || !villain.name) {
                console.warn("Skipping villain with missing URL or name:", villain);
                return null; 
              }
              const urlParts = villain.url.split('/');
              const villainId = urlParts[urlParts.length - 1];
              
              if (isNaN(Number(villainId))) {
                  console.warn("Skipping villain with invalid ID from URL:", villain.url);
                  return null;
              }

              return (
                <li key={villain.url}>
                  <Link href={`/pages/villains/${villainId}`} className="text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] hover:underline text-sm">
                    {villain.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {(!book.villains || book.villains.length === 0) && bookData?.data && (
        <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
          <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-3">Villains in this Book</h2>
          <p className="text-sm">No villains listed for this book.</p>
        </div>
      )}

      <AdaptationList adaptations={
        allAdaptationsData.filter(adaptation => {
          const normBookTitle = normalizeTitleForMatch(book.Title);
          const normOriginalWorkTitle = normalizeTitleForMatch(adaptation.originalWorkTitle);

          return normOriginalWorkTitle === normBookTitle ||
                 (adaptation.originalWorkTitle === adaptation.adaptationTitle && normalizeTitleForMatch(adaptation.adaptationTitle) === normBookTitle);
        })
      } />

      </div>
    </div>
  );
}
