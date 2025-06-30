import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';

const Layout = ({ children, title = "Stephen King Fan Hub" }) => {
  return (
    <div className="flex flex-col min-h-screen bg-off-white text-dark-gray">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="A fan hub for all things Stephen King." />
        {/* Add more specific meta tags per page if needed via Head component in individual pages */}
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
