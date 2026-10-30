# Hakke PEB (Next.js + React + Tailwind + GSAP + three.js)

## Run
```bash
npm install
npm run dev      # http://localhost:3000
```
Node 18.18+ required.

## Structure
```
app/layout.jsx, page.jsx, globals.css   Root layout (Montserrat), home page, Tailwind
components/Header.jsx                    Top bar + sticky nav (mobile menu included)
components/ScrollBuild.jsx               GSAP ScrollTrigger + canvas + stage cards
components/MapSection.jsx                Google map embed
components/Footer.jsx                    Footer (about, quick links, QR, address)
components/FloatingButtons.jsx           WhatsApp + back to top
lib/pebScene.js                          three.js scene and camera keyframes
lib/stages.js                            Text for the 10 scroll stages
lib/site.js                              Phone, email, address, nav links, logo paths
public/images/                           Replace hakke-logo.svg, qr-code.svg, add footer-bg.jpg
```

## Notes
- `three` is pinned to 0.128.0 because the scene's colour and lighting setup is tuned for it.
- Scroll length is `h-[1000vh]` in ScrollBuild.jsx. Shorten it for a faster build.
- To change timing or camera angles, edit `update()` and the `K` keyframe array in lib/pebScene.js.
- Put your brochure at `public/brochure.pdf`.
