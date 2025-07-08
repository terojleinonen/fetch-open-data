"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link'; // Added for the custom render function
import SearchAndSortControls from '@/app/components/SearchAndSortControls';
import ViewSwitcher from '@/app/components/ViewSwitcher';
import ContentDisplay from '@/app/components/ContentDisplay';

export default function AdaptedWorksListClient({ adaptations: initialAdaptations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [currentView, setCurrentView] = useState('grid');

  const adaptedWorksColumns = [
    { key: 'title', label: 'Title', isLink: true }, // This will use item.linkUrl for the main adaptation link
    { key: 'yearDisplay', label: 'Year' },
    { key: 'typeDisplay', label: 'Type' },
    {
      key: 'originalWorkInfo', // A key that represents the data unit for the column
      label: 'Based On',
      render: (item) => {
        if (!item.originalWorkTitle) {
          return <span className="text-gray-500 dark:text-gray-400">-</span>;
        }
        if (item.originalWorkLink) {
          const commonLinkClasses = "hover:underline text-sky-600 dark:text-sky-400";
          if (item.originalWorkLink.startsWith('/')) {
            return (
              <Link href={item.originalWorkLink} className={commonLinkClasses}>
                {item.originalWorkTitle}
              </Link>
            );
          } else if (item.originalWorkLink.startsWith('http')) {
            return (
              <a
                href={item.originalWorkLink}
                target="_blank"
                rel="noopener noreferrer"
                className={commonLinkClasses}
              >
                {item.originalWorkTitle}
              </a>
            );
          }
        }
        return item.originalWorkTitle; // Just text if no valid link
      }
    }
  ];

  const processedAdaptations = useMemo(() => {
    let items = [...initialAdaptations];

    if (searchTerm) {
      items = items.filter(adaptation =>
        adaptation.adaptationTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    let transformedItems = items.map((adaptation, index) => ({
      id: `${adaptation.adaptationTitle}-${adaptation.year}-${index}`,
      title: adaptation.adaptationTitle || 'N/A',
      yearDisplay: String(adaptation.year) || 'N/A',
      typeDisplay: adaptation.type || 'N/A',
      linkUrl: adaptation.adaptationLink,
      imageUrl: adaptation.posterUrl || null,
      originalYear: adaptation.year,
      originalWorkTitle: adaptation.originalWorkTitle,
      originalWorkLink: adaptation.originalWorkLink
    }));

    if (sortConfig.key) {
      transformedItems.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'year') {
          valA = a.originalYear;
          valB = b.originalYear;
        } else {
          valA = a[sortConfig.key];
          valB = b[sortConfig.key];
        }

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (sortConfig.key === 'year') {
            valA = Number(valA);
            valB = Number(valB);
        } else if (typeof valA !== 'number' && typeof valB !== 'number') {
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return transformedItems;
  }, [initialAdaptations, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (!initialAdaptations || initialAdaptations.length === 0) {
    return <div className="px-8 py-12"><p className="text-[var(--text-color)]">No adaptations information available.</p></div>;
  }

  const sortOptions = [
    { key: 'title', label: 'Title' },
    { key: 'year', label: 'Year' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 text-[var(--text-color)]">
      <div className="flex flex-col sm:flex-row items-center mb-4 sm:space-x-2">
        <div className="flex-grow w-full sm:w-auto">
          <SearchAndSortControls
            searchTerm={searchTerm}
            sortConfig={sortConfig}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onRequestSort={requestSort}
            sortOptions={sortOptions}
            searchPlaceholder="Search by adaptation title..."
          />
        </div>
        <div className="mt-2 sm:mt-0">
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </div>

      <ContentDisplay
        items={processedAdaptations}
        view={currentView}
        columns={adaptedWorksColumns}
      />

      {processedAdaptations.length === 0 && searchTerm && (
        <p className="text-center text-[var(--text-color)] py-10">No adaptations found matching your search.</p>
      )}
       {processedAdaptations.length === 0 && !searchTerm && initialAdaptations.length > 0 && (
        <p className="text-center text-[var(--text-color)] py-10">All adaptations have been filtered out.</p>
      )}
    </div>
  );
}