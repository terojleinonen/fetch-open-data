
import AboutStephenKing from './pages/about-stephen-king/page';
import PageLinks from './components/PageLinks';

// Data for the PageLinks component, with updated content
const homePageCards = [
  {
    title: "BOOKS",
    description: "Explore Stephen King's extensive bibliography of novels. Filter by genre or publication year and find detailed information on each captivating story.",
    buttonText: "Visit Page",
    link: "/pages/books"
  },
  {
    title: "SHORTS",
    description: "Discover a wide array of Stephen King's shorter fiction, including gripping short stories and novellas. Search for specific titles and learn about their collections.",
    buttonText: "Visit Page",
    link: "/pages/shorts"
  },
  {
    title: "ADAPTED WORKS",
    description: "Browse adaptations of King's works across films, TV series, and comics. Discover how his iconic stories have been brought to life in different media.",
    buttonText: "Visit Page",
    link: "/pages/adapted-works"
  },
  {
    title: "VILLAINS",
    description: "Delve into the dark world of King's most memorable antagonists. Understand their motivations, roles in the narratives, and their cultural significance in horror.",
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
      <AboutStephenKing />
      <PageLinks cards={homePageCards} />
      <footer className="home-footer">
        &copy; {new Date().getFullYear()} Stephen King Universe Fan Page. All rights reserved.
      </footer>
    </div>
  );
}