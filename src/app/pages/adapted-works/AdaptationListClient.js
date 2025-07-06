"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import TypeFilterMenu from '@/app/components/TypeFilterMenu'; // Import the new component

/**
 * AdaptationListClient component for displaying and filtering a list of adaptations.
 * @param {object} props - Component props.
 * @param {object} props.initialAdaptations - Initial list of adaptations to display.
 * @param {object} props.initialBooks - Initial list of books for ID lookup.
 * @param {object} props.initialShorts - Initial list of short stories for ID lookup.
 * @returns {JSX.Element} The AdaptationListClient component.
 */
export default function AdaptationListClient({ initialAdaptations, initialBooks, initialShorts }) {
  // State variable for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // State variables for sorting
  const [titleSortOrder, setTitleSortOrder] = useState('A-Z'); // 'A-Z', 'Z-A'
  const [yearSortOrder, setYearSortOrder] = useState('Newest-Oldest'); // 'Newest-Oldest', 'Oldest-Newest'
  // State variable for search bar visibility
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  // State variable for the selected type
  const [selectedType, setSelectedType] = useState('');
  const router = useRouter();

  // console.log("[DEBUG] AdaptationListClient: Rendering. Received props:", { initialAdaptations, initialBooks, initialShorts });

  const normalizeTitle = (title) => {
    if (!title) return '';
    return title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
  };

  const bookTitleToIdMap = useMemo(() => {
    if (!initialBooks || !initialBooks.data) return new Map();
    const map = new Map();
    initialBooks.data.forEach(book => {
      // The external API uses "Title" for books
      map.set(normalizeTitle(book.Title), book.id);
    });
    // console.log("[DEBUG] AdaptationListClient: bookTitleToIdMap created, size:", map.size);
    return map;
  }, [initialBooks]);

  const shortTitleToIdMap = useMemo(() => {
    if (!initialShorts || !initialShorts.data) return new Map();
    const map = new Map();
    initialShorts.data.forEach(short => {
      // The external API uses "title" (lowercase) for shorts
      map.set(normalizeTitle(short.title), short.id);
    });
    // console.log("[DEBUG] AdaptationListClient: shortTitleToIdMap created, size:", map.size);
    return map;
  }, [initialShorts]);

  // Memoized variable for unique types
  const uniqueTypes = useMemo(() => {
    if (!initialAdaptations || !initialAdaptations.data) return [];
    const types = new Set(initialAdaptations.data.map(adaptation => adaptation.type).filter(Boolean));
    return ['All', ...Array.from(types)];
  }, [initialAdaptations]);

  // Memoized variable for filtered adaptations based on the search term and sort order
  const filteredAdaptations = useMemo(() => {
      if (!initialAdaptations || !initialAdaptations.data) return [];
      let adaptationsArray = initialAdaptations.data.filter(adaptation =>
        adaptation.adaptationTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (selectedType && selectedType !== 'All') {
        adaptationsArray = adaptationsArray.filter(adaptation => adaptation.type === selectedType);
      }

      // Apply sorting
      if (titleSortOrder === 'A-Z') {
        adaptationsArray.sort((a, b) => a.adaptationTitle.toLowerCase().localeCompare(b.adaptationTitle.toLowerCase()));
      } else if (titleSortOrder === 'Z-A') {
        adaptationsArray.sort((a, b) => b.adaptationTitle.toLowerCase().localeCompare(a.adaptationTitle.toLowerCase()));
      }

      if (yearSortOrder === 'Newest-Oldest') {
        adaptationsArray.sort((a, b) => (b.year || 0) - (a.year || 0)); // Handle null/undefined years
      } else if (yearSortOrder === 'Oldest-Newest') {
        adaptationsArray.sort((a, b) => (a.year || 0) - (b.year || 0)); // Handle null/undefined years
      }

      return adaptationsArray;
    }, [initialAdaptations, searchTerm, titleSortOrder, yearSortOrder, selectedType]);

  // Function to generate the link for an adaptation
  const getAdaptationLink = (adaptation) => {
    const originalWorkType = adaptation.originalWorkType ? adaptation.originalWorkType.toLowerCase() : '';
    const originalTitle = adaptation.originalWorkTitle;

    // Handle cases with no title or citation-like titles first
    if (!originalTitle || /^\[\d+\]$/.test(originalTitle) || originalTitle.toLowerCase() === 'based on the series of the same name') {
      return '/';
    }

    const normalizedOriginalTitle = normalizeTitle(originalTitle);
    let foundId;

    if (originalWorkType === 'novel' || originalWorkType === 'novella' || originalWorkType === 'series') {
      foundId = bookTitleToIdMap.get(normalizedOriginalTitle);
      if (foundId) {
        return `/pages/books/${foundId}`;
      }
    } else if (originalWorkType === 'short story') {
      foundId = shortTitleToIdMap.get(normalizedOriginalTitle);
      if (foundId) {
        return `/pages/shorts/${foundId}`;
      }
    }

    // Fallback if no ID is found or type is not matched
    const fallbackLink = '/';
    // console.log(`[DEBUG] getAdaptationLink: No ID match for: '${originalTitle}' (Normalized: '${normalizedOriginalTitle}', Type: '${originalWorkType}'). Falling back to: ${fallbackLink}`);
    return fallbackLink;
  };

  // console.log("[DEBUG] AdaptationListClient: filteredAdaptations count:", filteredAdaptations.length);

  return (
    <div className="py-12"> {/* Removed pr-8 to allow full width for centering */}

      {/* Main layout: Flex container for sidebar and content */}
      {/* Added md:justify-center to center the content block on medium screens and up */}
      <div className="flex flex-col md:flex-row gap-6 md:justify-center"> {/* Adjusted flex direction for mobile and gap */}
        {/* Left Sidebar for Type Filters ONLY - Hidden on mobile, shown on md and up */}
        {/* Reduced width from md:w-1/4 to md:w-1/8 */}
        <div className="hidden md:block md:w-1/8">
          <TypeFilterMenu
            uniqueTypes={uniqueTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
        </div>

        {/* Right Content Area for Search, Sort, and Adaptations List - Takes full width on mobile, 6/8 (3/4) on medium+ */}
        {/* Adjusted width to md:w-6/8 */}
        <div className="w-full md:w-6/8 px-4 md:px-0"> {/* Added horizontal padding for mobile, removed for md+ to rely on parent centering */}
          {/* Search and Sort Controls Container */}
          <div className="controls-container mb-4 p-4 bg-[var(--background-color)] rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
            {/* Sort Buttons on the left */}
            <div className="flex gap-2">
              <button
                onClick={() => setTitleSortOrder(titleSortOrder === 'A-Z' ? 'Z-A' : 'A-Z')}
                className="px-3 py-2 h-10 rounded border किताब-बटन-सीमा किताब-बटन-पाठ किताब-बटन-पृष्ठभूमि hover:किताब-बटन-पृष्ठभूमि-होवर focus:ring-1 focus:ring-[var(--hover-accent-color)] text-xs flex items-center justify-center"
                style={{ minWidth: '4rem' }}
              >
                {titleSortOrder}
              </button>
              <button
                onClick={() => setYearSortOrder(yearSortOrder === 'Newest-Oldest' ? 'Oldest-Newest' : 'Newest-Oldest')}
                className="px-3 py-2 h-10 rounded border किताब-बटन-सीमा किताब-बटन-पाठ किताब-बटन-पृष्ठभूमि hover:किताब-बटन-पृष्ठभूमि-होवर focus:ring-1 focus:ring-[var(--hover-accent-color)] text-xs flex items-center justify-center"
                style={{ minWidth: '4rem' }}
              >
                {yearSortOrder}
              </button>
            </div>

            {/* Search bar and Icon on the right */}
            <div className="flex-grow flex justify-end items-center gap-2 ml-4">
              {isSearchBarVisible && (
                <div className="relative flex-grow">
                  <input
                    type="text"
                    id="search-adaptations-input"
                    name="search-adaptations-input"
                    placeholder="Search adaptations..."
                    className="w-full p-2 h-10 rounded bg-[var(--background-color)] text-[var(--text-color)] border border-[var(--accent-color)] focus:border-[var(--hover-accent-color)] focus:ring-1 focus:ring-[var(--hover-accent-color)] pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
                className="p-2 h-10 rounded border किताब-बटन-सीमा किताब-बटन-पाठ किताब-बटन-पृष्ठभूमि hover:किताब-बटन-पृष्ठभूमि-होवर focus:ring-1 focus:ring-[var(--hover-accent-color)] flex items-center justify-center flex-shrink-0"
                style={{ minWidth: '2.5rem', width: '2.5rem' }}
                aria-label={isSearchBarVisible ? "Close search bar" : "Open search bar"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Header Row for List */}
          <div className="flex justify-between items-center p-4 text-[var(--accent-color)] text-lg font-bold">
            <div className="flex-1 text-left">Title</div>
            <div className="flex-1 text-center">Type</div>
            <div className="flex-1 text-right">Year</div>
          </div>
          {/* Separator Line */}
          <hr className="mb-2 border-[var(--accent-color)] border-t-2" />

          {/* Adaptations List Display */}
          {/* Renders the list of filtered adaptations */}
          <div className="adaptations-list-container flex flex-col gap-2">
            {filteredAdaptations.map(adaptation => (
                <div key={adaptation.adaptationTitle + adaptation.year} className="adaptation-item p-4 rounded-lg shadow transition-colors"> {/* Removed border classes */}
                  <Link href={getAdaptationLink(adaptation)} className="flex justify-between items-center w-full">
                      <div className="flex-1 text-left text-base text-[var(--text-color)] truncate pr-2">
                          {adaptation.adaptationTitle}
                      </div>
                      <div className="flex-1 text-center text-base text-[var(--text-color)] px-2 capitalize">
                          {adaptation.type || 'N/A'} {/* Display type or N/A if not available */}
                      </div>
                      <div className="flex-1 text-right text-base text-[var(--text-color)] pl-2">
                          {adaptation.year || 'N/A'} {/* Display year or N/A if not available */}
                      </div>
                  </Link>
                </div>
            ))}
          </div>
          {/* Display a message if no adaptations match the search term */}
          {filteredAdaptations.length === 0 && searchTerm && (
              <p className="text-center text-[var(--text-color)] mt-4">No adaptations found matching your search.</p>
          )}
          {/* Display a message if no adaptations match the type filter */}
          {filteredAdaptations.length === 0 && selectedType && selectedType !== 'All' && (
            <p className="text-center text-[var(--text-color)] mt-4">No adaptations found for the type &apos;{selectedType}&apos;.</p>
          )}
        </div>
        {/* Empty div for right-side spacing on medium screens and up, matches sidebar width */}
        <div className="hidden md:block md:w-1/8"></div>
      </div>
      <div className="text-center mt-12"><Link href="/" className="home-link text-xl">Return to Home</Link></div>
    </div>
  );
}
