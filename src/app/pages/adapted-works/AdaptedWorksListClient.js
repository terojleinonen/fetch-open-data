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
          return <span className="text-[var(--text-color)] opacity-70">-</span>;
        }
        if (item.originalWorkLink) {
          const commonLinkClasses = "hover:underline"; // Link color will be inherited from global 'a'
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
        items={{data: initialAdaptations}}
        view={currentView} 
        columns={adaptedWorksColumns}
        sortConfig={sortConfig}
        searchTerm={searchTerm}
        contentType='adaptations'
      />
    </div>
  );
}