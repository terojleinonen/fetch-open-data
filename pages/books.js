import Layout from '../components/Layout';
import ListItemCard from '../components/ListItemCard';

export default function BooksPage({ books, error }) {
  if (error) {
    return (
      <Layout title="Error - Stephen King Fan Hub">
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-classic-red mb-4">Error Fetching Books</h1>
          <p className="text-dark-gray">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!books || books.length === 0) {
    return (
      <Layout title="Books - Stephen King Fan Hub">
        <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-6">Stephen King&apos;s Novels &amp; Collections</h1>
        <p className="text-dark-gray">No books found or still loading...</p>
        {/* You could add a spinner or a more sophisticated loading state here */}
      </Layout>
    );
  }

  return (
    <Layout title="Books - Stephen King Fan Hub">
      <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-8 text-center">
        Stephen King&apos;s Novels &amp; Collections
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {books.map((book) => (
          <ListItemCard
            key={book.id}
            title={book.Title}
            year={book.Year}
            keyInfo={`Publisher: ${book.Publisher || 'N/A'} | Pages: ${book.Pages || 'N/A'}`}
            notes={book.Notes && book.Notes.length > 0 && book.Notes[0] !== "" ? book.Notes.filter(n => n).join('; ') : undefined}
            // detailsLink={`/book/${book.handle}`} // Example for future detail page
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch('https://stephen-king-api.onrender.com/api/books');
    if (!res.ok) {
      // Log the error and return it as a prop
      const errorText = await res.text();
      console.error(`Failed to fetch books, status: ${res.status}`, errorText);
      return {
        props: {
          books: [],
          error: `API Error: ${res.status}. Could not load book data.`
        },
        revalidate: 60, // Try to revalidate after 60 seconds on error
      };
    }
    const data = await res.json();
    // Ensure data.data exists and is an array
    const booksData = Array.isArray(data?.data) ? data.data : [];

    return {
      props: {
        books: booksData,
        error: null
      },
      revalidate: 3600, // Revalidate once per hour (1 hour)
    };
  } catch (error) {
    console.error("Error in getStaticProps for books:", error);
    return {
      props: {
        books: [],
        error: "A network or server error occurred while fetching books."
      },
      revalidate: 60, // Try to revalidate
    };
  }
}
