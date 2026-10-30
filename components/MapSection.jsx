import { SITE } from '@/lib/site';

export default function MapSection() {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;
  return (
    <section aria-label="Our location">
      <iframe title="Hakke PEB location" src={src} className="h-[300px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </section>
  );
}
