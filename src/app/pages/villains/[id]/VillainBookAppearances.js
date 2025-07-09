"use client";

import React from 'react';
import Link from 'next/link';

export default function VillainBookAppearances({ books = [], shorts = [] }) {
  const appearances = [];

  if (books && books.length > 0) {
    books.forEach(book => {
      if (book.title && book.url) {
        const urlParts = book.url.split('/');
        const bookId = urlParts[urlParts.length - 1];
        appearances.push({
          id: `book-${bookId}`, // Ensure unique key
          title: book.title,
          href: `/pages/books/${bookId}`,
          type: 'Book'
        });
      }
    });
  }

  if (shorts && shorts.length > 0) {
    shorts.forEach(short => {
      if (short.title && short.url) {
        const urlParts = short.url.split('/');
        const shortId = urlParts[urlParts.length - 1];
        // Assuming short stories might also link to a book detail page if they are part of a collection
        // or have their own page. Adjust href if shorts have a different page structure.
        appearances.push({
          id: `short-${shortId}`, // Ensure unique key
          title: short.title,
          href: `/pages/shorts/${shortId}`, // Or /pages/books/${shortId} if appropriate
          type: 'Short Story'
        });
      }
    });
  }

  if (appearances.length === 0) {
    return <p>No book or short story appearances found for this villain.</p>;
  }

  return (
    <div>
      <ul className="list-disc pl-5">
        {appearances.map(appearance => (
          <li key={appearance.id} className="mb-1">
            <Link href={appearance.href} className="">
              {appearance.title}
            </Link>
            {` (${appearance.type})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
