'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaDraftingCompass, FaEye, FaHardHat, FaArrowRight } from 'react-icons/fa';
import { ABOUT } from '@/lib/about';

gsap.registerPlugin(ScrollTrigger);

const cardIcons = [FaDraftingCompass, FaEye, FaHardHat];

export default function AboutSection() {
  const root = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const st = (trigger, start = 'top 82%') => ({ trigger, start, toggleActions: 'play none none none' });

      gsap.from('[data-badge]', { y: 20, opacity: 0, duration: 0.7, scrollTrigger: st('[data-badge]', 'top 90%') });
      gsap.from('[data-word]', {
        rotationX: -90, y: 40, opacity: 0, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.08,
        ease: 'back.out(1.6)', scrollTrigger: st('[data-head]', 'top 88%'),
      });
      gsap.from('[data-fade]', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, scrollTrigger: st('[data-body]', 'top 88%') });

      // 3D image entrances + subtle parallax inside the frame
      gsap.from('[data-img="left"]', { rotationY: -35, x: -80, opacity: 0, transformOrigin: '0% 50%', duration: 1.2, ease: 'power3.out', scrollTrigger: st('[data-img="left"]', 'top 88%') });
      gsap.from('[data-img="right"]', { rotationY: 35, x: 80, opacity: 0, transformOrigin: '100% 50%', duration: 1.2, ease: 'power3.out', scrollTrigger: st('[data-img="right"]', 'top 88%') });
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      // stats count-up
      root.current.querySelectorAll('[data-stat]').forEach((el) => {
        const to = Number(el.dataset.value), suf = el.dataset.suffix || '', o = { v: 0 };
        el.textContent = '0' + suf;
        gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', scrollTrigger: st(el, 'top 92%'), onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-IN') + suf; } });
      });
      gsap.from('[data-statbox]', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, scrollTrigger: st('[data-stats]', 'top 92%') });

      // Purpose / Vision / Mission pop-up
      gsap.from('[data-card]', {
        y: 140, rotationX: -50, scale: 0.8, opacity: 0, transformOrigin: '50% 100%', duration: 1.05, stagger: 0.18,
        ease: 'back.out(1.5)', scrollTrigger: st('[data-cards]', 'top 88%'),
      });
      gsap.from('[data-icon]', { scale: 0, rotation: -180, duration: 0.9, stagger: 0.18, delay: 0.35, ease: 'back.out(2)', scrollTrigger: st('[data-cards]', 'top 88%') });
    }, root);
    return () => ctx.revert();
  }, []);

  const tilt = (e) => {
    if (e.pointerType === 'touch') return;
    const c = e.currentTarget, r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(c, { rotationY: x * 14, rotationX: -y * 14, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
  };
  const untilt = (e) => gsap.to(e.currentTarget, { rotationY: 0, rotationX: 0, duration: 0.7, ease: 'elastic.out(1,.6)' });

  const words = ABOUT.heading.split(' ');

  return (
    <section ref={root} className="bg-[#f0f3f7] py-14 sm:py-20" aria-labelledby="about-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.25fr)_minmax(0,.8fr)] lg:gap-x-10 lg:gap-y-6" style={{ perspective: 1400 }}>
          {/* Tall image */}
          <div data-img="left" className="relative order-2 min-h-[340px] overflow-hidden rounded-[28px] shadow-xl shadow-slate-400/30 md:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-[560px]">
            <img data-parallax src={ABOUT.imageTall.src} alt={ABOUT.imageTall.alt} loading="lazy" className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" />
          </div>

          {/* Content */}
          <div className="order-1 md:order-none md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <span data-badge className="inline-block rounded-full border border-slate-300 px-5 py-2 text-xs font-medium uppercase tracking-wide text-brand sm:text-sm">{ABOUT.badge}</span>
            <h2 id="about-heading" data-head className="mt-5 text-[34px] font-normal leading-[1.1] text-slate-900 sm:text-5xl lg:text-[58px]" style={{ perspective: 800 }}>
              {words.map((w, i) => (<span key={i} data-word className="mr-[0.25em] inline-block">{w}</span>))}
            </h2>
            <div data-body>
              <p data-fade className="mt-6 text-[15px] leading-8 text-slate-600 sm:text-lg">
                {ABOUT.body.map((p, i) => (
                  <span key={i} className={p.b ? 'font-bold text-slate-800' : p.a ? 'text-brand' : ''}>{p.t}</span>
                ))}
              </p>
              <Link data-fade href={ABOUT.cta.href}
                className="group mt-8 inline-flex items-center gap-5 rounded-full border border-slate-800 py-2 pl-7 pr-2 text-lg text-slate-900 transition-colors hover:bg-slate-900 hover:text-white">
                {ABOUT.cta.label}
                <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-gradient-to-br from-[#2ea3f2] via-[#0b6fb5] to-[#084f82] text-white shadow-md shadow-brand/40">
                  <FaArrowRight className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                </span>
              </Link>
            </div>
          </div>

          {/* Wide image */}
          <div data-img="right" className="relative order-3 aspect-[4/3] self-start overflow-hidden rounded-[28px] shadow-xl shadow-slate-400/30 md:order-none lg:col-start-3 lg:row-start-1">
            <img data-parallax src={ABOUT.imageWide.src} alt={ABOUT.imageWide.alt} loading="lazy" className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" />
          </div>

          {/* Stats */}
          <div data-stats className="order-4 grid grid-cols-3 md:order-none md:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:self-end">
            {ABOUT.stats.map((s, i) => (
              <div key={s.label} data-statbox className={`border-t border-slate-300 px-2 pt-3 text-center sm:px-5 ${i ? 'border-l' : ''}`}>
                <div data-stat data-value={s.value} data-suffix={s.suffix} className="text-[34px] leading-none text-slate-900 sm:text-6xl lg:text-[76px]">{s.value}{s.suffix}</div>
                <p className="mt-2 text-xs text-slate-700 sm:text-lg">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose / Vision / Mission */}
        <div data-cards className="mt-16 grid gap-8 sm:mt-20 md:grid-cols-3" style={{ perspective: 1200 }}>
          {ABOUT.cards.map((c, i) => {
            const Icon = cardIcons[i];
            return (
              <article key={c.title} data-card onPointerMove={tilt} onPointerLeave={untilt}
                className="rounded-3xl border border-slate-200 bg-white px-7 pb-10 pt-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-brand/20"
                style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ transform: 'translateZ(55px)' }}>
                  <div data-icon className="relative mx-auto grid h-28 w-28 place-items-center rounded-full border-2 border-brand/50 bg-white text-5xl text-brand shadow-md">
                    <span className="absolute -left-3 -top-2 -z-10 h-14 w-14 rounded-full bg-sky-100" />
                    <Icon />
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-800" style={{ transform: 'translateZ(30px)' }}>{c.title}</h3>
                <p className="mt-3 leading-7 text-slate-600" style={{ transform: 'translateZ(15px)' }}>{c.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
