
// src/app/components/HomeFooter.js
import React from 'react';

const HomeFooter = () => {
  return (
    <footer className="home-footer">
      <p>&copy; {new Date().getFullYear()} The Stephen King Universe. All rights reserved.</p>
      <p>This is a fan-made website and is not affiliated with Stephen King or his publishers.</p>
    </footer>
  );
};

export default HomeFooter;
