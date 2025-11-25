'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './AboutPage.module.css'; // Import the CSS module

const AboutPage = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className={`${styles.aboutPage} ${isVisible ? styles.fadeIn : ''}`}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>About Stephen King</h2>
        <p className={styles.paragraph}>
          Stephen King, born September 21, 1947, in Portland, Maine, is one of the most prolific and widely recognized authors of our time. His journey into writing began at a young age, and he published his first professional short story in 1967. After graduating from the University of Maine, he worked as a teacher while continuing to write in his spare time. The breakthrough came with his first novel, &quot;Carrie,&quot; published in 1974, which quickly became a bestseller and was adapted into a successful film. This early success set the stage for a remarkable career spanning decades.
        </p>
        <p className={styles.paragraph}>
          King is best known for his mastery of the horror genre, but his works also encompass supernatural fiction, suspense, crime, science-fiction, fantasy, and even non-fiction. His storytelling often explores themes of good versus evil, the complexities of human nature, and the supernatural lurking beneath the surface of ordinary life, frequently set in his home state of Maine. Over the years, he has penned over 60 novels and hundreds of short stories, many of which have become cultural touchstones. His ability to create vivid characters and terrifying scenarios has earned him numerous accolades, including the National Medal of Arts and multiple Bram Stoker Awards.
        </p>
        <p className={styles.paragraph}>
          Beyond his novels, King&apos;s influence extends deeply into popular culture through the numerous adaptations of his work. Films like &quot;The Shining,&quot; &quot;The Shawshank Redemption,&quot; and &quot;It&quot; have become classics, introducing his narratives to even wider audiences. He continues to write and publish regularly, maintaining his status as a literary icon whose works are read and beloved by millions around the globe. His enduring legacy is not just in the sheer volume of his output, but in his profound impact on contemporary literature and genre fiction.
        </p>
        <p className={styles.paragraph}>
          <Link href="https://en.wikipedia.org/wiki/Stephen_King" target="_blank" rel="noopener noreferrer" aria-label="Stephen King Wikipedia page">
            Learn more on Wikipedia
          </Link>
        </p>
        <p className={styles.paragraph}>
          <Link href="https://www.stephenking.com/" target="_blank" rel="noopener noreferrer" aria-label="Stephen King official website">
            Learn more on the official website
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AboutPage;


