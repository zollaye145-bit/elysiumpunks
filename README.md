# Elysium Punks — Whitelist

Whitelist site for Elysium Punks (10,000 pixel punks on Elysium).
Visitors follow @elysium_punks, like & repost the launch post, then paste their EVM wallet.

## Files
- `index.html` — the whole site (static, no build step). Deploy on Vercel as-is.
- `apps-script.gs` — Google Apps Script that saves wallets into a Google Sheet.

## Setup
1. Create a Google Sheet. Row 1: `timestamp | wallet | twitter | follow | like | retweet`
2. Extensions → Apps Script → paste `apps-script.gs` → Save.
3. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone). Copy the `/exec` URL.
4. In `index.html`, set `CONFIG.SUBMIT_URL` to that URL and commit.
5. Vercel → New Project → import this repo → Framework: Other → Deploy.

Without `SUBMIT_URL` the site runs in demo mode (nothing is saved).
