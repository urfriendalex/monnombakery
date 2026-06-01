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

The client can manage content from the embedded Studio at `/studio`.

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-21
SANITY_API_WRITE_TOKEN=
```

`SANITY_API_WRITE_TOKEN` is only needed locally for the initial seed command. Do not expose it in frontend code or add it to Vercel unless a server-side write workflow is added later.

Authenticate and create or select the client project:

```bash
npx sanity login --provider google
npx sanity projects list
```

After adding the project ID and a temporary Editor token to `.env.local`, seed the initial menu:

```bash
npm run sanity:seed
```

Run the website and Studio:

```bash
npm run dev
open http://localhost:3000/studio
```

Schema files live in `sanity/schemas`. Price fields are strings so menu values like `16/19` or `21/25` remain valid.
