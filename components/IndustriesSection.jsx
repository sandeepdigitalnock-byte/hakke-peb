'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INDUSTRIES, INDUSTRIES_INTRO } from '@/lib/industries';

gsap.registerPlugin(ScrollTrigger);

export default function IndustriesSection() {
  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-ind-head] > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: '[data-ind-head]', start: 'top 88%' } });
      gsap.set('[data-ind]', { opacity: 0 });
      ScrollTrigger.batch('[data-ind]', {
        start: 'top 92%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { y: 60, rotationX: -35, opacity: 0, transformPerspective: 900, transformOrigin: '50% 100%' },
            { y: 0, rotationX: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', clearProps: 'all' }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-white py-14 sm:py-20" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div data-ind-head className="mx-auto max-w-3xl text-center">
          <h2 id="industries-heading" className="text-3xl font-bold text-slate-800 sm:text-4xl lg:text-[42px]">{INDUSTRIES_INTRO.title}</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-brand sm:text-base sm:leading-8">{INDUSTRIES_INTRO.text}</p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3 lg:gap-6" style={{ perspective: 1200 }}>
          {INDUSTRIES.map((it) => (
            <li key={it.slug} data-ind>
              <Link href={`/industries/${it.slug}`}
                className="group block h-full overflow-hidden rounded-xl bg-white shadow-[0_2px_14px_rgba(15,23,42,.10)] ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_34px_rgba(11,111,181,.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={it.image} alt={it.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <h3 className="px-2 py-4 text-center text-[15px] font-medium text-slate-800 transition-colors group-hover:text-brand sm:py-5 sm:text-lg lg:text-xl">{it.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
