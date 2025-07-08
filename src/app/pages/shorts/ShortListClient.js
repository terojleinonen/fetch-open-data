"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Keep for the "Return to Home" link
import TypeFilterMenu from '@/app/components/TypeFilterMenu';
import SearchAndSortControls from '@/app/components/SearchAndSortControls';
import ContentDisplay from '@/app/components/ContentDisplay'; // Added

export default function ShortListClient({ initialShorts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [selectedType, setSelectedType] = useState('');
  const router = useRouter();

  const shortsColumns = [
    { key: 'title', label: 'Title', isLink: true },
    { key: 'typeDisplay', label: 'Type' },
    { key: 'yearDisplay', label: 'Year' }
  ];

  const uniqueTypes = useMemo(() => {
    if (!initialShorts || !initialShorts.data) return [];
    const types = new Set(initialShorts.data.map(short => short.type).filter(Boolean));
    return ['All', ...Array.from(types)];
  }, [initialShorts]);

  const processedShorts = useMemo(() => {
      if (!initialShorts || !initialShorts.data) return [];
      let items = initialShorts.data.filter(short =>
        short.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (selectedType && selectedType !== 'All') {
        items = items.filter(short => short.type === selectedType);
      }

      let transformedItems = items.map(short => ({
          id: short.id,
          title: short.title || "Untitled Short",
          typeDisplay: short.type || 'N/A',
          yearDisplay: short.year ? String(short.year) : 'N/A',
          linkUrl: `/pages/shorts/${short.id}`,
          originalYear: short.year
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
    }, [initialShorts, searchTerm, sortConfig, selectedType]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortOptions = [
    { key: 'title', label: 'Title' },
    { key: 'year', label: 'Year' }
  ];

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-6 md:justify-center">
        <div className="">
          <TypeFilterMenu
            uniqueTypes={uniqueTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
        </div>
        <div className="w-full md:w-6/8 px-4 md:px-0">
          <div className="mb-4">
            <SearchAndSortControls
              searchTerm={searchTerm}
              sortConfig={sortConfig}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onRequestSort={requestSort}
              sortOptions={sortOptions}
              searchPlaceholder="Search by short story title..."
            />
          </div>

          <ContentDisplay
            items={processedShorts}
            view={'list'}
            columns={shortsColumns}
          />

          {processedShorts.length === 0 && searchTerm && (
              <p className="text-center text-[var(--text-color)] mt-4">No shorts found matching your search.</p>
          )}
          {processedShorts.length === 0 && selectedType && selectedType !== 'All' && !searchTerm && (
            <p className="text-center text-[var(--text-color)] mt-4">No shorts found for the type &apos;{selectedType}&apos;.</p>
          )}
           {processedShorts.length === 0 && !searchTerm && (!selectedType || selectedType === 'All') && initialShorts?.data?.length > 0 && (
             <p className="text-center text-[var(--text-color)] mt-4">All shorts have been filtered out.</p> // Changed message slightly
           )}
            {initialShorts?.data?.length === 0 && (
             <p className="text-center text-[var(--text-color)] mt-4">No shorts available at the moment.</p>
           )}
        </div>
        <div className="hidden md:block md:w-1/8"></div>
      </div>
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}