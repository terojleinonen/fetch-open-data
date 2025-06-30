import Link from 'next/link';
import Image from 'next/image';

const ListItemCard = ({
  title,
  year,
  type, // For shorts: "short story", "novella", etc.
  keyInfo, // For publisher, status, etc. as a string
  imageUrl,
  altText = "Item image", // Default alt text
  notes,
  description, // For Google Books short description
  detailsLink, // Internal Next.js Link or external URL
  externalLink = false, // If true, detailsLink opens in new tab
  children // For additional custom content (e.g., villain's works)
}) => {

  const effectiveAltText = altText === "Item image" && title ? `Cover for ${title}` : altText;

  const cardContent = (
    <>
      {imageUrl && (
        <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-200 overflow-hidden rounded-t-lg group-hover:opacity-90 transition-opacity">
          {/*
            Using next/image. Requires configuration in next.config.js for external domains like 'books.google.com'.
            Example next.config.js:
            module.exports = {
              images: {
                domains: ['books.google.com'],
              },
            }
          */}
          <Image
            src={imageUrl}
            alt={effectiveAltText}
            fill // Replaces layout="fill" and objectFit="cover" in newer Next.js
            className="object-cover" // Equivalent to object-fit: cover
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Helps with responsive image loading
            priority={false} // Set to true for above-the-fold images if needed, but generally false for lists
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-dark-gray mb-1 group-hover:text-classic-red transition-colors">
          {title || "Untitled"}
        </h3>

        {year && <p className="text-xs text-gray-500 mb-1">Published: {year}</p>}
        {type && <p className="text-xs font-medium text-classic-red uppercase tracking-wider mb-1">{type}</p>}
        {keyInfo && <p className="text-sm text-gray-600 mb-2">{keyInfo}</p>}

        {description && <p className="text-sm text-gray-700 mb-3 flex-grow">{description}</p>}

        {notes && notes.length > 0 && (
          <p className="text-xs text-gray-500 mb-2 italic">
            Note: {typeof notes === 'string' ? notes : notes[0]} {/* Display first note if array */}
          </p>
        )}

        {children && <div className="text-sm mt-auto pt-2 border-t border-gray-200">{children}</div>}
      </div>
    </>
  );

  const commonCardClasses = "bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col group overflow-hidden h-full";

  if (detailsLink) {
    if (externalLink) {
      return (
        <a
          href={detailsLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${commonCardClasses} cursor-pointer`}
        >
          {cardContent}
        </a>
      );
    }
    return (
      <Link href={detailsLink} legacyBehavior>
        <a className={`${commonCardClasses} cursor-pointer`}>
          {cardContent}
        </a>
      </Link>
    );
  }

  return (
    <div className={commonCardClasses}>
      {cardContent}
    </div>
  );
};

export default ListItemCard;
