import Link from 'next/link';
import BookCarousel from './components/BookCarousel'; // Import the carousel component
import AboutStephenKing from './pages/about-stephen-king/page'; // Import the Kinggraphy component

// Data for the links and summaries
const pageLinks = [
  { href: "/pages/books", title: "BOOKS", summary: "Explore a comprehensive list of Stephen King's novels." },
  { href: "/pages/shorts", title: "SHORTS", summary: "Discover Stephen King's captivating short stories and novellas." },
  { href: "/pages/adapted-works", title: "ADAPTED WORKS", summary: "Explore adaptations of Stephen King's works." },
  { href: "/pages/villains", title: "VILLAINS", summary: "Delve into the dark world of Stephen King's most memorable villains." },
  { href: "/pages/google-books", title: "GOOGLE BOOKS", summary: "Search and browse Stephen King's works available on Google Books." },
  // Removed Kinggraphy link as it will be displayed directly on the home page
  { href: "https://stephenking.com", title: "STEPHENKING.COM", summary: "Visit the official website for the latest news and updates.", isExternal: true },
];

// Page component - Renders the main page with title and navigation links with summaries.
export default function Page() {
  return (
    <div 
      className="flex flex-col items-center min-h-screen bg-transparent py-10 px-4 page-background-text"
      style={{ '--page-background-text-content': "'STEPHEN KING UNIVERSE'" }}
    >
      {/* Book Carousel */}
      <BookCarousel />

      {/* Kinggraphy Content */}
      <div className="my-8 w-full max-w-4xl"> {/* Added margin for spacing and max-width */}
        <AboutStephenKing />
      </div>

      {/* Links Container */}
      <div className="w-full max-w-2xl mt-8"> {/* Added margin-top for spacing */}
        <div className="space-y-6"> {/* Vertical spacing between link items */}
          {pageLinks.map((link) => (
            <div key={link.title} className="flex flex-col items-start"> {/* Each link item: title + summary */}
              {link.isExternal ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-link text-2xl font-semibold text-[var(--link-color)] hover:text-[var(--link-hover-color)] hover:underline"
                >
                  {link.title} <span className="text-sm opacity-75">(Official Site)</span>
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="home-link text-2xl font-semibold text-[var(--link-color)] hover:text-[var(--link-hover-color)] hover:underline"
                >
                  {link.title}
                </Link>
              )}
              <p className="text-md text-gray-400 mt-1 ml-0.5"> {/* Summary text style, left-aligned */}
                {link.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}