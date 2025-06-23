import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import Request from '@/app/components/request';

export default async function BookDetailPage({ params }) {
  const bookData = await Request(`book/${params.id}`);

  if (!bookData || !bookData.data) {
    return (
      <div className="container mx-auto p-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--accent-color)] mb-4">Book Not Found</h1>
        <p className="text-[var(--text-color)] mb-6">Sorry, we couldn't find the book you were looking for.</p>
        <Link href="/pages/books" className="inline-block bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-white font-semibold py-2 px-4 rounded shadow transition-colors">
          Back to Books List
        </Link>
      </div>
    );
  }

  const book = bookData.data;
  const filteredNotes = book.Notes ? book.Notes.filter(note => note.trim() !== '') : [];

  // Helper function to render book details
  const renderDetail = (label, value) => {
    if (!value) return null;
    return (
      <p className="mb-1 text-sm text-[var(--text-color)]">
        <span className="font-semibold">{label}:</span> {value}
      </p>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-[var(--background-color)] text-[var(--text-color)]">
      <div className="md:flex md:space-x-8">
        {/* Left Column: Cover Image */}
        <div className="md:w-1/3 mb-6 md:mb-0">
          {book.largeCoverImageUrl && book.largeCoverImageUrl !== "NO_COVER_AVAILABLE" ? (
            <Image
              src={book.largeCoverImageUrl}
              alt={`Cover of ${book.Title}`}
              width={400} // Max width for the image
              height={600} // Corresponding height, adjust as needed for aspect ratio
              className="rounded-lg shadow-lg object-contain w-full h-auto" // object-contain ensures full image is visible
              priority // Prioritize loading this critical image
            />
          ) : (
            <div className="w-full h-[450px] md:h-[500px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg shadow-md">
              No Cover Available
            </div>
          )}
        </div>

        {/* Right Column: Book Details */}
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent-color)] mb-2">{book.Title}</h1>
          {book.subtitle && <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">{book.subtitle}</p>}

          {book.authors && book.authors.length > 0 && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
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
              {renderDetail("Pages", book.Pages || book.pageCount)} {/* Use pageCount as fallback */}
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

          <div className="space-y-1 mb-6">
            {book.infoLink && <p><a href={book.infoLink} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] hover:underline text-sm">More Info on Google Books</a></p>}
            {book.previewLink && <p><a href={book.previewLink} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] hover:underline text-sm">Preview on Google Books</a></p>}
          </div>

        </div>
      </div>

      {/* Notes and Villains Sections - Full Width Below Columns */}
      {filteredNotes.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-3">Notes</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {filteredNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {book.villains && book.villains.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
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
      {(!book.villains || book.villains.length === 0) && bookData?.data && /* Only show if book data was loaded */ (
        <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-3">Villains in this Book</h2>
          <p className="text-sm">No villains listed for this book.</p>
        </div>
      )}

      <div className="mt-10 text-center md:text-left">
        <Link href="/pages/books" className="inline-block bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-white font-semibold py-2 px-4 rounded shadow transition-colors">
          Back to Books List
        </Link>
      </div>
    </div>
  );
}
