'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { CLIENTS, CLIENTS_TITLE } from '@/lib/clients';

const SPEED = 55; // auto-scroll speed in pixels per second

export default function ClientsCarousel() {
  const view = useRef(null);
  const track = useRef(null);
  const go = useRef(() => {});

  useEffect(() => {
    const el = track.current;
    const box = view.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const P = { p: 0 }; // how far the strip has moved left, in px
    let w = 1, step = 300, hover = false, drag = false, busy = false, visible = true, lastX = 0;

    const measure = () => {
      w = el.offsetWidth / 2; // width of ONE set of logos
      const card = el.querySelector('[data-logo]');
      step = card.offsetWidth + parseFloat(getComputedStyle(card).marginRight || 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(box);

    const tick = (_t, dt) => {
      if (!reduce && !hover && !drag && !busy && visible) P.p += (SPEED * Math.min(dt, 50)) / 1000;
      const m = ((P.p % w) + w) % w;
      gsap.set(el, { x: -m });
    };
    gsap.ticker.add(tick);

    // arrow clicks: slide exactly one logo forward or back, smoothly
    go.current = (dir) => {
      busy = true;
      gsap.to(P, { p: P.p + dir * step, duration: reduce ? 0.01 : 0.8, ease: 'power3.inOut', overwrite: true, onComplete: () => { busy = false; } });
    };

    // mouse hover pauses; drag / swipe moves the strip
    const enter = (e) => { if (e.pointerType === 'mouse') hover = true; };
    const leave = (e) => { if (e.pointerType === 'mouse') hover = false; };
    const down = (e) => { drag = true; busy = false; lastX = e.clientX; gsap.killTweensOf(P); box.setPointerCapture?.(e.pointerId); };
    const move = (e) => { if (!drag) return; P.p -= e.clientX - lastX; lastX = e.clientX; };
    const up = () => { drag = false; };
    box.addEventListener('pointerenter', enter);
    box.addEventListener('pointerleave', leave);
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);

    return () => {
      gsap.ticker.remove(tick);
      gsap.killTweensOf(P);
      ro.disconnect(); io.disconnect();
      box.removeEventListener('pointerenter', enter);
      box.removeEventListener('pointerleave', leave);
      box.removeEventListener('pointerdown', down);
      box.removeEventListener('pointermove', move);
      box.removeEventListener('pointerup', up);
      box.removeEventListener('pointercancel', up);
    };
  }, []);

  const btn = 'absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-900 shadow-[0_4px_16px_rgba(15,23,42,.25)] transition hover:bg-brand hover:text-white sm:h-12 sm:w-12';

  return (
    <section className="bg-white py-12 sm:py-16" aria-labelledby="clients-heading">
      <h2 id="clients-heading" className="text-center text-3xl font-bold text-slate-800 sm:text-4xl lg:text-[32px]">{CLIENTS_TITLE}</h2>

      <div className="relative mx-auto mt-8 max-w-[1400px] px-2 sm:mt-10 sm:px-6" role="region" aria-roledescription="carousel" aria-label="Our clients">
        <div ref={view} className="overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]" style={{ touchAction: 'pan-y' }}>
          <div ref={track} className="flex w-max will-change-transform">
            {[0, 1].map((set) =>
              CLIENTS.map((c) => (
                <div key={`${set}-${c.name}`} data-logo aria-hidden={set === 1}
                  className="mr-4 grid h-[104px] w-[190px] shrink-0 place-items-center overflow-hidden border border-slate-800 bg-white sm:mr-6 sm:h-[140px] sm:w-[280px] lg:w-[340px]">
                  <img src={c.logo} alt={set === 0 ? c.name : ''} draggable={false} loading="lazy" className="max-h-full max-w-full select-none object-contain p-2 sm:p-3" />
                </div>
              ))
            )}
          </div>
        </div>

        <button onClick={() => go.current(-1)} aria-label="Previous clients" className={`${btn} left-3 sm:left-8`}><FaArrowLeft /></button>
        <button onClick={() => go.current(1)} aria-label="Next clients" className={`${btn} right-3 sm:right-8`}><FaArrowRight /></button>
      </div>
    </section>
  );
}
