"use client";

import React, { useState, useMemo } from 'react';
// useRouter can be removed if not used directly
// import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Keep for "Return to Home" link
// Image component is not needed for this client
// import Image from 'next/image';
import StatusFilterMenu from '@/app/components/StatusFilterMenu';
import SearchAndSortControls from '@/app/components/SearchAndSortControls';
import ContentDisplay from '@/app/components/ContentDisplay'; // Added

export default function VillainListClient({ initialVillains }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [selectedStatus, setSelectedStatus] = useState('');
  // const router = useRouter(); // Not directly used in this simplified version

  const villainColumns = [
    { key: 'name', label: 'Name', isLink: true },
    { key: 'statusDisplay', label: 'Status' }
  ];

  const uniqueStatuses = useMemo(() => {
    if (!initialVillains || !initialVillains.data) return [];
    const statuses = new Set(initialVillains.data.map(villain => villain.status).filter(Boolean));
    return ['All', ...Array.from(statuses)];
  }, [initialVillains]);

  const processedVillains = useMemo(() => {
    if (!initialVillains || !initialVillains.data) return [];
    let items = [...initialVillains.data];

    if (searchTerm) {
      items = items.filter(villain =>
        villain.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus && selectedStatus !== 'All') {
      items = items.filter(villain => villain.status === selectedStatus);
    }

    let transformedItems = items.map(villain => {
      const bookTitles = villain.books?.map(book => book.title).join(', ') || '';
      const shortTitles = villain.shorts?.map(short => short.title).join(', ') || '';
      let appearances = [bookTitles, shortTitles].filter(Boolean).join(', ');
      if (!appearances) {
        appearances = 'N/A';
      }

      return {
        id: villain.id,
        // Use 'name' for the 'name' column key, and ensure it's what `isLink` uses
        name: villain.name || "Unnamed Villain",
        statusDisplay: villain.status || 'N/A',
        appearances: appearances,
        linkUrl: `/pages/villains/${villain.id}`,
      };
    });

    if (sortConfig.key) {
      transformedItems.sort((a, b) => {
        // Assuming sortConfig.key will always be 'name' for villains as per sortOptions
        const valA = a[sortConfig.key]?.toLowerCase() || '';
        const valB = b[sortConfig.key]?.toLowerCase() || '';

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return transformedItems;
  }, [initialVillains, searchTerm, sortConfig, selectedStatus]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortOptions = [{ key: 'name', label: 'Name' }]; // Only sorting by name

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-6 md:justify-center">
        <div className="">
          <StatusFilterMenu
            uniqueStatuses={uniqueStatuses}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
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
              searchPlaceholder="Search by villain name..."
            />
          </div>

          <ContentDisplay
            items={processedVillains}
            view={'list'} // Hardcoded to list view
            columns={villainColumns}
          />

          {processedVillains.length === 0 && searchTerm && (
              <p className="text-center text-[var(--text-color)] mt-4">No villains found matching your search.</p>
          )}
          {processedVillains.length === 0 && selectedStatus && selectedStatus !== 'All' && !searchTerm &&(
            <p className="text-center text-[var(--text-color)] mt-4">No villains found for the status &apos;{selectedStatus}&apos;.</p>
          )}
          {processedVillains.length === 0 && !searchTerm && (!selectedStatus || selectedStatus === 'All') && initialVillains?.data?.length > 0 && (
             <p className="text-center text-[var(--text-color)] mt-4">All villains have been filtered out.</p>
           )}
           {initialVillains?.data?.length === 0 && (
             <p className="text-center text-[var(--text-color)] mt-4">No villains available at the moment.</p>
           )}
        </div>
        <div className="hidden md:block md:w-1/8"></div>
      </div>
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}