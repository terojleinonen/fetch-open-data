"use client";

import React from 'react';

/**
 * StatusFilterMenu component for displaying filter buttons based on content statuses.
 * @param {object} props - Component props.
 * @param {string[]} props.uniqueStatuses - Array of unique status strings.
 * @param {string} props.selectedStatus - The currently selected status.
 * @param {function} props.onSelectStatus - Callback function to handle status selection.
 * @returns {JSX.Element} The StatusFilterMenu component.
 */
export default function StatusFilterMenu({ uniqueStatuses, selectedStatus, onSelectStatus }) {
  const handleSelection = (status) => {
    onSelectStatus(status === 'All' ? '' : status);
  };

  return (
    <div className="mb-4 p-4">
      {/* Dropdown for mobile view */}
      <div className="md:hidden">
        <select
          value={selectedStatus || 'All'}
          onChange={(e) => handleSelection(e.target.value)}
          className="w-full px-3 py-2 rounded text-sm bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--hover-accent-color)]"
        >
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* List for desktop view */}
      <div className="hidden md:flex md:flex-col md:items-start md:space-y-1">
        {uniqueStatuses.map(status => (
          <button
            key={status}
            onClick={() => handleSelection(status)}
            className={`
              text-left px-1 py-1 rounded text-sm
              ${(selectedStatus === status || (status === 'All' && !selectedStatus)) ? 'font-bold text-[var(--hover-accent-color)]' : 'text-[var(--text-color)]'}
              hover:text-[var(--hover-accent-color)]
              focus:outline-none
            `}
            style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize first letter */}
          </button>
        ))}
      </div>
    </div>
  );
}