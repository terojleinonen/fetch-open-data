// src/app/components/ListItem.js
import Link from 'next/link'; // Using Next.js Link for client-side navigation

const ListItem = ({ item }) => {
  const { title, authorsDisplay, yearDisplay, linkUrl } = item;

  return (
    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150">
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {linkUrl ? (
          <Link href={linkUrl} className="hover:underline text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded">
            {title || 'Untitled Item'}
          </Link>
        ) : (
          title || 'Untitled Item'
        )}
      </td>
      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{authorsDisplay || '-'}</td>
      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{yearDisplay || '-'}</td>
    </tr>
  );
};

export default ListItem;
