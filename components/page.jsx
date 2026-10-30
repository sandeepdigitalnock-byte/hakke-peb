import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';

import ScrollBuild from '@/components/ScrollBuild';
import IndustriesSection from '@/components/IndustriesSection';
import WhyChoose from '@/components/WhyChoose'; 

import ContactSection from '@/components/ContactSection';
import ClientsCarousel from '@/components/ClientsCarousel';
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
        <IndustriesSection/>
        <WhyChoose />
        <ContactSection />
        <ClientsCarousel/>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
