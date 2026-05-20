# Mon Nom Bakery Menu

Mobile-first Next.js microsite for a typography-led restaurant menu. The app renders Sanity-shaped mock content by default and switches to Sanity CMS when `NEXT_PUBLIC_SANITY_PROJECT_ID` is configured.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run studio
```

## Sanity

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-21
```

Schema files live in `sanity/schemas`. Price fields are strings so menu values like `16/19` or `21/25` remain valid.
