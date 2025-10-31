
// src/app/components/HomeAbout.js
import React from 'react';
import Image from 'next/image';

const HomeAbout = () => {
  return (
    <section className="home-about">
      <div className="home-about-image-container">
        <Image
          src="/stephen-king-2024.jpg" // Assuming this is the image path
          alt="Stephen King"
          width={250}
          height={350}
          className="home-about-img"
        />
      </div>
      <div className="home-about-text">
        <h2>About the Author</h2>
        <p>
          Stephen King is one of the most renowned authors of our time, known for his gripping tales of horror, suspense, and the supernatural. With over 60 novels and 200 short stories, his work has captivated readers worldwide.
        </p>
        <p>
          This website is a tribute to his vast literary universe, offering fans a place to explore his books, the adaptations they've inspired, and the sinister villains that haunt his pages.
        </p>
      </div>
    </section>
  );
};

export default HomeAbout;
