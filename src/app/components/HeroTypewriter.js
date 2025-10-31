"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './HeroTypewriter.module.css';

export default function HeroTypewriter() {
  const subtitle = 'Where nightmares connect';
  const [display, setDisplay] = useState('');
  const cursorVisible = useRef(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let typing = true;
    let idx = 0;
    let timer = null;

    const doType = () => {
      if (!mounted.current) return;
      if (idx <= subtitle.length) {
        setDisplay(subtitle.slice(0, idx));
        idx += 1;
        timer = setTimeout(doType, 60 + Math.random() * 80);
      } else {
        // pause then erase
        timer = setTimeout(doErase, 2000);
      }
    };

    const doErase = () => {
      if (!mounted.current) return;
      if (idx >= 0) {
        setDisplay(subtitle.slice(0, idx));
        idx -= 1;
        timer = setTimeout(doErase, 24 + Math.random() * 30);
      } else {
        timer = setTimeout(() => { idx = 0; doType(); }, 500);
      }
    };

    doType();

    const blink = setInterval(() => { cursorVisible.current = !cursorVisible.current; /* force re-render */ setDisplay(d => d); }, 600);

    return () => { mounted.current = false; clearTimeout(timer); clearInterval(blink); };
  }, []);

  const handleScroll = () => {
    const el = document.getElementById('main-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} role="region" aria-label="Landing hero">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.sepiaGlow} aria-hidden="true" />

      <div className={styles.fog} aria-hidden="true">
        <div className={`${styles.fogLayer}`} />
        <div className={`${styles.fogLayer} ${styles.two}`} />
        <div className={`${styles.fogLayer} ${styles.three}`} />
      </div>

      <div className={styles.content}>
        <div className={styles.paper} aria-hidden="true">
          <div className={styles.paperInner}>
            <div className={styles.welcome}>WELCOME TO</div>
            <h2 className={styles.paperTitle}>THE STEPHEN KING UNIVERSE</h2>
          </div>
        </div>

        <div className={`${styles.subtitle} ${styles.typewriterNote}`}>
          {display}
          <span className={styles.cursor} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.scrollHint} onClick={handleScroll} role="button" tabIndex={0} aria-label="Scroll down">
        <div className={styles.arrow} />
      </div>
    </section>
  );
}
