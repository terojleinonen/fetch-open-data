import Layout from '../components/Layout';
import ListItemCard from '../components/ListItemCard';
// import { useState } from 'react'; // For potential client-side filtering

export default function ShortsPage({ shorts, error }) {

  // const [filterType, setFilterType] = useState('');
  // const types = shorts ? [...new Set(shorts.map(s => s.type).filter(Boolean))].sort() : [];
  // const filteredShorts = filterType ? shorts.filter(s => s.type === filterType) : shorts;

  if (error) {
    return (
      <Layout title="Error - Stephen King Fan Hub">
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-classic-red mb-4">Error Fetching Short Works</h1>
          <p className="text-dark-gray">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!shorts || shorts.length === 0) {
     return (
      <Layout title="Short Works - Stephen King Fan Hub">
        <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-6 text-center">Short Works by Stephen King</h1>
        <p className="text-dark-gray text-center">No short works found or still loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Short Works - Stephen King Fan Hub">
      <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-8 text-center">
        Short Works by Stephen King
      </h1>

      {/*
      // Optional Filter UI Example:
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setFilterType('')}
          className={`px-4 py-2 text-sm rounded-full transition-colors ${!filterType ? 'bg-classic-red text-white' : 'bg-gray-200 text-dark-gray hover:bg-gray-300'}`}
        >
          All Types
        </button>
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${filterType === type ? 'bg-classic-red text-white' : 'bg-gray-200 text-dark-gray hover:bg-gray-300'}`}
          >
            {type}
          </button>
        ))}
      </div>
      */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {/* Replace `shorts` with `filteredShorts` if using client-side filtering */}
        {shorts.map((short) => (
          <ListItemCard
            key={short.id}
            title={short.title}
            year={short.year}
            type={short.type} // This will be displayed by ListItemCard if it handles a 'type' prop
            keyInfo={short.type ? `Type: ${short.type}` : ''}
            notes={
              (short.collectedIn ? `Collected In: ${short.collectedIn}. ` : '') +
              (short.originallyPublishedIn ? `Originally: ${short.originallyPublishedIn}. ` : '') +
              (short.notes && short.notes.length > 0 && short.notes[0] !== "" ? `Note: ${short.notes.filter(n => n).join('; ')}` : '')
            }
            // detailsLink={`/short/${short.handle}`} // Example for future detail page
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch('https://stephen-king-api.onrender.com/api/shorts');
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch shorts, status: ${res.status}`, errorText);
      return {
        props: {
          shorts: [],
          error: `API Error: ${res.status}. Could not load short works data.`
        },
        revalidate: 60,
      };
    }
    const data = await res.json();
    const shortsData = Array.isArray(data?.data) ? data.data : [];

    return {
      props: {
        shorts: shortsData,
        error: null
      },
      revalidate: 3600, // Revalidate once per hour
    };
  } catch (error) {
    console.error("Error in getStaticProps for shorts:", error);
    return {
      props: {
        shorts: [],
        error: "A network or server error occurred while fetching short works."
      },
      revalidate: 60,
    };
  }
}
