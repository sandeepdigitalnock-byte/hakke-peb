'use client';
import { useEffect, useState } from 'react';
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa';
import { SITE } from '@/lib/site';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
         className="fixed bottom-[22%] right-5 z-40 grid h-[82px] w-[82px] place-items-center rounded-full bg-[#25d366] text-[46px] text-white shadow-xl transition hover:scale-105">
        <FaWhatsapp />
      </a>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
              className={`fixed bottom-6 right-5 z-40 grid h-[74px] w-[74px] place-items-center rounded-full border-[3px] border-white bg-brand text-3xl text-white shadow-[0_0_20px_rgba(11,111,181,.8)] transition-all ${showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
        <FaArrowUp />
      </button>
    </>
  );
}
