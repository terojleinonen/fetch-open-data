// src/app/components/ContentDisplay.js
import ListItem from './ListItem';
import ImageItem from './ImageItem';

const ContentDisplay = ({ items, view = 'list' }) => { // Default to 'list' view
  if (!items || items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No items to display.</p>;
  }

  if (view === 'list') {
    return (
      <div className="overflow-x-auto shadow-md sm:rounded-lg"> {/* Added for smaller screens and some styling */}
        <table className="min-w-full w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Authors</th>
              <th scope="col" className="px-6 py-3">Year</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              // ListItem will be modified to render a <tr> element
              <ListItem key={item.id || item.title} item={item} />
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
          <ImageItem key={item.id || item.title} item={item} />
        ))}
      </div>
    );
  }

  // Fallback for an unknown view type, though ideally this shouldn't be reached
  return <p className="text-red-500">Unknown view type selected.</p>;
};

export default ContentDisplay;
