import BookCarousel from './components/BookCarousel'; // Import the carousel component
import AboutStephenKing from './pages/about-stephen-king/page'; // Import the Kinggraphy component
import PageLinks from './components/PageLinks'; // Import the new PageLinks component

// Data for the links and summaries
const pageLinks = [
  {
    href: "/pages/books",
    title: "BOOKS",
    summary: "This section presents a curated list of Stephen King's novels, sourced from various literary databases and fan wikis. The data is processed to provide you with a comprehensive overview of each novel, including publication dates and summaries. Here, you can explore King's extensive bibliography, filter books by genre or publication year, and find detailed information about each novel."
  },
  {
    href: "/pages/shorts",
    title: "SHORTS",
    summary: "Discover Stephen King's captivating short stories and novellas. This information is compiled from official bibliographies and respected fan resources. Each entry is organized to help you easily find individual stories or collections. You can browse through a wide array of King's shorter fiction, search for specific titles, and learn more about the collections in which they appear."
  },
  {
    href: "/pages/adapted-works",
    title: "ADAPTED WORKS",
    summary: "Explore adaptations of Stephen King's works across various media, including films, TV series, and comics. The information is gathered from film databases, official announcements, and entertainment news sites. It's categorized by media type for easy navigation. Users can discover the different ways King's stories have been brought to life, compare adaptations, and find details about their release and reception."
  },
  {
    href: "/pages/villains",
    title: "VILLAINS",
    summary: "Delve into the dark world of Stephen King's most memorable villains. Information is drawn from analyses of his books and films, focusing on character studies and critical interpretations. The content is structured to provide insights into the motivations and impacts of these characters. You can learn about the antagonists that define King's horror, understand their roles in the narratives, and explore their cultural significance."
  },
  {
    href: "/pages/google-books",
    title: "GOOGLE BOOKS",
    summary: "Search and browse Stephen King's works available on Google Books. This feature utilizes the Google Books API to fetch real-time data. The information is presented to allow for direct searching and exploration of available titles. Users can look up specific books, preview content where available, and access links to purchase or borrow from Google Books."
  },
  {
    href: "https://stephenking.com",
    title: "STEPHENKING.COM",
    summary: "Visit the official Stephen King website for the latest news, tour dates, and exclusive content. This site is the primary source of official information directly from Stephen King and his team. It's regularly updated with fresh content. Users can find official announcements, read blog posts, and get information about upcoming projects straight from the source.",
    isExternal: true
  },
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

      {/* PageLinks Component */}
      <PageLinks pageLinks={pageLinks} />
    </div>
  );
}