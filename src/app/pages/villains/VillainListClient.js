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
            items={initialVillains}
            view={'list'} // Hardcoded to list view
            columns={villainColumns}
            sortConfig={sortConfig}
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            contentType='villains'
          />
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