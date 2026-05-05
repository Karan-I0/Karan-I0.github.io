# Karan Sharma — Portfolio

Personal portfolio for **Karan Sharma**, Senior Mobile Engineer. 8+ years building Android, iOS, and React Native apps. Currently leading mobile engineering at Fintex Inc.

Live: **https://karan-i0.github.io**

## Tech

- Vite + React 18
- Three.js (3D phone hero with live-canvas project mockups)
- Inter typography, Apple-inspired monochrome aesthetic
- Google Analytics 4

## Local development

```bash
npm install
npm run dev   # → http://localhost:5173
npm run build # production build to dist/
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes to GitHub Pages. Configure once: **Settings → Pages → Source: GitHub Actions**.

## Updating content

All resume content lives in [`src/data.js`](src/data.js) — name, tagline, experience, skills, projects, stats, clients, and socials. Edit there, push, and the site redeploys automatically.

To swap a stylized phone-screen mockup for a real screenshot, drop a PNG in `public/screens/` and reference its path in `SCREENSHOT_FRAMES` inside [`src/components/MockupPhone.jsx`](src/components/MockupPhone.jsx).
