"use client";

import React, { useMemo } from 'react';

export default function FilterPopup({
  isOpen,
  initialBooks,
  selectedYear,
  setSelectedYear,
  selectedPublisher,
  setSelectedPublisher,
  minPages,
  setMinPages,
  maxPages,
  setMaxPages,
  onApplyFilters,
  onResetFilters,
  onClose
}) {
  // Memoized lists for dropdowns (ensure Array.isArray checks are present as per previous fixes)
  const uniqueYears = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const years = new Set(initialBooks.data.map(book => book.Year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a); // Descending order
  }, [initialBooks]);

  const uniquePublishers = useMemo(() => {
    if (!initialBooks?.data || !Array.isArray(initialBooks.data)) return [];
    const publishers = new Set(initialBooks.data.map(book => book.Publisher).filter(Boolean));
    return Array.from(publishers).sort(); // Ascending order
  }, [initialBooks]);

  // Handler for resetting filters
  const handleResetFilters = () => {
    setSelectedYear('');
    setSelectedPublisher('');
    setMinPages('');
    setMaxPages('');
    if (onResetFilters) {
      onResetFilters();
    }
  };

  // Handler for applying filters
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-[var(--background-color)] border border-[var(--accent-color)] transform transition-transform duration-300 ease-in-out md:left-auto md:top-0 md:right-0 md:bottom-auto md:h-full md:w-80 md:shadow-xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Inner content wrapper */}
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[var(--text-color)]">Filter Books</h2>
          <button
            onClick={onClose} // onClick should call the onClose prop
            className="text-[var(--accent-color)] hover:text-[var(--hover-accent-color)] text-3xl font-bold leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Scrollable filter options */}
        <div className="overflow-y-auto pr-2 flex-grow space-y-4">
          {/* Year Filter */}
          <div>
            <label htmlFor="filter-year" className="block text-sm font-medium text-[var(--text-color)] mb-1">Year</label>
            <select
              id="filter-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Publisher Filter */}
          <div>
            <label htmlFor="filter-publisher" className="block text-sm font-medium text-[var(--text-color)] mb-1">Publisher</label>
            <select
              id="filter-publisher"
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
              className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
            >
              <option value="">All Publishers</option>
              {uniquePublishers.map(publisher => (
                <option key={publisher} value={publisher}>{publisher}</option>
              ))}
            </select>
          </div>

          {/* Page Count Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Page Count</label>
            <div className="flex gap-4">
              <input
                type="number"
                id="filter-min-pages"
                name="filter-min-pages"
                placeholder="Min Pages"
                value={minPages}
                onChange={(e) => setMinPages(e.target.value)}
                className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
                min="0"
              />
              <input
                type="number"
                id="filter-max-pages"
                name="filter-max-pages"
                placeholder="Max Pages"
                value={maxPages}
                onChange={(e) => setMaxPages(e.target.value)}
                className="w-full p-2 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] outline-none"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-[var(--accent-color)]">
          <button
            onClick={handleResetFilters}
            className="bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] font-bold py-2 px-4 rounded"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-[var(--accent-color)] hover:bg-[var(--hover-accent-color)] text-[var(--text-color)] font-bold py-2 px-4 rounded"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
