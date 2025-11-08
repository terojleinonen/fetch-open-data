import HomePagesSection from './components/HomePagesSection';
import HomeFooter from './components/HomeFooter';
import HeroTypewriter from './components/HeroTypewriter';

export default function Page() {
  return (
    <div>
      <HeroTypewriter />
      <HomePagesSection />
      <HomeFooter />
    </div>
  );
}