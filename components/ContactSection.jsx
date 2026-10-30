'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaMobileAlt, FaEnvelope, FaMapMarkerAlt, FaUser, FaPenNib, FaPaperPlane, FaDirections, FaExternalLinkAlt } from 'react-icons/fa';
import { SITE } from '@/lib/site';

gsap.registerPlugin(ScrollTrigger);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(d) {
  const e = {};
  if (!d.name.trim()) e.name = 'Please enter your name';
  if (!d.subject.trim()) e.subject = 'Please enter a subject';
  if (!EMAIL_RE.test(d.email.trim())) e.email = 'Please enter a valid email';
  if (d.phone.replace(/\D/g, '').length < 8) e.phone = 'Please enter a valid phone number';
  if (d.message.trim().length < 5) e.message = 'Please tell us how we can help';
  return e;
}

function Field({ icon: Icon, name, label, type = 'text', error, autoComplete }) {
  return (
    <div data-f>
      <div className={`flex items-center gap-3 border-b pb-3 transition-colors focus-within:border-sky-300 ${error ? 'border-red-300' : 'border-white/30'}`}>
        <Icon className="shrink-0 text-lg text-white/80" aria-hidden="true" />
        <input name={name} type={type} placeholder={`${label} *`} aria-label={label} aria-invalid={!!error} autoComplete={autoComplete}
          className="w-full bg-transparent text-[17px] text-white placeholder-white/80 outline-none" />
      </div>
      {error && <p role="alert" className="mt-1 text-sm text-red-300">{error}</p>}
    </div>
  );
}

export default function ContactSection() {
  const root = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', msg: '' });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top 75%' };
      gsap.from('[data-c]', { x: -60, rotationY: -20, opacity: 0, transformPerspective: 900, transformOrigin: '0% 50%', duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: st });
      gsap.from('[data-f]', { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, delay: 0.3, ease: 'power3.out', clearProps: 'all', scrollTrigger: st });
      gsap.from('[data-map]', { clipPath: 'inset(0 0 0 100%)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  async function onSubmit(ev) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus({ type: 'sending', msg: '' });
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      form.reset();
      setStatus({ type: 'ok', msg: 'Thank you! Your enquiry has been sent. We will contact you shortly.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;
  const openHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`;
  const dirHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`;

  return (
    <section ref={root} id="contact" className="grid w-full bg-[#0e2038] text-white lg:min-h-[800px] lg:grid-cols-2" aria-labelledby="contact-heading">
      {/* Form side */}
      <div className="px-5 py-14 sm:px-10 sm:py-20 lg:py-24 lg:pl-16 lg:pr-12 xl:pl-[max(4rem,calc((100vw-1320px)/2+1.5rem))]" style={{ perspective: 1000 }}>
        <div className="max-w-[640px]">
          <p data-c className="mb-3 text-sm font-medium tracking-[0.35em] text-amber-300 sm:text-base">CONTACT US</p>
          <h2 id="contact-heading" data-c className="text-4xl font-semibold sm:text-5xl lg:text-[56px]">Start Your Project</h2>
          <ul className="mt-8 space-y-5 text-xl sm:text-2xl">
            <li data-c><a href={`tel:${SITE.phone}`} className="flex items-center gap-4 hover:text-sky-300"><FaMobileAlt className="text-xl text-white/80" />{SITE.phone}</a></li>
            <li data-c><a href={`mailto:${SITE.email}`} className="flex items-center gap-4 break-all hover:text-sky-300"><FaEnvelope className="shrink-0 text-xl text-white/80" />{SITE.email}</a></li>
            <li data-c className="flex items-start gap-4 text-base leading-7 text-white/90 sm:text-lg"><FaMapMarkerAlt className="mt-1.5 shrink-0 text-xl text-white/80" /><span>{SITE.address.join(' ')}</span></li>
          </ul>

          <form onSubmit={onSubmit} noValidate className="mt-10 sm:mt-12">
            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field icon={FaPenNib} name="name" label="Name" error={errors.name} autoComplete="name" />
              <Field icon={FaPenNib} name="subject" label="Subject" error={errors.subject} />
              <Field icon={FaEnvelope} name="email" label="Email" type="email" error={errors.email} autoComplete="email" />
              <Field icon={FaMobileAlt} name="phone" label="Phone" type="tel" error={errors.phone} autoComplete="tel" />
            </div>
            <div data-f className="mt-7">
              <div className={`border-b pb-3 transition-colors focus-within:border-sky-300 ${errors.message ? 'border-red-300' : 'border-white/30'}`}>
                <textarea name="message" rows={4} placeholder="How can we help *" aria-label="How can we help" aria-invalid={!!errors.message}
                  className="w-full resize-none bg-transparent text-[17px] text-white placeholder-white/80 outline-none" />
              </div>
              {errors.message && <p role="alert" className="mt-1 text-sm text-red-300">{errors.message}</p>}
            </div>
            {/* honeypot: real visitors never see this */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <button type="submit" disabled={status.type === 'sending'}
              className="mt-8 flex min-h-[56px] w-full items-center justify-center gap-3 rounded bg-[#0b6fb5] bg-gradient-to-r from-[#0b6fb5] to-[#2ea3f2] px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-black/30 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60">
              <span>{status.type === 'sending' ? 'Sending…' : 'Send'}</span>
              <FaPaperPlane aria-hidden="true" />
            </button>

            <div aria-live="polite" className="min-h-[1.5rem]">
              {status.type === 'ok' && <p className="mt-4 rounded bg-emerald-500/15 px-4 py-3 text-emerald-200">{status.msg}</p>}
              {status.type === 'error' && <p className="mt-4 rounded bg-red-500/15 px-4 py-3 text-red-200">{status.msg}</p>}
            </div>
            <p data-f className="mt-4 text-center text-xs leading-5 text-white/70">
              By completing this form, you consent to being contacted. You can review our <a href="/privacy-policy" className="font-semibold text-white underline">Privacy Policy</a> to understand how we store information.
            </p>
          </form>
        </div>
      </div>

      {/* Map side */}
      <div data-map className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-full">
        <iframe title="Hakke PEB location on Google Maps" src={mapSrc} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-24px)] items-start gap-3 rounded-lg bg-white p-3 text-slate-800 shadow-lg sm:left-5 sm:top-5 sm:max-w-[320px]">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 sm:text-base">Hakke PEB</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{SITE.address.join(' ')}</p>
          </div>
          <a href={openHref} target="_blank" rel="noreferrer" aria-label="Open in Google Maps" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-brand transition hover:bg-brand hover:text-white"><FaExternalLinkAlt className="text-sm" /></a>
          <a href={dirHref} target="_blank" rel="noreferrer" aria-label="Get directions" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-brand transition hover:bg-brand hover:text-white"><FaDirections /></a>
        </div>
      </div>
    </section>
  );
}
