'use client';

import Image from 'next/image';

// items: Array of objects with { imgSrc, alt, caption }
const BookCarousel = ({ items }) => {
  if (!items || items.length === 0) {
    // Optionally, render a placeholder or nothing if no items are provided
    return <div className="home-carousel-placeholder">No carousel items to display.</div>;
  }

  return (
    <div className="home-carousel">
      {items.map((item, index) => (
        <div className="home-carousel-item" key={index}>
          <Image
            src={item.imgSrc}
            alt={item.alt}
            width={200} // As per mockup
            height={300} // As per mockup
            style={{ objectFit: 'cover' }} // Ensures image covers the area, might crop
            className="home-carousel-image" // Added for potential specific image styling
          />
          <div className="home-carousel-caption">{item.caption}</div>
        </div>
      ))}
    </div>
  );
};

export default BookCarousel;
