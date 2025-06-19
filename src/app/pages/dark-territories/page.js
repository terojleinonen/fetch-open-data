// src/app/pages/dark-territories/page.js
import Link from 'next/link';

export default function DarkTerritoriesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[var(--text-color)] px-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Dark Territories
        </h1>
        <p className="text-lg md:text-xl" style={{ fontFamily: 'Georgia, serif' }}>
          An interactive exploration of the Stephen King universe.
        </p>
        <p className="text-md md:text-lg mt-2 italic" style={{ fontFamily: 'Georgia, serif', color: 'var(--accent-color)' }}>
          (Coming Soon)
        </p>
      </header>

      <div className="text-center my-8">
        {/* Placeholder for future interactive content */}
      </div>

      <Link href="/" className="home-link text-xl mt-12">
        Return to Home
      </Link>
    </div>
  );
}
