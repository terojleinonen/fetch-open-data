import Layout from '../components/Layout';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Layout title="Welcome - Stephen King Fan Hub">
      <div className="text-center py-10 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-classic-red mb-6 animate-fade-in-down">
          Stephen King Fan Hub
        </h1>
        <p className="text-lg sm:text-xl text-dark-gray mb-8 animate-fade-in-up">
          Your ultimate destination to explore the chilling worlds, captivating stories, and unforgettable characters of Stephen King.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in">
          <Link href="/books" legacyBehavior>
            <a className="inline-block bg-classic-red text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              Explore Books
            </a>
          </Link>
          <Link href="/google-books" legacyBehavior>
            <a className="inline-block bg-dark-gray text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              Search on Google Books
            </a>
          </Link>
        </div>
      </div>

      {/* Optional: A small section highlighting a few things */}
      <div className="mt-16 pt-8 border-t border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-dark-gray mb-8">Discover More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <h3 className="text-xl font-semibold text-classic-red mb-2">Vast Bibliography</h3>
            <p className="text-gray-600">Browse through novels, short stories, and collections.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-classic-red mb-2">Iconic Villains</h3>
            <p className="text-gray-600">Learn about the antagonists that haunt King&apos;s universe.</p>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-classic-red mb-2">Rich Lore</h3>
            <p className="text-gray-600">Dive deep into the details from various sources.</p>
          </div>
        </div>
      </div>
      {/* Basic CSS for animations (can be in a global CSS file or a style jsx block) */}
      <style jsx global>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out 0.2s forwards; } /* delay */
        .animate-fade-in { animation: fade-in 1s ease-out 0.4s forwards; } /* delay */
      `}</style>
    </Layout>
  );
}
