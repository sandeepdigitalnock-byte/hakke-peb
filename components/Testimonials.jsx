'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaStar, FaQuoteRight, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { TESTIMONIALS, TESTIMONIALS_INTRO } from '@/lib/testimonials';

gsap.registerPlugin(ScrollTrigger);

function Arrow({ dir, onClick, className = '' }) {
  const Icon = dir < 0 ? FaChevronLeft : FaChevronRight;
  return (
    <button onClick={onClick} aria-label={dir < 0 ? 'Previous testimonials' : 'Next testimonials'}
      className={`grid h-12 w-12 place-items-center rounded-full border border-slate-800 bg-white text-slate-900 transition hover:bg-brand hover:text-white hover:border-brand ${className}`}>
      <Icon />
    </button>
  );
}

export default function Testimonials() {
  const root = useRef(null);
  const track = useRef(null);
  const marquee = useRef(null);
  const [paused, setPaused] = useState(false);

  const slide = useCallback((dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('[data-t]');
    const step = card.offsetWidth + 24;
    const max = el.scrollWidth - el.clientWidth;
    if (dir > 0 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior: 'smooth' });
    else el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  // autoplay
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => slide(1), 5500);
    return () => clearInterval(id);
  }, [paused, slide]);

  // animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tween = gsap.to(marquee.current, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
      // scrolling speeds the marquee up and sets its direction
      ScrollTrigger.create({
        trigger: root.current, start: 'top bottom', end: 'bottom top',
        onUpdate: (s) => gsap.to(tween, { timeScale: s.direction * Math.min(1 + Math.abs(s.getVelocity()) / 400, 5), duration: 0.3, overwrite: true }),
      });
      gsap.from('[data-thead] > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: '[data-thead]', start: 'top 88%' } });
      gsap.from('[data-t]', {
        y: 70, rotationX: -30, rotationY: 12, opacity: 0, transformPerspective: 1000, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.12, ease: 'power3.out',
        clearProps: 'transform,opacity', scrollTrigger: { trigger: track.current, start: 'top 88%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const loop = [...TESTIMONIALS_INTRO.marquee, ...TESTIMONIALS_INTRO.marquee];

  return (
    <section ref={root} className="overflow-hidden bg-[#f0f3f7] py-14 sm:py-20" aria-labelledby="testi-heading">
      {/* Outlined marquee text */}
      <div className="select-none overflow-hidden" aria-hidden="true">
        <div ref={marquee} className="flex w-max items-center gap-10 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-10">
              {loop.map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-10">
                  <span className="text-[clamp(44px,9vw,140px)] font-normal leading-none" style={{ WebkitTextStroke: '2px #334155', color: 'transparent' }}>{t}</span>
                  <span className="h-[clamp(36px,5vw,80px)] w-[clamp(36px,5vw,80px)] rounded-full bg-slate-300" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1400px] px-4 sm:mt-20 sm:px-6">
        <div data-thead className="text-center">
          <span className="inline-block rounded-full border border-slate-300 px-6 py-2 text-sm font-medium tracking-wide text-brand">{TESTIMONIALS_INTRO.badge}</span>
          <h2 id="testi-heading" className="mt-6 text-3xl font-normal text-slate-900 sm:text-5xl lg:text-[56px]">{TESTIMONIALS_INTRO.title}</h2>
        </div>

        <div className="relative mt-10 sm:mt-14" role="region" aria-roledescription="carousel" aria-label="Client testimonials"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div ref={track} className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ perspective: 1200 }}>
            {TESTIMONIALS.map((t) => (
              <article key={t.name} data-t
                className="relative min-h-[300px] shrink-0 basis-full snap-start rounded-[36px] bg-white p-7 pb-28 shadow-[0_6px_28px_rgba(15,23,42,.06)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(11,111,181,.18)] sm:basis-[calc(50%-12px)] sm:p-9 sm:pb-28 lg:basis-[calc(33.333%-16px)]">
                <FaQuoteRight className="absolute right-8 top-8 text-[88px] text-slate-100" aria-hidden="true" />
                <div className="relative flex gap-1 text-[22px] text-[#fbbf24]" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (<FaStar key={i} />))}
                </div>
                <p className="relative mt-5 text-base leading-8 text-slate-700 sm:text-lg">{t.text}</p>
                <h3 className="absolute bottom-8 left-7 text-xl font-semibold text-slate-700 sm:left-9 sm:text-2xl">{t.name}</h3>
                {/* avatar with notch */}
                <div className="absolute -bottom-4 -right-4 grid h-[104px] w-[104px] place-items-center rounded-full border-[14px] border-[#f0f3f7] bg-[#f0f3f7]">
                  <span className="grid h-[68px] w-[68px] place-items-center rounded-full bg-brand text-3xl text-white"><FaUser /></span>
                </div>
              </article>
            ))}
          </div>

          {/* side arrows (md and up) */}
          <Arrow dir={-1} onClick={() => slide(-1)} className="absolute -left-2 top-1/2 hidden -translate-y-1/2 md:grid xl:-left-6" />
          <Arrow dir={1} onClick={() => slide(1)} className="absolute -right-2 top-1/2 hidden -translate-y-1/2 md:grid xl:-right-6" />
          {/* bottom arrows (phones) */}
          <div className="mt-4 flex justify-center gap-4 md:hidden">
            <Arrow dir={-1} onClick={() => slide(-1)} />
            <Arrow dir={1} onClick={() => slide(1)} />
          </div>
        </div>
      </div>
    </section>
  );
}
