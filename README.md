# Imposter — Offline Party Game PWA

Pass-the-phone imposter game. Host-led flow, scratch-to-reveal cards, full villain treatment on imposter reveal. Works fully offline once installed.

## How to play

1. Host enters their name and picks the word (or uses the random pool).
2. Host scratches the briefing card to see the word + imposter's name.
3. Host hands phone to each player in turn — each scratches their own role card.
4. After everyone has seen their role, the group discusses out loud and votes IRL.

## Local dev

```bash
npm install
npm run dev
```

Open the printed URL on your phone (same WiFi).

## Deploy to Vercel

### Option A — CLI (fastest)
```bash
npm i -g vercel
vercel        # follow the prompts; accept defaults
vercel --prod # deploy to production
```

### Option B — Git
1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Vite — just hit **Deploy**.

Vercel will build, serve over HTTPS, and your PWA is live.

## Make it offline on your phone (before the trip)

1. Open the deployed URL on every phone in the group **while online**.
2. When the install prompt appears at the bottom, tap **Install**.
   - On iOS Safari there's no prompt — tap the **Share** icon → **Add to Home Screen**.
3. Launch the app from the home-screen icon once. The service worker confirms cache.
4. After that, it works fully offline. Tested on a plane.

## Customization

- **Player names**: defaults to the trip squad in `src/game/state.ts` (`DEFAULT_PLAYERS`).
- **Word packs**: edit `src/game/words.ts` — each pack is `{ category, words[] }`.
- **Theme**: candy-purple in `src/index.css`. Primary CTA color, card gradients, villain glow are all in one file.

## Tech

- Vite + React + TypeScript
- Mantine v7 (theme/layout primitives only — most UI is custom candy components)
- DiceBear `fun-emoji` (avatars generated locally — no network)
- Fredoka font (bundled via `@fontsource/fredoka`, offline-safe)
- vite-plugin-pwa (Workbox service worker, `prompt` update mode)
- Tabler icons + custom SVG icons

## Notes

- Service worker uses `prompt` update mode so the screen never reloads mid-game. The bottom snackbar offers an Update button when a new version ships.
- Manifest includes both regular and maskable icon variants so Android adaptive icons look right.
- All fonts, icons, and word data are bundled — **zero network requests after first load**.
