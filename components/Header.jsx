'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaFacebookF, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SITE } from '@/lib/site';

function TopBar() {
  return (
    <div className="bg-[#e4e4e4] text-slate-900">
      <div className="mx-auto flex h-[52px] max-w-[1320px] items-center justify-between px-6">
        <div className="flex items-center gap-8 text-[17px] font-medium">
          <a href={`tel:${SITE.phone}`} className="hover:text-brand1">{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} className="hidden hover:text-brand1 sm:block">{SITE.email}</a>
        </div>
        <div className="flex items-center gap-6 text-[26px]">
          <a href={SITE.social.facebook} aria-label="Facebook" className="hover:text-brand1"><FaFacebookF /></a>
          <a href={SITE.social.twitter} aria-label="Twitter" className="hover:text-brand1"><FaTwitter /></a>
          <a href={SITE.social.linkedin} aria-label="LinkedIn" className="hover:text-brand1"><FaLinkedin /></a>
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-28 max-w-[1320px] items-center justify-between px-6">
        <Link href="/" className="shrink-0">
          <img src={SITE.logo} alt="Hakke India, transforming the world" className="h-14 w-auto xl:h-20" />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-9">
          {SITE.nav.map((n) => (
            <Link key={n.label} href={n.href} className="text-[15px] font-medium text-slate-900 transition-colors xl:text-[16px] hover:text-brand">
              {n.label}
            </Link>
          ))}
          <a href={SITE.brochure} className="rounded bg-brand px-6 py-3 text-[15px] font-semibold xl:px-9 xl:py-4 xl:text-[18px] text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark">
            Brochure
          </a>
        </nav>

        <button className="text-3xl lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden">
          {SITE.nav.map((n) => (
            <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium">
              {n.label}
            </Link>
          ))}
          <a href={SITE.brochure} className="mt-2 inline-block rounded bg-brand px-8 py-3 font-semibold text-white">Brochure</a>
        </nav>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <>
      <TopBar />
      <NavBar />
    </>
  );
}
