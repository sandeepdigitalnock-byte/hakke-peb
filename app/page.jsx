import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import WhyChoose from '@/components/WhyChoose';
import IndustriesSection from '@/components/IndustriesSection';
import Testimonials from '@/components/Testimonials';
import ScrollBuild from '@/components/ScrollBuild';
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
        
        <IndustriesSection />
        <WhyChoose />
        <Testimonials />
        
        {/* Add more sections here: About, Divisions, Categories, Projects, Clients ... */}
        <ContactSection />
        <ClientsCarousel/>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
