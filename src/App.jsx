import './index.css';
import MarqueeBar from './components/MarqueeBar';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import FeaturesRow from './components/FeaturesRow';
import AboutSection from './components/AboutSection';
import ProductCategories from './components/ProductCategories';
import ParallaxCTA from './components/ParallaxCTA';
import BrandsWeHandle from './components/BrandsWeHandle';
import PricelistCTA from './components/PricelistCTA';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

function App() {
  return (
    <>
      <MarqueeBar />
      <Header />
      <Navbar />
      <HeroCarousel />
      <FeaturesRow />
      <AboutSection />
      <ProductCategories />
      <ParallaxCTA />
      <BrandsWeHandle />
      <PricelistCTA />
      <WhyChooseUs />
      <Footer />
      <FloatingButtons />
    </>
  );
}

export default App;
