// src/app/components/ImageItem.js
import React, { useEffect, useRef, useState } from 'react';
import SafeImage from './SafeImage';
import Link from 'next/link';

const ImageItem = ({ item }) => {
  const { title, linkUrl, imageUrl } = item;
  const placeholderRef = useRef(null);

  // Prefer the provided imageUrl when valid; otherwise fall back to OpenLibrary cover by title.
  const displayImageUrl = (imageUrl && imageUrl !== "NO_COVER_AVAILABLE" && typeof imageUrl === 'string' && imageUrl.trim() !== '')
    ? imageUrl
    : (title ? `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg` : null);

  // Render SafeImage always; it will show a placeholder if src is missing or fails
  const content = (
    <div ref={placeholderRef} className="group relative aspect-[3/4] w-full bg-[var(--background-color)] rounded-lg overflow-hidden horror-card transition-transform duration-300">
      <SafeImage
        src={displayImageUrl}
        alt={title || 'Item image'}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        className="bg-[var(--sk-shadow-light)] dark:bg-[var(--sk-shadow-dark)] object-cover transition-transform duration-300 group-hover:scale-105"
        priority={false} // lazy by default
        fallbackText="No Cover Image"
      />

      <div className="card-overlay">
        <div className="card-content">
          <h3 className="text-sm font-semibold flicker">{title || 'Untitled Item'}</h3>
          <p className="text-xs opacity-80 mt-2 line-clamp-3">{item.description || item.summary || 'Click to view more details.'}</p>
          <div className="mt-3 text-right">
            <span className="text-xs text-[var(--accent)]">Details →</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <Link href={linkUrl} className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

export default ImageItem;