import BookCarousel from './components/BookCarousel';
import AboutStephenKing from './pages/about-stephen-king/page';
import PageLinks from './components/PageLinks';

// Data for the PageLinks component, with updated content
const homePageCards = [
  {
    title: "BOOKS",
    description: "This section presents a curated list of Stephen King's novels, sourced from various literary databases and fan wikis. The data is processed to provide you with a comprehensive overview of each novel, including publication dates and summaries. Here, you can explore King's extensive bibliography, filter books by genre or publication year, and find detailed information about each novel.",
    buttonText: "Visit Page",
    link: "/pages/books"
  },
  {
    title: "SHORTS",
    description: "Discover Stephen King's captivating short stories and novellas. This information is compiled from official bibliographies and respected fan resources. Each entry is organized to help you easily find individual stories or collections. You can browse through a wide array of King's shorter fiction, search for specific titles, and learn more about the collections in which they appear.",
    buttonText: "Visit Page",
    link: "/pages/shorts"
  },
  {
    title: "ADAPTED WORKS",
    description: "Explore adaptations of Stephen King's works across various media, including films, TV series, and comics. The information is gathered from film databases, official announcements, and entertainment news sites. It's categorized by media type for easy navigation. Users can discover the different ways King's stories have been brought to life, compare adaptations, and find details about their release and reception.",
    buttonText: "Visit Page",
    link: "/pages/adapted-works"
  },
  {
    title: "VILLAINS",
    description: "Delve into the dark world of Stephen King's most memorable villains. Information is drawn from analyses of his books and films, focusing on character studies and critical interpretations. The content is structured to provide insights into the motivations and impacts of these characters. You can learn about the antagonists that define King's horror, understand their roles in the narratives, and explore their cultural significance.",
    buttonText: "Visit Page",
    link: "/pages/villains"
  }
];

export default function Page() {
  // carouselItemsData is no longer needed here as BookCarousel fetches its own data.

  return (
    <div className="w-full md:w-3/4 md:mx-auto px-4 md:px-0">
      <header className="home-header">
        <h1>Stephen King Universe</h1>
      </header>

      <BookCarousel /> {/* items prop removed */}
      <AboutStephenKing />
      <PageLinks cards={homePageCards} />

      <footer className="home-footer">
        &copy; {new Date().getFullYear()} Stephen King Universe Fan Page. All rights reserved.
      </footer>
    </div>
  );
}