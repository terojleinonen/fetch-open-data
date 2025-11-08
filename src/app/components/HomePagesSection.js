// src/app/components/HomePagesSection.js
import React from 'react';

const pageLinks = [
  {
    href: '/pages/books',
    title: 'Explore the Books',
    description: "Dive into the complete collection of Stephen King's novels and short stories. Filter by genre, publication date, and more.",
  },
  {
    href: '/pages/shorts',
    title: 'Explore the Shorts',
    description: "Discover Stephen King's captivating short stories, novellas, and novelettes. Perfect for quick reads and deep dives into his diverse narratives.",
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
  {
    href: '/pages/about-stephen-king',
    title: 'About Stephen King',
    description: 'Learn about the life and career of Stephen King, one of the most prolific authors of our time.',}
];

const HomePagesSection = () => {
  return (
    <section className="home-pages-section text-center py-16 px-4">
      <h2 className="text-4xl font-bold mb-12 section-title">Explore the Universe</h2>
      <div className="flex justify-center gap-8 overflow-x-auto pb-4">
        {pageLinks.map((link) => (
          <div key={link.href} className="card-item">
            <h3 className="text-2xl font-semibold mb-4">{link.title}</h3>
            <p className="text-text-secondary mb-6 flex-grow">{link.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePagesSection;
