import Layout from '../components/Layout';
import ListItemCard from '../components/ListItemCard';
// import Link from 'next/link'; // If linking villain's works to other pages

export default function VillainsPage({ villains, error }) {
  if (error) {
    return (
      <Layout title="Error - Stephen King Fan Hub">
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-classic-red mb-4">Error Fetching Villains</h1>
          <p className="text-dark-gray">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!villains || villains.length === 0) {
    return (
      <Layout title="Villains - Stephen King Fan Hub">
        <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-6 text-center">Iconic Villains from King's Universe</h1>
        <p className="text-dark-gray text-center">No villains found or still loading...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Villains - Stephen King Fan Hub">
      <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-8 text-center">
        Iconic Villains from King's Universe
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8"> {/* Max 3 cols for more content per card */}
        {villains.map((villain) => (
          <ListItemCard
            key={villain.id}
            title={villain.name}
            keyInfo={`Gender: ${villain.gender || 'N/A'} | Status: ${villain.status || 'N/A'}`}
            // No direct image for villains from this API
          >
            {(villain.books?.length > 0 || villain.shorts?.length > 0) && (
              <div className="mt-3 text-xs">
                {villain.books && villain.books.length > 0 && (
                  <div className="mb-2">
                    <strong className="text-gray-700">Appears in Books:</strong>
                    <ul className="list-disc list-inside ml-2 text-gray-600">
                      {villain.books.map(book => (
                        <li key={`${villain.id}-book-${book.url || book.title}`}>{book.title}</li>
                        // Could be <Link href={`/book/${book.handle_from_url_or_data}`}><a>{book.title}</a></Link>
                      ))}
                    </ul>
                  </div>
                )}
                {villain.shorts && villain.shorts.length > 0 && (
                  <div>
                    <strong className="text-gray-700">Appears in Shorts:</strong>
                    <ul className="list-disc list-inside ml-2 text-gray-600">
                      {villain.shorts.map(short => (
                        <li key={`${villain.id}-short-${short.url || short.title}`}>{short.title}</li>
                         // Could be <Link href={`/short/${short.handle_from_url_or_data}`}><a>{short.title}</a></Link>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
             {(!villain.books || villain.books.length === 0) && (!villain.shorts || villain.shorts.length === 0) && (
                <p className="text-xs text-gray-500 mt-2 italic">No specific works listed in the API for this villain.</p>
             )}
          </ListItemCard>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch('https://stephen-king-api.onrender.com/api/villains');
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch villains, status: ${res.status}`, errorText);
      return {
        props: {
          villains: [],
          error: `API Error: ${res.status}. Could not load villain data.`
        },
        revalidate: 60,
      };
    }
    const data = await res.json();
    const villainsData = Array.isArray(data?.data) ? data.data : [];

    return {
      props: {
        villains: villainsData,
        error: null
      },
      revalidate: 3600, // Revalidate once per hour
    };
  } catch (error) {
    console.error("Error in getStaticProps for villains:", error);
    return {
      props: {
        villains: [],
        error: "A network or server error occurred while fetching villains."
      },
      revalidate: 60,
    };
  }
}
