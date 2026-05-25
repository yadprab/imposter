# Imposter — Offline PWA

A pass-the-phone party game built as an installable PWA. Works fully offline once loaded.

## How to play

1. Add 3–12 player names, pick the number of imposters and discussion time.
2. Pass-the-phone reveal: each player taps their handoff card, then **presses and holds** to see their word. Releasing hides it instantly.
3. Imposters see only the category. Everyone else sees the category + secret word.
4. Discussion timer counts down — players take turns giving a clue without saying the word.
5. Vote (pass-the-phone, secret per player). Majority gets ejected.
6. Results reveal the imposter(s) and the word.

## Dev

```bash
npm install
npm run dev
```

Open the printed URL on your phone (same WiFi). For full PWA testing, run `npm run build && npm run preview`.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the repo to vercel.com — Vercel auto-detects Vite. Once deployed, visit the URL on each phone and "Add to Home Screen" — the service worker caches everything for offline use.

## Offline checklist

- Visit the deployed site once on each phone with internet (e.g. at home before the trip).
- Tap "Add to Home Screen" so it launches like a native app.
- Open it once more — the PWA confirms cache. After that it works with WiFi off.

## Stack

- Vite + React + TypeScript
- Mantine v7 (component library, dark theme by default)
- vite-plugin-pwa (Workbox service worker, autoUpdate)
- Tabler icons
# imposter
