// src/app/components/ViewSwitcher.js
import ListViewIcon from './icons/ListViewIcon';
import GridViewIcon from './icons/GridViewIcon';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  const commonButtonClasses = "p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]";
  // Active button uses new theme variables
  const activeButtonClasses = "bg-[var(--control-active-bg)] text-[var(--control-active-text)]";
  // Inactive button uses theme variables for text and kitab button hover for background
  const inactiveButtonClasses = "text-[var(--text-color)] opacity-70 hover:bg-[var(--hover-accent-color)] hover:text-[var(--text-on-accent)]";
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
