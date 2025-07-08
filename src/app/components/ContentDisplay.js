// src/app/components/ContentDisplay.js
import ListItem from './ListItem';
import ImageItem from './ImageItem';

const ContentDisplay = ({ items, view = 'list' }) => { // Default to 'list' view
  if (!items || items.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No items to display.</p>;
  }

  if (view === 'list') {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <ListItem key={item.id || item.title} item={item} />
        ))}
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
