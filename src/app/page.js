import BookCarousel from './components/BookCarousel';
import AboutStephenKing from './pages/about-stephen-king/page';
import PageLinks from './components/PageLinks';

// Data for the PageLinks component, matching the mockup's "Explore the Universe" section
const homePageCards = [
  {
    title: "From Page to Screen Timeline",
    description: "See how Stephen King's novels became iconic movies and shows over the decades.",
    buttonText: "Visit Page",
    link: "/pages/adapted-works" // Example link, can be more specific to a timeline view if available
  },
  {
    title: "Books & Stories Library",
    description: "Browse through every published story and novel by Stephen King.",
    buttonText: "Visit Page",
    link: "/pages/books"
  },
  {
    title: "Adaptations Hub",
    description: "Discover films, miniseries, and TV shows based on his chilling works.",
    buttonText: "Visit Page",
    link: "/pages/adapted-works"
  }
];

export default function Page() {
  // Carousel items data, matching the mockup
  // We'll pass this to BookCarousel or BookCarousel will define its own static data for now
  const carouselItemsData = [
    { imgSrc: "/placeholder_book_1.jpg", alt: "Book Cover 1", caption: "Carrie (1974)" },
    { imgSrc: "/placeholder_book_2.jpg", alt: "Book Cover 2", caption: "The Shining (1977)" },
    { imgSrc: "/placeholder_book_3.jpg", alt: "Book Cover 3", caption: "It (1986)" },
    { imgSrc: "/placeholder_book_4.jpg", alt: "Book Cover 4", caption: "Misery (1987)" },
  ];

  return (
    // Main container for the entire page. Styling will be handled by globals.css on body/root
    // and specific section classes.
    <>
      <header className="home-header">
        <h1>Stephen King Universe</h1>
      </header>

      {/* Book Carousel Section */}
      {/* BookCarousel component will be modified to have className="home-carousel" internally */}
      <BookCarousel items={carouselItemsData} />

      {/* About Stephen King Section */}
      {/* AboutStephenKing component will be modified to have className="home-about" internally */}
      <AboutStephenKing />

      {/* PageLinks Component - will be modified to be the "Explore the Universe" section */}
      {/* It will take homePageCards data and render them as specified in the plan */}
      <PageLinks cards={homePageCards} />

      <footer className="home-footer">
        &copy; {new Date().getFullYear()} Stephen King Universe Fan Page. All rights reserved.
      </footer>
    </>
  );
}