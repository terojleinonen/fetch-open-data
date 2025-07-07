"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ArrowDownIcon from '@/app/components/icons/ArrowDownIcon';
import ArrowUpIcon from '@/app/components/icons/ArrowUpIcon';

export default function AdaptedWorksListClient({ adaptations: initialAdaptations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'adaptationTitle', direction: 'ascending' });

  const filteredAndSortedAdaptations = useMemo(() => {
    let adaptableAdaptations = [...initialAdaptations];

    // Filter logic
    if (searchTerm) {
      adaptableAdaptations = adaptableAdaptations.filter(adaptation =>
        adaptation.adaptationTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    if (sortConfig.key) {
      adaptableAdaptations.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Handle numeric sorting for year
        if (sortConfig.key === 'year') {
          valA = parseInt(valA, 10);
          valB = parseInt(valB, 10);
        } else if (typeof valA === 'string') { // Handle string sorting for title
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return adaptableAdaptations;
  }, [initialAdaptations, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (!initialAdaptations || initialAdaptations.length === 0) {
    return (
      <div className="px-8 py-12">
        <p className="text-[var(--text-color)]">No adaptations information available.</p>
      </div>
    );
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      // Using a more subtle default icon for non-active sort buttons
      return <ArrowDownIcon className="w-4 h-4 ml-1 opacity-25" />;
    }
    // Active sort button
    if (key === 'adaptationTitle') {
      // For title: A-Z (ascending) uses ArrowDown, Z-A (descending) uses ArrowUp
      return sortConfig.direction === 'ascending' ? <ArrowDownIcon className="w-4 h-4 ml-1" /> : <ArrowUpIcon className="w-4 h-4 ml-1" />;
    }
    // For year: Oldest-Newest (ascending) uses ArrowUp, Newest-Oldest (descending) uses ArrowDown
    return sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 text-[var(--text-color)] max-w-5xl">
      <div className="mb-8 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--background-start-rgb)] bg-opacity-30 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by title..."
            className="flex-grow p-2 border border-[var(--border-color)] rounded-md bg-transparent text-[var(--text-color)] placeholder-[var(--text-color)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <button
              onClick={() => requestSort('adaptationTitle')}
              className="flex items-center px-3 py-2 text-sm border border-[var(--button-border)] rounded-md hover:bg-[var(--button-hover-background)] text-[var(--button-text)] bg-[var(--button-background)] transition-colors"
            >
              Title {sortConfig.key === 'adaptationTitle' && (sortConfig.direction === 'ascending' ? '(A-Z)' : '(Z-A)')}
              {getSortIcon('adaptationTitle')}
            </button>
            <button
              onClick={() => requestSort('year')}
              className="flex items-center px-3 py-2 text-sm border border-[var(--button-border)] rounded-md hover:bg-[var(--button-hover-background)] text-[var(--button-text)] bg-[var(--button-background)] transition-colors"
            >
              Year {sortConfig.key === 'year' && (sortConfig.direction === 'ascending' ? '(Oldest)' : '(Newest)')}
              {getSortIcon('year')}
            </button>
          </div>
        </div>
      </div>

      {filteredAndSortedAdaptations.length > 0 ? (
        <ul className="space-y-6">
          {filteredAndSortedAdaptations.map((adaptation, index) => (
            <li
              key={`${adaptation.adaptationLink}-${index}-${adaptation.adaptationTitle}`} // Added title to key for better uniqueness
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
                  {adaptation.originalWorkLink && adaptation.originalWorkLink.startsWith('http') ? (
                    <a
                      href={adaptation.originalWorkLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="italic text-[var(--link-color)] hover:underline"
                    >
                      {adaptation.originalWorkTitle}
                    </a>
                  ) : adaptation.originalWorkLink ? (
                  <Link href={adaptation.originalWorkLink} legacyBehavior>
                      <a className="italic text-[var(--link-color)] hover:underline">
                        {adaptation.originalWorkTitle}
                      </a>
                    </Link>
                  ) : (
                    <span className="italic">{adaptation.originalWorkTitle}</span>
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
      ) : (
        <p className="text-center text-[var(--text-color)] py-10">No adaptations found matching your criteria.</p>
      )}
    </div>
  );
}
