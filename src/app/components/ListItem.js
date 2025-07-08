// src/app/components/ListItem.js
import Image from 'next/image'; // Using next/image for optimization

const ListItem = ({ item }) => {
  const { title, description, imageUrl, linkUrl } = item;

  const content = (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
      {imageUrl && (
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative rounded overflow-hidden">
          <Image
            src={imageUrl}
            alt={title || 'Item image'}
            layout="fill"
            objectFit="cover"
            className="bg-gray-200 dark:bg-gray-700" // Placeholder background
          />
        </div>
      )}
      {!imageUrl && (
         <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> {/* Simple X as placeholder */}
           </svg>
         </div>
      )}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title || 'Untitled Item'}</h3>
        {description && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>}
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg">
        {content}
      </a>
    );
  }

  return content;
};

export default ListItem;
