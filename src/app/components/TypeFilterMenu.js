"use client";

import React from 'react';

/**
 * Renders a filter menu for content types.
 * It displays as a dropdown on mobile and a list of buttons on larger screens.
 *
 * @param {object} props The component props.
 * @param {string[]} props.uniqueTypes An array of unique type strings.
 * @param {string} props.selectedType The currently selected type.
 * @param {function} props.onSelectType A callback function to handle type selection.
 * @returns {JSX.Element} The TypeFilterMenu component.
 */
export default function TypeFilterMenu({ uniqueTypes, selectedType, onSelectType }) {
  const handleSelection = (type) => {
    onSelectType(type === 'All' ? '' : type);
  };

  return (
    <div className="mb-4 p-4">
      {/* Dropdown for mobile view */}
      <div className="md:hidden">
        <select
          value={selectedType || 'All'}
          onChange={(e) => handleSelection(e.target.value)}
          className="w-full px-3 py-2 rounded text-sm bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--hover-accent-color)]"
        >
          {uniqueTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* List for desktop view */}
      <div className="hidden md:flex md:flex-col md:items-start md:space-y-1">
        {uniqueTypes.map(type => (
          <button
            key={type}
            onClick={() => handleSelection(type)}
            className={`
              text-left w-full px-1 py-1 rounded text-sm
              ${(selectedType === type || (type === 'All' && !selectedType)) ? 'font-bold text-[var(--hover-accent-color)]' : 'text-[var(--text-color)]'}
              hover:text-[var(--hover-accent-color)]
              focus:outline-none
            `}
            style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}