// src/app/components/ContentDisplay.js
import ListItem from './ListItem';
import ImageItem from './ImageItem';

const ContentDisplay = ({ items, view = 'list', columns = [] }) => { // Added columns prop
  if (!items || items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No items to display.</p>;
  }

  if (view === 'list') {
    if (columns.length === 0) {
      return <p className="text-red-500 text-center py-8">List view selected, but no column definitions provided.</p>;
    }
    return (
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 border-b-2 border-red-500">
            <tr>
              {columns.map((col) => (
                <th scope="col" key={col.key} className="px-6 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item, index) => ( 
              <ListItem 
                key={item.id || item.title || index} 
                item={item} 
                columns={columns} // Pass columns to ListItem
                rowIndex={index} // For zebra striping
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (view === 'grid') {
    // Grid view remains unchanged, does not use 'columns' prop in the same way
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {items.map((item) => (
          <ImageItem key={item.id || item.title} item={item} />
        ))}
      </div>
    );
  }

  return <p className="text-red-500">Unknown view type selected.</p>;
};

export default ContentDisplay;