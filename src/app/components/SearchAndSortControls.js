"use client";

import React from 'react';
import ArrowDownIcon from '@/app/components/icons/ArrowDownIcon';
import ArrowUpIcon from '@/app/components/icons/ArrowUpIcon';
import SearchIcon from '@/app/components/icons/SearchIcon';

export default function SearchAndSortControls({
  searchTerm,
  sortConfig,
  onSearchChange,
  onRequestSort,
  sortOptions, // Array of { key: string, label: string, title?: string (e.g. "Title"), year?: string (e.g. "Year") }
  searchPlaceholder = "Search..."
}) {

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowDownIcon className="w-4 h-4 ml-1 opacity-25" />;
    }
    // Determine icon based on the type of sort key (e.g. title vs year)
    const option = sortOptions.find(opt => opt.key === key);
    if (option?.title) { // Title sort: A-Z (asc) is Down, Z-A (desc) is Up
        return sortConfig.direction === 'ascending' ? <ArrowDownIcon className="w-4 h-4 ml-1" /> : <ArrowUpIcon className="w-4 h-4 ml-1" />;
    }
    // Default/Year sort: Ascending (e.g. Oldest) is Up, Descending (e.g. Newest) is Down
    return sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />;
  };

  const getSortLabel = (option) => {
    if (sortConfig.key === option.key) {
      if (option.title) { // For title sort
        return sortConfig.direction === 'ascending' ? '(A-Z)' : '(Z-A)';
      } else { // For year or other numeric sort
        return sortConfig.direction === 'ascending' ? '(Oldest)' : '(Newest)';
      }
    }
    return '';
  };

  return (
    <div className="mb-8 p-4 border border-[var(--border-color)] rounded-lg bg-[var(--background-start-rgb)] bg-opacity-30 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-[var(--text-color)] opacity-70" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full p-2 pl-10 border border-[var(--border-color)] rounded-md bg-transparent text-[var(--text-color)] placeholder-[var(--text-color)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] outline-none"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onRequestSort(option.key)}
              className="flex items-center px-3 py-2 text-sm border border-[var(--button-border)] rounded-md hover:bg-[var(--button-hover-background)] text-[var(--button-text)] bg-[var(--button-background)] transition-colors"
            >
              {option.label} {getSortLabel(option)}
              {getSortIcon(option.key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
