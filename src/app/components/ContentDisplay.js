// src/app/components/ContentDisplay.js
import React, { useMemo } from 'react';
import ListItem from './ListItem';
import ImageItem from './ImageItem';

const ContentDisplay = ({ items, view = 'list', columns = [], sortConfig, searchTerm, contentType, selectedStatus }) => {
  const processedItems = useMemo(() => {
    if (!items || !items.data || !Array.isArray(items.data)) return [];

    let filteredItems = items.data;

    if (contentType === 'books') {

      filteredItems = items.data.filter(book => {
        const searchTermMatch = book.Title.toLowerCase().includes(searchTerm.toLowerCase());
        if (!searchTermMatch) return false;
        return true;
      });
    } else if (contentType === 'villains') {
      if (searchTerm) {
        filteredItems = filteredItems.filter(villain =>
          villain.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedStatus && selectedStatus !== 'All') {
        filteredItems = filteredItems.filter(villain => villain.status === selectedStatus);
      }
    }

    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'Year' || sortConfig.key === 'year') {
          valA = parseInt(valA, 10) || 0;
          valB = parseInt(valB, 10) || 0;
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
        } else if (typeof valB === 'string') {
            valB = valB.toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    
    if (contentType === 'books') {
      return filteredItems.map(book => ({
        id: book.id,
        title: book.Title,
        imageUrl: book.coverImageUrl,
        publisherDisplay: book.Publisher || 'Unknown Publisher',
        yearDisplay: book.Year ? String(book.Year) : 'Unknown Year',
        linkUrl: `/pages/books/${book.id}`,
      }));
    } else if (contentType === 'villains') {
      return filteredItems.map(villain => {
        const bookTitles = villain.books?.map(book => book.title).join(', ') || '';
        const shortTitles = villain.shorts?.map(short => short.title).join(', ') || '';
        let appearances = [bookTitles, shortTitles].filter(Boolean).join(', ');
        if (!appearances) {
          appearances = 'N/A';
        }
  
        return {
          id: villain.id,
          name: villain.name || "Unnamed Villain",
          statusDisplay: villain.status || 'N/A',
          appearances: appearances,
          linkUrl: `/pages/villains/${villain.id}`,
        };
      });
    } else if (contentType === 'shorts') {
        return filteredItems.map(short => ({
            id: short.id,
            title: short.title || "Untitled Short",
            typeDisplay: short.type || 'N/A',
            yearDisplay: short.year ? String(short.year) : 'N/A',
            linkUrl: `/pages/shorts/${short.id}`,
        }));
    } else if (contentType === 'adaptations') {
        return filteredItems.map((adaptation, index) => ({
            id: `${adaptation.adaptationTitle}-${adaptation.year}-${index}`, 
            title: adaptation.adaptationTitle || 'N/A',
            yearDisplay: String(adaptation.year) || 'N/A',
            typeDisplay: adaptation.type || 'N/A',
            linkUrl: adaptation.adaptationLink, 
            imageUrl: adaptation.posterUrl || null,
            originalWorkTitle: adaptation.originalWorkTitle, 
            originalWorkLink: adaptation.originalWorkLink,
            originalYear: adaptation.year,
          }));
    }
    return [];
  }, [items, searchTerm, sortConfig, contentType, selectedStatus]);

  if (!processedItems || processedItems.length === 0) {
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
            {processedItems.map((item, index) => (
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
        {processedItems.map((item) => (
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