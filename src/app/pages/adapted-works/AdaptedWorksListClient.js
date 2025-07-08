"use client";

import React, { useState, useMemo } from 'react';
import SearchAndSortControls from '@/app/components/SearchAndSortControls';
import ViewSwitcher from '@/app/components/ViewSwitcher';
import ContentDisplay from '@/app/components/ContentDisplay';

export default function AdaptedWorksListClient({ adaptations: initialAdaptations }) {
  const [searchTerm, setSearchTerm] = useState('');
  // Default sort key to 'title' from processed data
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [currentView, setCurrentView] = useState('grid'); // Default to grid view

  const adaptedWorksColumns = [
    { key: 'title', label: 'Title', isLink: true },
    { key: 'yearDisplay', label: 'Year' },
    { key: 'typeDisplay', label: 'Type' },
    { key: 'basedOnDisplay', label: 'Based On' }
  ];

  const processedAdaptations = useMemo(() => {
    let items = [...initialAdaptations];

    // Filter logic
    if (searchTerm) {
      items = items.filter(adaptation =>
        adaptation.adaptationTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Transform data first to have consistent keys for sorting and display
    let transformedItems = items.map((adaptation, index) => ({
      id: `${adaptation.adaptationTitle}-${adaptation.year}-${index}`, // Create a unique ID
      title: adaptation.adaptationTitle || 'N/A',
      yearDisplay: String(adaptation.year) || 'N/A',
      typeDisplay: adaptation.type || 'N/A',
      basedOnDisplay: adaptation.originalWorkTitle || 'N/A',
      linkUrl: adaptation.adaptationLink, // External link
      imageUrl: adaptation.posterUrl || null, // For grid view
      originalYear: adaptation.year // Keep original year for numeric sorting
    }));

    // Sorting logic - applied to transformed items
    if (sortConfig.key) {
      transformedItems.sort((a, b) => {
        let valA, valB;

        // Use originalYear for numeric sort if key is 'year', otherwise use the specified key
        if (sortConfig.key === 'year') {
          valA = a.originalYear;
          valB = b.originalYear;
        } else {
          valA = a[sortConfig.key];
          valB = b[sortConfig.key];
        }

        // Type checking and normalization for comparison
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        // For numeric fields like year, ensure they are numbers
        if (sortConfig.key === 'year') {
            valA = Number(valA);
            valB = Number(valB);
        } else if (typeof valA !== 'number' || typeof valB !== 'number') {
            // Fallback for non-numeric, non-string (should ideally not happen with proper data)
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

  // Sort options should use the keys from the transformed data or a specific key for sorting (like 'year' for 'originalYear')
  const sortOptions = [
    { key: 'title', label: 'Title' },
    { key: 'year', label: 'Year' } // This key 'year' will trigger sorting by 'originalYear' in the sort logic
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