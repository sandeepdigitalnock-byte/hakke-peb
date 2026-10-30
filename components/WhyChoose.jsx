'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaIndustry, FaDraftingCompass, FaRupeeSign, FaShippingFast } from 'react-icons/fa';
import { WHY } from '@/lib/why';

gsap.registerPlugin(ScrollTrigger);
const icons = [FaIndustry, FaDraftingCompass, FaRupeeSign, FaShippingFast];
const NAV = '7rem'; // sticky nav height (h-28)

export default function WhyChoose() {
  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // background: stays fixed (sticky) while slowly zooming/drifting
      gsap.fromTo('[data-bg]', { scale: 1.12, yPercent: -4 }, {
        scale: 1.32, yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      // heading drifts back and fades as the card slides over it
      gsap.to('[data-head]', {
        y: -90, scale: 0.94, opacity: 0.25, transformOrigin: '0% 0%', ease: 'none',
        scrollTrigger: { trigger: '[data-wrap]', start: 'top 60%', end: 'top -10%', scrub: true },
      });
      // card slides up and tilts flat in 3D
      gsap.fromTo('[data-card]', { y: 220, rotationX: 32, opacity: 0.1, transformPerspective: 1400, transformOrigin: '50% 100%' }, {
        y: 0, rotationX: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '[data-wrap]', start: 'top 98%', end: 'top 50%', scrub: true },
      });
      // each feature swings in
      gsap.utils.toArray('[data-row]').forEach((r) => {
        gsap.fromTo(r, { x: -70, rotationY: -35, opacity: 0, transformPerspective: 900, transformOrigin: '0% 50%' }, {
          x: 0, rotationY: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: r, start: 'top 92%', end: 'top 68%', scrub: true },
        });
        gsap.fromTo(r.querySelector('[data-ic]'), { rotationY: 180, scale: 0.4 }, {
          rotationY: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: r, start: 'top 90%', end: 'top 62%', scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative" aria-labelledby="why-heading">
      {/* Fixed (sticky) background */}
      <div className="sticky overflow-hidden bg-slate-800" style={{ top: NAV, height: `calc(100vh - ${NAV})` }}>
        <img data-bg src={WHY.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
      </div>

      {/* Content scrolls over it */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-20 pt-16 sm:px-6 sm:pt-24" style={{ marginTop: `calc(-100vh + ${NAV})`, minHeight: '150vh' }}>
        <div data-head className="max-w-[820px] text-white">
          <span className="inline-block rounded-full border border-white/70 px-5 py-2 text-xs font-medium uppercase tracking-wide sm:text-sm">{WHY.badge}</span>
          <h2 id="why-heading" className="mt-5 text-4xl font-normal leading-[1.1] sm:text-5xl lg:text-[64px]">{WHY.heading}</h2>
          <p className="mt-5 text-base leading-8 sm:text-xl sm:leading-9">{WHY.text}</p>
        </div>

        <div data-wrap className="mt-16 sm:mt-24" style={{ perspective: 1400 }}>
          <div data-card className="max-w-[740px] rounded-3xl bg-[#eef2f6] p-6 shadow-2xl shadow-black/40 sm:p-10">
            <ul className="space-y-9 sm:space-y-10">
              {WHY.features.map((f, i) => {
                const Icon = icons[i];
                return (
                  <li key={f.title} data-row className="flex gap-5 sm:gap-8">
                    <div data-ic className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-slate-800 text-3xl text-slate-800 sm:h-20 sm:w-20 sm:text-4xl">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 sm:text-[20px]">{f.title}</h3>
                      <p className="mt-2 text-[13px] leading-7 text-slate-600 sm:text-lg sm:leading-8">{f.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
