# User Story Improver

A simple React + Vite app where users can view a bad user story, rewrite it, receive a score out of 100, see a reasonable reference user story, and download a certificate with their score.

## Features
- View a deliberately bad user story
- Rewrite it and get an automated score (based on INVEST + structure heuristics)
- See a reasonable reference user story
- Download a certificate (PDF) with your score and name
- Deployable to GitHub Pages or any static host

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Then open the printed local URL (usually `http://localhost:5173`).

### Build for Production
```bash
npm run build
npm run preview
```

## Scoring Heuristics (Summary)
The app uses simple checks to approximate quality:
- Structure: Contains "As a", "I want", "so that"
- Acceptance criteria using Given/When/Then lines
- Clear, concise length (not too short/long)
- Avoids ambiguous words (e.g., "quickly", "easy", "etc.")
- INVEST signals (Independent, Negotiable, Valuable, Estimable, Small, Testable)

Note: This is a lightweight heuristic, not a perfect evaluator.

## Deployment

### GitHub Pages (recommended)
1. Commit and push this repository to GitHub.
2. In `vite.config.ts`, set the base path for your repo:
   - Option A (environment variable): set `BASE` env var in your CI to `/<REPO_NAME>/`.
   - Option B (edit file): change `const base = process.env.BASE || '/<REPO_NAME>/'`.
3. Push with the included workflow. It will build and publish to the `gh-pages` branch.
4. In GitHub repo settings, enable GitHub Pages to serve from `gh-pages`.
5. Use the generated URL `https://<USER>.github.io/<REPO_NAME>/` and share it.

### Any Static Host
- Upload the `dist/` folder produced by `npm run build` to Netlify, Vercel, Cloudflare Pages, or similar.

## License
MIT 