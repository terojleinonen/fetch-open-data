// src/app/components/HomePagesSection.js
import React from 'react';
import Link from 'next/link';

const pageLinks = [
  {
    href: '/pages/books',
    title: 'Explore the Books',
    description: "Dive into the complete collection of Stephen King's novels and short stories. Filter by genre, publication date, and more.",
  },
  {
    href: '/pages/adapted-works',
    title: 'Discover the Adaptations',
    description: 'From the big screen to television, explore the many film and TV adaptations of King\'s work.',
  },
  {
    href: '/pages/villains',
    title: 'Meet the Villains',
    description: 'Come face-to-face with the most terrifying antagonists from the King universe.',
  },
];

const HomePagesSection = () => {
  return (
    <section className="home-pages-section">
      <h2>Explore the Universe</h2>
      <div className="home-pages-grid">
        {pageLinks.map((link) => (
          <div key={link.href} className="home-page-card">
            <h3>{link.title}</h3>
            <p>{link.description}</p>
            <Link href={link.href} passHref>
              <button>Go to Page</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePagesSection;
