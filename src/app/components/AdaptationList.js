import React from 'react';

const AdaptationList = ({ adaptations }) => {
  if (!adaptations || adaptations.length === 0) {
    return <p className="text-sm text-[var(--text-color)]">No known adaptations for this work.</p>;
  }

  // Enhanced normalization for matching, focusing on alphanumeric characters and case-insensitivity
  const normalizeForMatch = (title) => {
    if (!title) return '';
    return title.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // Group adaptations by their title to avoid listing the same adaptation multiple times
  // if it somehow got duplicated with slightly different originalWorkTitle strings
  // that normalized to the same thing.
  const uniqueAdaptationsByTitle = adaptations.reduce((acc, current) => {
    const normalizedAdaptationTitle = normalizeForMatch(current.adaptationTitle);
    if (!acc[normalizedAdaptationTitle]) {
      acc[normalizedAdaptationTitle] = current;
    }
    return acc;
  }, {});

  const finalAdaptations = Object.values(uniqueAdaptationsByTitle);

  return (
    <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
      <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-3">Adaptations</h2>
      <ul className="list-disc pl-5 space-y-2">
        {finalAdaptations.map((adaptation, index) => (
          <li key={`${adaptation.adaptationTitle}-${adaptation.year}-${index}`} className="text-sm">
            <strong className="font-medium">{adaptation.adaptationTitle}</strong> ({adaptation.year})
            <span className="text-gray-600 dark:text-gray-400 italic ml-2">- {adaptation.type}</span>
            {/* Optional: Display original work title if it differs significantly or for clarity, though context implies it.
                For now, keeping it concise as it's under the work's page.
            <p className="text-xs text-gray-500 dark:text-gray-500 pl-2">Based on: {adaptation.originalWorkTitle}</p>
            */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdaptationList;
