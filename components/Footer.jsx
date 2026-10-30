import Link from 'next/link';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaCaretRight, FaEnvelope, FaMapMarkerAlt, FaMobileAlt } from 'react-icons/fa';
import { SITE } from '@/lib/site';

const socials = [
  { icon: FaFacebookF, href: SITE.social.facebook, label: 'Facebook' },
  { icon: FaLinkedinIn, href: SITE.social.linkedin, label: 'LinkedIn' },
  { icon: FaInstagram, href: SITE.social.instagram, label: 'Instagram' },
  { icon: FaYoutube, href: SITE.social.youtube, label: 'YouTube' },
];

function IconBadge({ children }) {
  return (
    <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-brand text-xl text-white shadow-[0_0_18px_rgba(11,111,181,.7)]">
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0b0f14] bg-[url('/images/footer-bg.webp')] bg-cover bg-center text-white">
      <div className="bg-black/0">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-6 pb-10 pt-16 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* About */}
          <div>
            <div className="inline-block rounded bg-white p-3">
              <img src={SITE.logo} alt="Hakke India" className="h-20 w-auto" />
            </div>
            <p className="mt-6 text-justify text-[17px] leading-[35px]">{SITE.about}</p>
            <div className="mt-8 flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="grid h-14 w-14 place-items-center rounded-full border border-white/25 text-lg transition hover:bg-brand">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[30px] font-semibold">Quick Links</h3>
            <ul className="mt-8 space-y-[22px]">
              {SITE.nav.map((n) => (
                <li key={n.label}>
                  <Link href={n.href} className="flex items-center gap-3 text-[15px] font-medium hover:text-brand">
                    <FaCaretRight className="text-sm" /> {n.label === 'Career' ? 'Careers' : n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QR */}
          <div>
            <h3 className="text-[30px] font-semibold">QR Code</h3>
            <img src={SITE.qr} alt="QR code" className="mt-8 h-[218px] w-[218px] bg-white p-1" />
          </div>

          {/* Address */}
          <div>
            <h3 className="text-[30px] font-semibold">Office Address</h3>
            <ul className="mt-8 space-y-8">
              <li className="flex items-center gap-5">
                <IconBadge><FaEnvelope /></IconBadge>
                <address className="not-italic text-[19px] leading-8">
                  {SITE.address.map((l) => (<span key={l} className="text-[15px] font-semibold">{l}</span>))}
                </address>
              </li>
              <li className="flex items-center gap-5">
                <IconBadge><FaMapMarkerAlt /></IconBadge>
                <a href={`tel:${SITE.phone}`} className="text-[15px] font-semibold">{SITE.phone}</a>
              </li>
              <li className="flex items-center gap-5">
                <IconBadge><FaMobileAlt /></IconBadge>
                <a href={`mailto:${SITE.email}`} className="break-all text-[15px] font-semibold">{SITE.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-6 pb-8 pt-10 text-[18px] sm:flex-row sm:items-end sm:justify-between">
          <p>© Copyrights 2026. All Rights Reserved by : <span className="font-semibold text-brand">Hakke PEB</span></p>
          <p>Design &amp; Developed By : <a href="https://digitalnockindia.in" className="font-semibold text-brand">DigitalNock India Pvt. Ltd.</a></p>
        </div>
      </div>
    </footer>
  );
}
