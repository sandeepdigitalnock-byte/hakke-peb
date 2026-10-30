// Client logos. Put your real logo files in /public/images/clients/ (PNG/SVG/WebP, transparent or white background)
// and update the `logo` paths. Use at least 6 logos so the loop looks seamless.
const c = (n, name) => ({ name, logo: `/images/clients/client-${n}.webp` });

export const CLIENTS_TITLE = 'Our Clients';
export const CLIENTS = [
  c(1, 'Tata Advanced Systems'),
  c(2, 'JSW'),
  c(3, 'Indian Oil'),
  c(4, 'Larsen & Toubro'),
  c(5, 'South Central Railway'),
];
