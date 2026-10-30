import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import ScrollBuild from '@/components/ScrollBuild';
import MapSection from '@/components/MapSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <AboutSection />
        <ScrollBuild />
        {/* Add more sections here: About, Divisions, Categories, Projects, Clients ... */}
         <WhyChoose />
        <MapSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
