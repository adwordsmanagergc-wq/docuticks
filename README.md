# DocuTicks

Turn scanned PDFs into interactive tick-and-sign forms. The completed PDF lands
in your inbox, auto-named with the signer's name and date.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Auth.js v5 (Credentials + Google), JWT sessions
- Prisma + Postgres for users / sessions
- PDF.js for rendering, pdf-lib for filling completed PDFs
- Forms and submissions are persisted client-side (localStorage) for now
- Hosted on Vercel

## First-time setup on Vercel

1. **Import the repo** in Vercel ("Add New → Project").
2. **Add Postgres**: project → Storage → Create → Postgres (or Neon via the
   Marketplace). This injects `POSTGRES_PRISMA_URL` and
   `POSTGRES_URL_NON_POOLING` into all environments.
3. **Add `AUTH_SECRET`**: Project Settings → Environment Variables. Generate one
   with `openssl rand -base64 32`.
4. *(Optional)* **Google sign-in**: add `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`.
   The authorized redirect URI is `https://YOUR_DOMAIN/api/auth/callback/google`.
5. **Redeploy**. The build runs `prisma db push` against your database, so the
   `User` / `Session` / `Account` tables are created automatically.

The marketing site builds even if Postgres isn't provisioned yet — login
just won't work until you add it.

## Local development

```bash
cp .env.example .env.local
# fill in AUTH_SECRET and POSTGRES_PRISMA_URL / POSTGRES_URL_NON_POOLING
npm install
npx prisma db push
npm run dev
```

## End-to-end flow

1. `/signup` — create an account (email + password).
2. `/dashboard` — gated, redirects to `/login` when logged out.
3. `/forms/new` — drop a scanned PDF.
4. `/forms/[id]` — drag fields onto the page, mark required, publish.
5. `/forms/[id]/share` — copy the public link.
6. `/f/[id]` — public signer view; the signer fills the form, signs, submits.
7. `/submissions` — completed PDF appears, auto-named
   `{FormName}_{SignerName}_{YYYY-MM-DD}.pdf`.

## Routes

- `/` `/features` `/how-it-works` `/pricing` `/use-cases` `/security` `/faq`
  `/contact` `/blog` `/blog/[slug]` `/privacy` `/terms` — marketing
- `/login` `/signup` `/forgot-password` — auth (redirect to /dashboard when
  logged in)
- `/dashboard` `/forms` `/forms/new` `/forms/[id]` `/forms/[id]/share`
  `/submissions` `/account` `/billing` `/team` — app (gated by middleware)
- `/f/[id]` — public signer view
- `/api/auth/*` — Auth.js endpoints

## Roadmap

- Move forms + submissions from localStorage to Postgres so a logged-in user
  sees the same forms across devices.
- Vercel Blob for PDF binary storage.
- Postmark/Resend for the inbox-delivery email pipeline.
- Stripe AUD subscriptions.
