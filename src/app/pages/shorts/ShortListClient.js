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
            items={initialShorts}
            view={'list'}
            columns={shortsColumns}
            sortConfig={sortConfig}
            searchTerm={searchTerm}
            selectedType={selectedType}
            contentType='shorts'
          />
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