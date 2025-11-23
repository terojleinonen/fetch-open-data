import adaptationsDataJson from '@/app/data/adaptations.json';
import AdaptedWorksListClient from './AdaptedWorksListClient'; // Import the new client component

export default async function AdaptedWorksPage() {
  const adaptations = adaptationsDataJson; // Already an array

  // In the future, poster URLs would be fetched and added to the adaptations objects here.
  // For now, we'll pass the existing data.

  return (
    <div>
      <AdaptedWorksListClient adaptations={adaptations} />
    </div>
  );
}