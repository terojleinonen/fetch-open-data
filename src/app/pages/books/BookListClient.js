"use client";

import React, { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchAndSortControls from '@/app/components/SearchAndSortControls';
import ViewSwitcher from '@/app/components/ViewSwitcher';
import ContentDisplay from '@/app/components/ContentDisplay';
import Request from '@/app/components/request'; // Import Request

/**
 * BookListClient component for displaying and filtering a list of books.
 * @param {object} props - Component props.
 * @param {object} props.initialBooks - Initial list of books to display.
 * @returns {JSX.Element} The BookListClient component.
 */
export default function BookListClient({ initialBooks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Title', direction: 'ascending' });
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [minPages, setMinPages] = useState('');
  const [maxPages, setMaxPages] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const router = useRouter();

  const bookColumns = [
    { key: 'title', label: 'Title', isLink: true },
    { key: 'publisherDisplay', label: 'Publisher' },
    { key: 'yearDisplay', label: 'Year' }
  ];

  const uniqueYears = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const years = new Set(initialBooks.data.map(book => book.Year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
  }, [initialBooks]);

  const uniquePublishers = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const publishers = new Set(initialBooks.data.map(book => book.Publisher).filter(Boolean));
    return Array.from(publishers).sort();
  }, [initialBooks]);

  const handleResetFilters = () => {
    setSelectedYear('');
    setSelectedPublisher('');
    setMinPages('');
    setMaxPages('');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (!initialBooks || !initialBooks.data || !Array.isArray(initialBooks.data)) {
    return (
      <div className="px-8 py-12">
        <h1 className="text-2xl font-bold text-[var(--accent-color)] mb-4">সমস্যা</h1>
        <p className="text-[var(--text-color)]">Book data is currently unavailable or malformed. Please try again later. The filter menu has been temporarily disabled.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-6 md:justify-center">
        {/* Left Sidebar for Filters */}
        <div className="hidden md:block md:w-1/8"></div>

        {/* Main Content Area: Search, Sort, ViewSwitcher, and ContentDisplay */}
        <div className="w-full md:w-6/8 px-4 md:px-0">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:space-x-2">
            <div className="flex-grow w-full sm:w-auto">
              <SearchAndSortControls
                searchTerm={searchTerm}
                sortConfig={sortConfig}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onRequestSort={requestSort}
                sortOptions={[
                  { key: 'Title', label: 'Title', title: 'Title' },
                  { key: 'Year', label: 'Year', year: 'Year' }
                ]}
                searchPlaceholder="Search by book title..."
              />
            </div>
            <div className="mt-2 sm:mt-0">
                <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
            </div>
          </div>
          
          <ContentDisplay
            items={initialBooks}
            view={currentView}
            columns={bookColumns}
            sortConfig={sortConfig}
            searchTerm={searchTerm}
            selectedYear={selectedYear}
            selectedPublisher={selectedPublisher}
            minPages={minPages}
            maxPages={maxPages}
            contentType='books'
          />
           {initialBooks?.data?.length === 0 && (
             <p className="text-center text-[var(--text-color)] mt-4">There are no books to display at the moment.</p>
           )}
        </div>

        {/* Right Empty Sidebar for spacing */}
        <div className="hidden md:block md:w-1/8"></div>
      </div>
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}