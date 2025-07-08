"use client";

import React from 'react';

/**
 * TypeFilterMenu component for displaying filter buttons based on content types.
 * @param {object} props - Component props.
 * @param {string[]} props.uniqueTypes - Array of unique type strings.
 * @param {string} props.selectedType - The currently selected type.
 * @param {function} props.onSelectType - Callback function to handle type selection.
 * @returns {JSX.Element} The TypeFilterMenu component.
 */
export default function TypeFilterMenu({ uniqueTypes, selectedType, onSelectType }) {
  return (
    <div className="mb-4 p-4">
      <div className="flex flex-col items-start space-y-1">
        {uniqueTypes.map(type => (
          <button
            key={type}
            onClick={() => onSelectType(type === 'All' ? '' : type)}
            className={`
              text-left w-full px-1 py-1 rounded text-sm
              ${(selectedType === type || (type === 'All' && !selectedType)) ? 'font-bold text-[var(--hover-accent-color)]' : 'text-[var(--text-color)]'}
              hover:text-[var(--hover-accent-color)]
              focus:outline-none
            `}
            style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
          </button>
        ))}
      </div>
    </div>
  );
}
