// Industries data. Each item links to /industries/<slug> (inner page already set up).
// Replace image files in /public/images/industries/ with your real photos (about 800x600, JPG/WebP)
// and update the `image` paths below.
export const INDUSTRIES_INTRO = {
  title: 'Industries We Serve',
  text: 'We serve a diverse range of industries with innovative, reliable and tailored PEB solutions designed to meet unique project needs, from manufacturing and warehousing to cold storage, education and infrastructure.',
};

const make = (slug, name, description) => ({ slug, name, description, image: `/images/industries/${slug}.jpg` });

export const INDUSTRIES = [
  make('automotive-industry', 'Automotive Industry', 'Showrooms, service centres and manufacturing facilities built with fast-track PEB construction and clear-span interiors.'),
  make('cold-storage', 'Cold Storage', 'Insulated, energy-efficient structures for cold chains, with the strength and clear height that racking and material handling need.'),
  make('dry-warehouses', 'Dry Warehouses', 'Wide-span warehouses and logistics hubs designed for maximum storage space, easy truck movement and quick erection.'),
   make('food-processing-industry', 'Food Processing Industry', 'Hygienic, well-ventilated plants planned around your process flow, utilities and clean-area requirements.'),
  make('general-engineering', 'General Engineering', 'Heavy-duty workshops and fabrication units with crane-ready frames for machinery, large components and overhead handling.'),
   make('pharmaceutical-industry', 'Pharmaceutical Industry', 'Precision-built facilities that support controlled environments, cleanroom layouts and strict quality standards.'),
];

export const getIndustry = (slug) => INDUSTRIES.find((i) => i.slug === slug);
