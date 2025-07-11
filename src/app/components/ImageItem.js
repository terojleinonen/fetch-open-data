// src/app/components/ImageItem.js
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ImageItem = ({ item, detailedData, onVisible }) => {
  const { title, linkUrl } = item; // Initial imageUrl might be undefined or a placeholder
  const placeholderRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    // If detailedData is already provided (e.g. from cache, or loaded very quickly),
    // no need for observer for this item if it means it's already loaded.
    // However, onVisible might still be used for other purposes by parent.
    // We only want to trigger onVisible *once* when it first becomes visible.
    if (hasBeenVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (onVisible && !hasBeenVisible) {
            onVisible();
            setHasBeenVisible(true); // Ensure onVisible is called only once
          }
          // No need to unobserve if we only want to trigger once
          // observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the item is visible
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => {
      if (placeholderRef.current) {
        observer.unobserve(placeholderRef.current);
      }
      observer.disconnect();
    };
  }, [onVisible, hasBeenVisible]);

  // Determine the image URL to use
  // Prioritize detailedData if available, otherwise use item.imageUrl (initial)
  let displayImageUrl = detailedData?.largeCoverImageUrl || detailedData?.coverImageUrl || item.imageUrl;

  // Ensure displayImageUrl is a non-empty string before passing to Image component.
  // Also handle "NO_COVER_AVAILABLE" explicitly to render placeholder.
  const isValidImageUrl = typeof displayImageUrl === 'string' && displayImageUrl.trim() !== '' && displayImageUrl !== "NO_COVER_AVAILABLE";

  const content = (
    <div ref={placeholderRef} className="group relative aspect-[3/4] w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {(isVisible || isValidImageUrl) && isValidImageUrl ? (
        <Image
          src={displayImageUrl} // Now guaranteed to be a valid string if this branch is taken
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
