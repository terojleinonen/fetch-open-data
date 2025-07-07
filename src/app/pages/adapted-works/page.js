import adaptationsDataJson from '@/app/data/adaptations.json';
import Link from 'next/link'; // Using next/link for internal navigation if possible
import PageTitle from '@/app/components/PageTitle'; // Assuming PageTitle component exists for consistency

export default async function AdaptedWorksPage() {
  const adaptations = adaptationsDataJson; // Already an array

  return (
    <div className="container mx-auto px-4 py-8 text-[var(--text-color)] max-w-5xl">
      <PageTitle title="Adapted Works" />

      <div
        className="page-background-text fixed inset-0 flex items-center justify-center text-8xl md:text-9xl lg:text-[12rem] font-bold text-gray-200 dark:text-gray-700 opacity-50 select-none z-[-1] pointer-events-none"
        aria-hidden="true"
      >
        ADAPTED WORKS
      </div>

      {adaptations && adaptations.length > 0 ? (
        <ul className="space-y-6">
          {adaptations.map((adaptation, index) => (
            <li key={`${adaptation.adaptationLink}-${index}`} className="p-6 border border-[var(--border-color)] rounded-lg shadow-lg bg-[var(--background-start-rgb)] bg-opacity-50 backdrop-blur-md">
              <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-2">
                <a
                  href={adaptation.adaptationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {adaptation.adaptationTitle}
                </a>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p><strong className="font-medium">Year:</strong> {adaptation.year}</p>
                <p><strong className="font-medium">Type:</strong> {adaptation.type}</p>
              </div>
              {adaptation.originalWorkTitle && (
                <div className="mt-2 text-sm">
                  <strong className="font-medium">Based on: </strong>
                  {adaptation.originalWorkLink.startsWith('http') ? (
                    <a
                      href={adaptation.originalWorkLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="italic text-[var(--link-color)] hover:underline"
                    >
                      {adaptation.originalWorkTitle}
                    </a>
                  ) : (
                    <Link href={adaptation.originalWorkLink} legacyBehavior>
                      <a className="italic text-[var(--link-color)] hover:underline">
                        {adaptation.originalWorkTitle}
                      </a>
                    </Link>
                  )}
                  {adaptation.originalWorkType && (
                    <span className="text-gray-600 dark:text-gray-400"> ({adaptation.originalWorkType})</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No adaptations information available.</p>
      )}
    </div>
  );
}