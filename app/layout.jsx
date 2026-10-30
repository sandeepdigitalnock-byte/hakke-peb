import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });

export const metadata = {
  title: 'Hakke PEB | Pre-Engineered Building Manufacturer & Supplier in India',
  description:
    'HAKKE PEB specializes in manufacturing Pre-Engineered Building (PEB) solutions for Industrial, Commercial & Infrastructure applications.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
