"use client";

import React, { useState } from 'react';
import Image from 'next/image';

// SafeImage: client component wrapper for next/image that handles error states
// Props: src, alt, fill, sizes, className, style, priority, fallbackText
export default function SafeImage({ src, alt, fill = false, sizes, className, style, priority = false, fallbackText = 'No image available', ...rest }) {
  const [errored, setErrored] = useState(false);
  const [triedOriginal, setTriedOriginal] = useState(false);
  const [srcState, setSrcState] = useState(src);

  if (!srcState || typeof srcState !== 'string' || srcState.trim() === '' || errored) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center text-[var(--text-color)] opacity-80 ${className || ''}`} style={style}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" fill="rgba(0,0,0,0.12)" />
          <path d="M8 10l2.5 3 2-2.5L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div className="text-xs opacity-90">{fallbackText}</div>
      </div>
    );
  }

  return (
    <Image
      src={srcState}
      alt={alt || 'Image'}
      {...(fill ? { fill: true } : {})}
      sizes={sizes}
      className={className}
      style={style}
      priority={priority}
      onError={() => {
        // If the URL uses Wikimedia `/thumb/` pattern, try the original image path once
        if (!triedOriginal && typeof srcState === 'string' && srcState.includes('/thumb/')) {
          try {
            // Convert: /.../thumb/<rest>/<file> -> /.../<rest>
            const original = srcState.replace(/\/thumb\/(.+)\/[^/]+$/, '/$1');
            setSrcState(original);
            setTriedOriginal(true);
            return;
          } catch (e) {
            // fall through to mark errored
          }
        }
        setErrored(true);
      }}
      unoptimized={true}
      {...rest}
    />
  );
}
