import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import WhyChoose from '@/components/WhyChoose';
import IndustriesSection from '@/components/IndustriesSection';
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
       
        <IndustriesSection />
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
