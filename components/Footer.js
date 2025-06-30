const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 text-dark-gray text-sm py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-2">
          <a
            href="https://stephenking.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-classic-red hover:underline mx-2"
          >
            Official Stephen King Site
          </a>
          |
          <a
            href="https://stephen-king-api.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-classic-red hover:underline mx-2"
          >
            Stephen King API Source
          </a>
          {/* Add other links if desired, e.g., Privacy Policy */}
        </div>
        <p>
          &copy; {currentYear} Stephen King Fan Hub. All rights reserved.
        </p>
        <p className="mt-1 text-xs text-gray-500">
          This is a fan-made website. Data is sourced from publicly available APIs.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
