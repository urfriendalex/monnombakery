# Mon Nom Bakery Menu

Mobile-first Next.js microsite for a typography-led restaurant menu. The app renders Sanity-shaped mock content by default and switches to Sanity CMS when `NEXT_PUBLIC_SANITY_PROJECT_ID` is configured.

In production the homepage is rendered dynamically on each request, reads only published Sanity documents, and uses Sanity's CDN for content and image delivery. That means an administrator can edit content in Sanity Studio, click Publish, and the live site can pick up the change without a website rebuild.

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

### Content model

The Studio is organized around:

- `Restaurant Settings`: singleton document for brand, address, contact links, opening hours, footer copy, and SEO text.
- `Menu Groups`: top-level menu groupings, currently `Menu`.
- `Menu Categories`: sections such as `Śniadania`, `Owsianki`, `Sandwicze`, `Kawa`, and `Matcha`.
- `Menu Items`: editable title, slug, category, description, primary/secondary prices, main image, gallery images, alt text, dietary labels, badge label, serving note, tags, allergens, visibility, availability, featured state, and display order.

The seed script uploads local files from `public/menu/photos` into Sanity image assets and attaches them to the matching menu items using `public/menu/photos/manifest.json`.

### Deployment guide

1. Create a Sanity project:

```bash
npx sanity login
npx sanity init --env
```

Use dataset `production` unless you intentionally want another dataset name.

2. Add local environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-21
SANITY_API_WRITE_TOKEN=temporary_write_token
```

Create `SANITY_API_WRITE_TOKEN` in Sanity Manage with write permissions. It is only for local seeding.

3. Seed the current menu and photos:

```bash
npm run sanity:seed
```

4. Verify locally:

```bash
npm run dev
```

Open `http://localhost:3000` for the site and `http://localhost:3000/studio` for the embedded Studio.

5. Add CORS origins in Sanity Manage:

- `http://localhost:3000` for local Studio testing.
- Your production domain, `https://www.monnombakery.com`.
- Your Vercel preview domain pattern if you want preview deployments to use Studio.

6. Deploy the website to Vercel or another Next.js host. Set these production environment variables:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-21
NEXT_PUBLIC_SITE_URL=https://www.monnombakery.com
```

Do not add `SANITY_API_WRITE_TOKEN` to production unless you later build server-side write workflows.

7. Deploy Studio access:

- Embedded Studio: available at `/studio` on the deployed website.
- Optional hosted Studio: run `npm run studio:deploy`, then use the Sanity-hosted Studio URL.

8. Administrator workflow:

- Open `/studio`.
- Edit a `Menu Item`, `Menu Category`, `Menu Group`, or `Restaurant Settings`.
- Click Publish.
- Refresh the production site. No rebuild is required.

### Production notes

- The site uses `useCdn: true` and published perspective, so draft content is not shown publicly.
- The homepage exports `dynamic = "force-dynamic"` and `revalidate = 0`, so page data is requested at runtime instead of being frozen at build time.
- Sanity CDN updates can take a short propagation window after publish. This is normal and still avoids a site rebuild.
- A route-level preloader or skeleton can be added later if the menu grows enough to make runtime loading visually noticeable.
