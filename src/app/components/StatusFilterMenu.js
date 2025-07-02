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
  return (
    <div className="mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow w-max"> {/* Added w-max to make the container fit its content */}
      <h3 className="text-md font-semibold mb-3 text-[var(--accent-color)]">Filter by Status:</h3>
      <div className="flex flex-col items-start space-y-1">
        {uniqueStatuses.map(status => (
          <button
            key={status}
            onClick={() => onSelectStatus(status === 'All' ? '' : status)}
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
