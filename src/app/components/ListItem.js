// src/app/components/ListItem.js
import Link from 'next/link';

const ListItem = ({ item, columns, rowIndex }) => {
  if (!columns || columns.length === 0) {
    return (
      <tr className="border-b dark:border-gray-700"> {/* Fallback border if not in a proper table */}
        <td colSpan={100} className="px-6 py-4 text-red-500 text-center">Column definitions missing for ListItem.</td>
      </tr>
    );
  }

  const isEvenRow = rowIndex % 2 === 0;
  // Zebra striping for content rows.
  // Light theme: even rows white, odd rows gray-50.
  // Dark theme: even rows gray-800, odd rows gray-900.
  // Hover states are slightly darker than the non-hover state of the OTHER stripe color for better contrast.
  const rowClasses = `
    ${isEvenRow ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
    hover:bg-gray-200 dark:hover:bg-gray-700
    transition-colors duration-150
  `;

  return (
    <tr className={rowClasses.trim()}>
      {columns.map((col) => (
        <td key={col.key} className="px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-normal align-top"> {/* Added align-top for consistency if cell content varies in height */}
          {typeof col.render === 'function' ? (
            col.render(item) // Use custom render function
          ) : col.isLink && item.linkUrl ? ( // Fallback to default link rendering for the designated 'isLink' column
            <Link href={item.linkUrl} className="hover:underline text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded">
              {String(item[col.key] ?? '-')}
            </Link>
          ) : ( // Fallback to default text rendering
            String(item[col.key] ?? '-')
          )}
        </td>
      ))}
    </tr>
  );
};

export default ListItem;
