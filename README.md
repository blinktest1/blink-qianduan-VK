# Blink MBTI — Telegram Mini App (Vue 3 + Vite)

Refactored from the original single-file HTML using the [vite-vue-tg-miniapp-template](https://github.com/Siykt/vite-vue-tg-miniapp-template) architecture.

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite 5** — dev server & build
- **Pinia** — global state management
- **Telegram WebApp SDK** — via `useTelegram` composable

---

## Project Structure

```
src/
├── assets/
│   └── global.css          # Design tokens, reset, shared component styles
├── composables/
│   └── useTelegram.js      # Thin wrapper around Telegram.WebApp SDK
├── stores/
│   └── useAppStore.js      # Pinia store: navigation, API calls, all app state
├── views/                  # One file per screen
│   ├── LandingScreen.vue   # S1 — entry / orb animation
│   ├── InfoScreen.vue      # S2 — gender / zodiac / relationship history
│   ├── EmotionScreen.vue   # S3 — current emotional state
│   ├── QuizScreen.vue      # S4 — 10-question orb matrix
│   ├── LoadingScreen.vue   # S5 — AI analysis progress
│   ├── ResultScreen.vue    # S6 — MBTI result + BLINK code
│   ├── DetailScreen.vue    # S7 — full profile + radar + soul match
│   ├── DualScreen.vue      # S8 — compatibility code input + history
│   ├── ReportScreen.vue    # S9 — compatibility report
│   └── PaywallScreen.vue   # S10 — retest paywall
├── components/
│   └── CompatModal.vue     # Bottom sheet: confirm → loading → done/retry
├── App.vue                 # Root: screen router + stars + bottom nav
└── main.js                 # Vue + Pinia init
```

---

## Setup

```bash
npm install
npm run dev
```

### Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy to any static host (Vercel, Netlify, Cloudflare Pages, etc.) or serve behind your bot's web_app URL.

---

## API Configuration

Update `API_BASE` and `BOT_URL` in `src/stores/useAppStore.js`:

```js
export const API_BASE = 'https://api.blink-mbti.com'
export const BOT_URL  = 'https://t.me/blink_aimatch_bot'
```

---

## Key Design Decisions

### Navigation
`useAppStore.go(screenId)` replaces the raw `go()` function. The Telegram `BackButton` is wired to `store.goBack()`.

### API Layer
All `fetch` calls live in `useAppStore`. Views only call store actions — no raw `fetch` in components.

### State
A single Pinia store holds all app state (user profile, quiz answers, compat data). This makes it easy to persist or hydrate from Telegram `initDataUnsafe`.

### Telegram SDK
`useTelegram()` composable exposes `haptic`, `showBackButton`, `openInvoice`, `shareUrl` — keeping SDK calls out of business logic.
