// src/app/components/ContentDisplay.js
import ListItem from './ListItem';
import ImageItem from './ImageItem';

const ContentDisplay = ({ items, view = 'list', columns = [], detailedBooksData, fetchBookDetails }) => { // Added detailedBooksData and fetchBookDetails
  if (!items || items.length === 0) {
    return <p className="text-[var(--text-color)] opacity-70 text-center py-8">No items to display.</p>;
  }

  if (view === 'list') {
    if (columns.length === 0) {
      return <p className="text-[var(--accent-color)] text-center py-8">List view selected, but no column definitions provided.</p>;
    }
    // For list view, we are not implementing lazy loading of images per cell in this iteration.
    // If needed, ListItem or a specific cell component within it would need similar logic to ImageItem.
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
            {items.map((item, index) => (
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
        {items.map((item) => (
          <ImageItem
            key={item.id || item.title}
            item={item}
            // Pass the specific detailed data for this item, if available
            detailedData={detailedBooksData && detailedBooksData[item.id] ? detailedBooksData[item.id] : null}
            // Pass the callback to trigger fetching details when visible
            onVisible={fetchBookDetails ? () => fetchBookDetails(item.id) : undefined}
          />
        ))}
      </div>
    );
  }

  return <p className="text-[var(--accent-color)]">Unknown view type selected.</p>;
};

export default ContentDisplay;