
import HomeHeader from './components/HomeHeader';
import HomeCarousel from './components/HomeCarousel';
import HomeAbout from './components/HomeAbout';
import HomePagesSection from './components/HomePagesSection';
import HomeFooter from './components/HomeFooter';

export default function Page() {
  return (
    <div>
      <HomeHeader />
      <HomeCarousel />
      <HomeAbout />
      <HomePagesSection />
      <HomeFooter />
    </div>
  );
}