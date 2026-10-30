'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPebScene } from '@/lib/pebScene';
import { STAGES } from '@/lib/stages';

gsap.registerPlugin(ScrollTrigger);

const NAV_H = 112; // height of the sticky nav bar (h-28 = 7rem)

export default function ScrollBuild() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const barRef = useRef(null);
  const [stage, setStage] = useState(0);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const state = { p: 0 };
    const dispose = createPebScene(canvasRef.current, () => state.p, {
      onStage: setStage,
      onProgress: (p) => { if (barRef.current) barRef.current.style.transform = `scaleY(${p})`; },
    });
    if (!dispose) { setSupported(false); return; }

    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: 1,
        ease: 'none',
        scrollTrigger: { trigger: wrapRef.current, start: `top top+=${NAV_H}`, end: 'bottom bottom', scrub: 0.6 },
      });
    }, wrapRef);

    return () => { ctx.revert(); dispose(); };
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[1000vh]" aria-label="PEB construction from blueprint to finish">
      <div className="sticky overflow-hidden bg-[#0b2a5b]" style={{ top: NAV_H, height: `calc(100vh - ${NAV_H}px)` }}>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {!supported && <p className="absolute inset-0 grid place-items-center p-8 text-center text-white">WebGL is not available in this browser.</p>}

        <div ref={barRef} className="absolute right-0 top-0 h-full w-1 origin-top scale-y-0 bg-brand" />
        <p className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-slate-300 transition-opacity ${stage === 0 ? 'opacity-100' : 'opacity-0'}`}>Scroll to build</p>

        {STAGES.map((s, i) => (
          <div key={s.label}
               className={`absolute bottom-6 left-5 max-w-[min(460px,calc(100%-40px))] border-l-4 border-brand bg-[#060e1e]/80 px-6 py-5 backdrop-blur transition-all duration-500 ${stage === i ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
            <small className="mb-2 block text-sm text-slate-300">{s.label} ({s.view})</small>
            <h2 className="text-[clamp(30px,5vw,50px)] font-bold leading-none text-white">{s.title}</h2>
            {s.sub && <p className="mt-2 text-xl text-orange-200">{s.sub}</p>}
            {s.cta && <a href="/contact" className="pointer-events-auto mt-4 inline-block rounded bg-brand px-7 py-3 font-semibold text-white hover:bg-brand-dark">{s.cta}</a>}
          </div>
        ))}
      </div>
    </section>
  );
}
