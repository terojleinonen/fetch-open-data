// src/app/components/ContentDisplay.js
import React, { useMemo } from 'react';
import ListItem from './ListItem';
import ImageItem from './ImageItem';

const ContentDisplay = ({ items, view = 'list', columns = [], sortConfig, searchTerm, selectedYear, selectedPublisher, minPages, maxPages }) => {
  const processedBooks = useMemo(() => {
    if (!items || !items.data || !Array.isArray(items.data)) return [];

    const minPagesNumeric = minPages !== '' ? parseInt(minPages, 10) : null;
    const maxPagesNumeric = maxPages !== '' ? parseInt(maxPages, 10) : null;
    const yearNumeric = selectedYear !== '' ? parseInt(selectedYear, 10) : null;

    let booksArray = items.data.filter(book => {
      const searchTermMatch = book.Title.toLowerCase().includes(searchTerm.toLowerCase());
      if (!searchTermMatch) return false;
      if (yearNumeric !== null && book.Year !== yearNumeric) return false;
      if (selectedPublisher && book.Publisher && book.Publisher.toLowerCase() !== selectedPublisher.toLowerCase()) return false;
      if (minPagesNumeric !== null && (!book.Pages || book.Pages < minPagesNumeric)) return false;
      if (maxPagesNumeric !== null && (!book.Pages || book.Pages > maxPagesNumeric)) return false;
      return true;
    });

    if (sortConfig.key) {
      booksArray.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'Year') {
          valA = parseInt(valA, 10) || 0;
          valB = parseInt(valB, 10) || 0;
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return booksArray.map(book => ({
      id: book.id,
      title: book.Title,
      imageUrl: book.coverImageUrl,
      publisherDisplay: book.Publisher || 'Unknown Publisher',
      yearDisplay: book.Year ? String(book.Year) : 'Unknown Year',
      linkUrl: `/pages/books/${book.id}`,
    }));
  }, [items, searchTerm, sortConfig, selectedYear, selectedPublisher, minPages, maxPages]);

  if (!processedBooks || processedBooks.length === 0) {
    return <p className="text-[var(--text-color)] opacity-70 text-center py-8">No items to display.</p>;
  }

  if (view === 'list') {
    if (columns.length === 0) {
      return <p className="text-[var(--accent-color)] text-center py-8">List view selected, but no column definitions provided.</p>;
    }
    return (
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full w-full text-left text-sm text-[var(--text-color)] opacity-90">
          <thead className="text-xs text-[var(--text-color)] uppercase bg-[var(--sk-row-bg-even-light)] dark:bg-[var(--sk-row-bg-even-dark)] border-b-2 border-[var(--accent-color)]">
            <tr>
              {columns.map((col) => (
                <th scope="col" key={col.key} className="px-6 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sk-shadow-light)] dark:divide-[var(--sk-shadow-dark)]">
            {processedBooks.map((item, index) => (
              <ListItem
                key={item.id || item.title || index}
                item={item}
                columns={columns}
                rowIndex={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {processedBooks.map((item) => (
          <ImageItem
            key={item.id || item.title}
            item={item}
          />
        ))}
      </div>
    );
  }

  return <p className="text-[var(--accent-color)]">Unknown view type selected.</p>;
};

export default ContentDisplay;