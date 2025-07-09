import Link from 'next/link';

export default function PageLinks({ pageLinks }) {
  return (
    <div className="w-full max-w-2xl mt-8">
      <div className="space-y-8"> {/* Increased spacing for better readability */}
        {pageLinks.map((link) => (
          <div key={link.title} className="flex flex-col items-start p-4 rounded-lg shadow-lg bg-gray-800 bg-opacity-50 hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {link.isExternal ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl font-bold text-[var(--link-color)] hover:text-[var(--link-hover-color)] no-underline hover:underline" // Title style
              >
                {link.title} <span className="text-lg opacity-75">(Official Site)</span>
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-3xl font-bold text-[var(--link-color)] hover:text-[var(--link-hover-color)] no-underline hover:underline" // Title style
              >
                {link.title}
              </Link>
            )}
            <p className="text-md text-gray-300 mt-2"> {/* Summary text style */}
              {link.summary}
            </p>
            {/* "Visit page" link */}
            {link.isExternal ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-lg text-[var(--link-color)] hover:text-[var(--link-hover-color)] underline"
              >
                Visit Site
              </a>
            ) : (
              <Link
                href={link.href}
                className="mt-4 text-lg text-[var(--link-color)] hover:text-[var(--link-hover-color)] underline"
              >
                Visit Page
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
