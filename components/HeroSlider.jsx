'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SLIDES } from '@/lib/slides';

const INTERVAL = 6500;

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const card = useRef(null);
  const touchX = useRef(null);
  const reduce = useRef(false);
  const [failed, setFailed] = useState({});

  const go = useCallback((n) => setI((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // autoplay
  useEffect(() => {
    if (paused || reduce.current) return;
    const t = setTimeout(() => go(i + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  // animate card content on slide change
  useEffect(() => {
    if (reduce.current || !card.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-anim]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    }, card);
    return () => ctx.revert();
  }, [i]);

  const s = SLIDES[i];

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-900"
      style={{ height: 'calc(100vh - 164px)', minHeight: 620 }}
      aria-roledescription="carousel"
      aria-label="Featured PEB buildings"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        setPaused(false);
      }}
    >
      {/* Images */}
      {SLIDES.map((sl, n) => (
        <img
          key={sl.id}
          src={sl.image}
          alt={n === i ? sl.alt : ''}
          loading={n === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${n === i ? 'scale-105 opacity-100' : 'scale-100 opacity-0'}`}
          aria-hidden={n !== i}
          onError={() => setFailed((f) => ({ ...f, [sl.id]: sl.image }))}
        />
      ))}
      {failed[s.id] && (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#0b2a5b] to-[#0b6fb5] p-6 text-center text-sm text-white/70">
          Image not found: {failed[s.id]}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/10 md:bg-gradient-to-r md:from-black/50 md:via-transparent md:to-transparent" />

      {/* Content card */}
      <div className="absolute inset-x-0 bottom-0 top-0 mx-auto flex max-w-[1320px] items-end px-4 pb-24 sm:px-6 md:items-center md:pb-0">
        <div
          ref={card}
          key={s.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${SLIDES.length}`}
          className="w-full max-w-[640px] border-l-4 border-brand bg-[#0a1424]/75 p-6 text-white backdrop-blur-md sm:p-8 md:p-10"
        >
          <p data-anim className="text-xs font-semibold tracking-[0.3em] text-sky-300 sm:text-sm">{s.tag.toUpperCase()}</p>
          <h2 data-anim className="mt-3 text-[28px] font-semibold leading-[1.15] sm:text-4xl md:text-[44px]">{s.title}</h2>
          <p data-anim className="mt-4 text-[15px] leading-relaxed text-slate-200 sm:text-lg">{s.text}</p>
          <ul data-anim className="mt-5 flex flex-wrap gap-2">
            {s.points.map((p) => (
              <li key={p} className="rounded-full border border-white/25 px-3 py-1 text-xs sm:text-sm">{p}</li>
            ))}
          </ul>
          <a data-anim href={s.cta.href} className="mt-7 inline-block rounded bg-brand px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark sm:text-base">
            {s.cta.label}
          </a>
        </div>
      </div>

      {/* Controls */}
      <button onClick={() => go(i - 1)} aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-brand md:grid">
        <FaChevronLeft />
      </button>
      <button onClick={() => go(i + 1)} aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-brand md:grid">
        <FaChevronRight />
      </button>

      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 text-white">
        <span className="text-sm tabular-nums">{String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
        <div className="flex gap-2">
          {SLIDES.map((sl, n) => (
            <button key={sl.id} onClick={() => go(n)} aria-label={`Go to slide ${n + 1}`} aria-current={n === i}
              className={`h-2.5 rounded-full transition-all ${n === i ? 'w-9 bg-brand' : 'w-2.5 bg-white/60 hover:bg-white'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
