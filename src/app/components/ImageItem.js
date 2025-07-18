// src/app/components/ImageItem.js
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ImageItem = ({ item }) => {
  const { title, linkUrl, imageUrl } = item;
  const placeholderRef = useRef(null);

  const displayImageUrl = imageUrl && imageUrl !== "NO_COVER_AVAILABLE" ? imageUrl : `https://covers.openlibrary.org/b/title/${title}-L.jpg`;

  // Ensure displayImageUrl is a non-empty string before passing to Image component.
  // Also handle "NO_COVER_AVAILABLE" explicitly to render placeholder.
  const isValidImageUrl = typeof displayImageUrl === 'string' && displayImageUrl.trim() !== '';

  const content = (
    <div ref={placeholderRef} className="group relative aspect-[3/4] w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {isValidImageUrl ? (
        <Image
          src={imageUrl}
          alt={title || 'Item image'}
          layout="fill"
          objectFit="cover"
          className="bg-[var(--sk-shadow-light)] dark:bg-[var(--sk-shadow-dark)] transition-transform duration-300 group-hover:scale-105"
          priority={false} // Explicitly set priority to false for lazy-loaded images
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[var(--sk-shadow-light)] dark:bg-[var(--sk-shadow-dark)]">
          {/* Placeholder content, e.g., a spinner or a static icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-[var(--text-color)] opacity-50 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-base font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0">
          {title || 'Untitled Item'}
        </h3>
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