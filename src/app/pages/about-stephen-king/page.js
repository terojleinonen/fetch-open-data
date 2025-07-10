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
        <p>Stephen King is an American author known for his prolific works in horror, supernatural fiction, suspense, and fantasy. With dozens of best-selling novels, he has earned the title "King of Horror." Many of his books have been adapted into acclaimed movies and television series, cementing his place in pop culture history.</p>
        {/* The original component had more detailed text.
            For this adaptation, I'm using the shorter text from the mockup.
            If the longer text is preferred, it can be reinstated here.
            For example, the first paragraph from the original component:
        */}
        {/*
        <p className="text-lg leading-relaxed mb-4">
          Stephen Edwin King (born September 21, 1947) is an American author. Dubbed the &quot;King of Horror&quot;, he is widely known for his horror novels and has also explored other genres, among them suspense, crime, science-fiction, fantasy, and mystery. Though known primarily for his novels, he has written approximately 200 short stories, most of which have been published in collections.
        </p>
        */}
      </div>
      {/* Links to Wikipedia and official site are removed as they are not in the mockup's "About" section design */}
    </section>
  );
};

export default AboutStephenKing;