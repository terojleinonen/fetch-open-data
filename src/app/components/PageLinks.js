import Link from 'next/link';

// Receives 'cards' prop which is an array of objects:
// { title, description, buttonText, link }
export default function PageLinks({ cards }) {
  if (!cards || cards.length === 0) {
    return (
      <section className="home-pages-section">
        <h2>Explore the Universe</h2>
        <p>No pages to display.</p>
      </section>
    );
  }

  return (
    <section className="home-pages-section">
      <h2>Explore the Universe</h2>
      <div className="home-pages-grid">
        {cards.map((card, index) => (
          <div className="home-page-card" key={index}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            {/* Assuming all links are internal for now as per mockup structure */}
            <Link href={card.link} passHref>
              <button>{card.buttonText}</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
