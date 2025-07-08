// src/app/components/ViewSwitcher.js
import ListViewIcon from './icons/ListViewIcon';
import GridViewIcon from './icons/GridViewIcon';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const commonButtonClasses = "p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const activeButtonClasses = "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100";
  const inactiveButtonClasses = "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200";
  const iconClasses = "w-6 h-6";

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onViewChange('list')}
        aria-label="Switch to list view"
        title="List View"
        className={`${commonButtonClasses} ${currentView === 'list' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        <ListViewIcon className={iconClasses} />
      </button>
      <button
        onClick={() => onViewChange('grid')}
        aria-label="Switch to grid view"
        title="Grid View"
        className={`${commonButtonClasses} ${currentView === 'grid' ? activeButtonClasses : inactiveButtonClasses}`}
      >
        <GridViewIcon className={iconClasses} />
      </button>
    </div>
  );
};

export default ViewSwitcher;
