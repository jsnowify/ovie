# Ovie

Ovie is a website for an architecture studio based in the Philippines.

## About

The site showcases the studio's work, case studies, and services.

## Disclaimer

This is a personal upskilling project. It is based on a project from Snowi's Roulette challenge: [Roulette ni Snowi](https://snowi-cambronero.vercel.app/projects/roulette-ni-snowi/).

All images and content are mockups. They are not real projects or clients.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [GSAP](https://gsap.com/) for animation
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- [Sora](https://fonts.google.com/specimen/Sora) via `next/font`

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Static assets live in `public/`:

- `public/ovie.svg` - logo and favicon
- `public/videos/compiled.mp4` - hero background video

## Project structure

```
src/
├── app/                # routes, root layout, global styles and design tokens
├── components/
│   ├── layout/         # Header and other page-wide pieces
│   ├── sections/       # one folder per page section (home, about, contact)
│   └── ui/             # small reusable pieces (Button, Logo, MenuButton)
├── config/             # site name and copy (site.ts)
├── hooks/              # custom React hooks
├── lib/                # GSAP setup (always import from "@/lib/gsap")
└── providers/          # context and setup (Lenis smooth scroll)
```

## Design tokens

Defined in `src/app/globals.css`.

| Token      | Value     |
| ---------- | --------- |
| `cream`    | `#FFF9E8` |
| `ink`      | `#28251D` |
| `clay`     | `#9B4915` |
| `--gutter` | `10px`    |
