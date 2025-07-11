import Image from 'next/image';
// Link and PageTitle are not used in the new version based on the mockup for this specific component
// import Link from 'next/link'; 
// import PageTitle from '@/app/components/PageTitle';

const AboutStephenKing = () => {
  return (
    <section className="home-about">
      <div className="home-about-image-container">
        {/* The mockup uses a generic placeholder, but we have a specific image.
            The mockup image is 250x350. Adjusting height from 375 to 350.
            The figcaption is not in the mockup's "About" section design.
        */}
        <Image
          src="/stephen-king-2024.jpg"
          alt="Stephen King Portrait" // More descriptive alt text from mockup
          width={250}
          height={350} // Adjusted to match mockup
          // style={{ objectFit: 'cover', borderRadius: '8px' }} // Styling will be done via CSS classes
          className="home-about-img" // Class for specific styling if needed beyond container
        />
        {/* Removed figcaption as it's not in the mockup's design for this section */}
      </div>
      <div className="home-about-text">
        <h2>About Stephen King</h2>
        {/* Using the text from the mockup */}
        <p>Stephen King, born September 21, 1947, in Portland, Maine, is one of the most prolific and widely recognized authors of our time. His journey into writing began at a young age, and he published his first professional short story in 1967. After graduating from the University of Maine, he worked as a teacher while continuing to write in his spare time. The breakthrough came with his first novel, &quot;Carrie,&quot; published in 1974, which quickly became a bestseller and was adapted into a successful film. This early success set the stage for a remarkable career spanning decades.</p>
        <p style={{ marginTop: '1rem' }}>King is best known for his mastery of the horror genre, but his works also encompass supernatural fiction, suspense, crime, science-fiction, fantasy, and even non-fiction. His storytelling often explores themes of good versus evil, the complexities of human nature, and the supernatural lurking beneath the surface of ordinary life, frequently set in his home state of Maine. Over the years, he has penned over 60 novels and hundreds of short stories, many of which have become cultural touchstones. His ability to create vivid characters and terrifying scenarios has earned him numerous accolades, including the National Medal of Arts and multiple Bram Stoker Awards.</p>
        <p style={{ marginTop: '1rem' }}>Beyond his novels, King's influence extends deeply into popular culture through the numerous adaptations of his work. Films like &quot;The Shining,&quot; &quot;The Shawshank Redemption,&quot; and &quot;It&quot; have become classics, introducing his narratives to even wider audiences. He continues to write and publish regularly, maintaining his status as a literary icon whose works are read and beloved by millions around the globe. His enduring legacy is not just in the sheer volume of his output, but in his profound impact on contemporary literature and genre fiction.</p>
        <p style={{ marginTop: '1rem' }}>For more information, visit the <a href="https://en.wikipedia.org/wiki/Stephen_King" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Stephen King Wikipedia page</a>.</p>
      </div>
      {/* Links to Wikipedia and official site are removed as they are not in the mockup's "About" section design */}
    </section>
  );
};

export default AboutStephenKing;