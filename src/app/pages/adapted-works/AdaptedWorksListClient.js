"use client";

import React from 'react';
import Link from 'next/link';

export default function AdaptedWorksListClient({ adaptations }) {
  if (!adaptations || adaptations.length === 0) {
    return (
      <div className="px-8 py-12">
        <p className="text-[var(--text-color)]">No adaptations information available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-[var(--text-color)] max-w-5xl">
      {/* The PageTitle component is now handled by the main layout, so we don't need it here explicitly if using the global one */}
      {/* If a unique title style for this page is needed, it can be added here */}

      <ul className="space-y-6">
        {adaptations.map((adaptation, index) => (
          <li
            key={`${adaptation.adaptationLink}-${index}`}
            className="p-6 border border-[var(--border-color)] rounded-lg shadow-lg bg-[var(--background-start-rgb)] bg-opacity-50 backdrop-blur-md"
          >
            <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-2">
              <a
                href={adaptation.adaptationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {adaptation.adaptationTitle}
              </a>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <p><strong className="font-medium">Year:</strong> {adaptation.year}</p>
              <p><strong className="font-medium">Type:</strong> {adaptation.type}</p>
            </div>
            {adaptation.originalWorkTitle && (
              <div className="mt-2 text-sm">
                <strong className="font-medium">Based on: </strong>
                {adaptation.originalWorkLink.startsWith('http') ? (
                  <a
                    href={adaptation.originalWorkLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="italic text-[var(--link-color)] hover:underline"
                  >
                    {adaptation.originalWorkTitle}
                  </a>
                ) : (
                  <Link href={adaptation.originalWorkLink} legacyBehavior>
                    <a className="italic text-[var(--link-color)] hover:underline">
                      {adaptation.originalWorkTitle}
                    </a>
                  </Link>
                )}
                {adaptation.originalWorkType && (
                  <span className="text-gray-600 dark:text-gray-400"> ({adaptation.originalWorkType})</span>
                )}
              </div>
            )}
            {adaptation.posterUrl && (
              <div className="mt-4 max-w-xs mx-auto md:mx-0">
                <img
                  src={adaptation.posterUrl}
                  alt={`Poster for ${adaptation.adaptationTitle}`}
                  className="rounded-lg shadow-lg object-contain w-full h-auto"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
