import React from 'react';
import Link from 'next/link';
import Request from '@/app/components/request';

export default async function BookDetailPage({ params }) {
  const bookData = await Request(`book/${params.id}`);

  if (!bookData || !bookData.data) {
    return (
      <div>
        <h1>Book Not Found</h1>
        <Link href="/pages/books">Back to Books List</Link>
      </div>
    );
  }

  const book = bookData.data;
  const filteredNotes = book.Notes ? book.Notes.filter(note => note.trim() !== '') : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{book.Title}</h1>
      <p className="mb-2"><strong>Year:</strong> {book.Year}</p>
      <p className="mb-2"><strong>Publisher:</strong> {book.Publisher}</p>
      <p className="mb-2"><strong>ISBN:</strong> {book.ISBN}</p>
      <p className="mb-2"><strong>Pages:</strong> {book.Pages}</p>
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

      {/* Villains in this Book Section */}
      {book.villains && book.villains.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">Villains in this Book</h2>
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
                <li key={villain.url}> {/* Using URL as key assuming it's unique here */}
                  <Link href={`/pages/villains/${villainId}`} className="text-blue-600 hover:underline">
                    {villain.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {(!book.villains || book.villains.length === 0) && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">Villains in this Book</h2>
          <p>No villains listed for this book.</p>
        </div>
      )}

      <br />
      <Link href="/pages/books" className="mt-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow">
        Back to Books List
      </Link>
    </div>
  );
}
