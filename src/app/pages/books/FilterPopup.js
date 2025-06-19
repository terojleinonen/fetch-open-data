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
  // Memoized lists for dropdowns
  const uniqueYears = useMemo(() => {
    if (!initialBooks?.data) return [];
    const years = new Set(initialBooks.data.map(book => book.Year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a); // Descending order
  }, [initialBooks]);

  const uniquePublishers = useMemo(() => {
    if (!initialBooks?.data) return [];
    const publishers = new Set(initialBooks.data.map(book => book.Publisher).filter(Boolean));
    return Array.from(publishers).sort(); // Ascending order
  }, [initialBooks]);

  if (!isOpen) return null;

  // Handler for resetting filters
  const handleResetFilters = () => {
    setSelectedYear('');
    setSelectedPublisher('');
    setMinPages('');
    setMaxPages('');
    if (onResetFilters) {
      onResetFilters(); // Call the prop function if provided
    }
  };

  // Handler for applying filters (currently just calls prop)
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(); // Call the prop function
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      {/* Modal content */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Filter Books</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-3xl font-bold leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Scrollable filter options */}
        <div className="overflow-y-auto pr-2 flex-grow">
          {/* Year Filter */}
          <div className="mb-5">
            <label htmlFor="filter-year" className="block text-sm font-medium text-gray-300 mb-1">Year</label>
            <select
              id="filter-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            >
              <option value="">All Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Publisher Filter */}
          <div className="mb-5">
            <label htmlFor="filter-publisher" className="block text-sm font-medium text-gray-300 mb-1">Publisher</label>
            <select
              id="filter-publisher"
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            >
              <option value="">All Publishers</option>
              {uniquePublishers.map(publisher => (
                <option key={publisher} value={publisher}>{publisher}</option>
              ))}
            </select>
          </div>

          {/* Page Count Filter */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-1">Page Count</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min Pages"
                value={minPages}
                onChange={(e) => setMinPages(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                min="0"
              />
              <input
                type="number"
                placeholder="Max Pages"
                value={maxPages}
                onChange={(e) => setMaxPages(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-medium transition-colors duration-150 ease-in-out"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors duration-150 ease-in-out"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
