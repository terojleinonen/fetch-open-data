// src/app/components/ImageItem.js
import Image from 'next/image'; // Using next/image for optimization

const ImageItem = ({ item }) => {
  const { title, imageUrl, linkUrl } = item;

  const content = (
    <div className="group relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title || 'Item image'}
          layout="fill"
          objectFit="cover"
          className="bg-gray-200 dark:bg-gray-700 transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-gray-400 dark:text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> {/* Simple X as placeholder */}
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-base font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0">
          {title || 'Untitled Item'}
        </h3>
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

export default ImageItem;
