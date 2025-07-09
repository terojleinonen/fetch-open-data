// src/app/components/ListItem.js
import Link from 'next/link';

const ListItem = ({ item, columns, rowIndex }) => {
  if (!columns || columns.length === 0) {
    return (
      <tr className="border-b dark:border-gray-700"> {/* Fallback border if not in a proper table */}
        <td colSpan={100} className="px-6 py-4 text-[var(--accent-color)] text-center">Column definitions missing for ListItem.</td>
      </tr>
    );
  }

  const isEvenRow = rowIndex % 2 === 0;
  // Zebra striping for content rows.
  // Zebra striping for content rows.
  // Uses CSS variables for theme-awareness.
  const rowClasses = `
    ${isEvenRow ? 'bg-[var(--row-bg-even)]' : 'bg-[var(--row-bg-odd)]'}
    hover:bg-[var(--row-hover-bg)] hover:text-[var(--text-on-accent)]
    transition-colors duration-150
  `;

  return (
    <tr className={rowClasses.trim()}>
      {columns.map((col) => (
        <td key={col.key} className="px-6 py-4 text-[var(--text-color)] whitespace-normal align-top"> {/* Added align-top for consistency if cell content varies in height */}
          {typeof col.render === 'function' ? (
            col.render(item) // Use custom render function
          ) : col.isLink && item.linkUrl ? ( // Fallback to default link rendering for the designated 'isLink' column
            <Link href={item.linkUrl} className="hover:underline text-[var(--link-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] rounded">
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