# Upper Technology website

Complete Next.js website for Upper Technology. The primary language is American English, with complete Portuguese (Brazil) and Spanish versions. The visual direction uses the supplied Upper Technology logo, a typographic editorial grid, deep navy, blue and restrained gold, and a browser-only workflow demonstration.

## Requirements

- Node.js 22.x or 24.x (`.nvmrc` and `engines` are included)
- npm 11 or newer
- A verified domain and the server credentials listed in `.env.example` before enabling the production contact form

## Run locally

1. Extract the ZIP and open the `upper-technology-website` folder in VS Code.
2. Install exactly from the lockfile:

   ```bash
   npm ci
   ```

3. Copy `.env.example` to `.env.local`.
4. For a visual review, you may leave all values blank. The form will intentionally report that delivery is unavailable until the real provider settings are configured.
5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000/en`. The other language roots are `/pt` and `/es`.

## Before publishing

1. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin without a trailing slash.
2. Create a Resend API key and verify the sending domain. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`.
3. Create an Upstash Redis database and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Generate a random `IP_HASH_SECRET` of at least 32 characters.
5. Create a Cloudflare Turnstile widget for the actual site hostname. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. The widget action must remain `audit`.
6. On Vercel, the server automatically uses the trusted `x-vercel-forwarded-for` header. On another host, set `TRUSTED_IP_HEADER` to a header that your own reverse proxy overwrites with the client address. Never trust a client-controlled header.
7. Optionally set `CRM_WEBHOOK_URL` and `CRM_WEBHOOK_TOKEN`. The webhook must use HTTPS. CRM delivery runs after the email is accepted and cannot change the success response shown to the visitor.
8. Optionally set `NEXT_PUBLIC_GA_ID`. Analytics remains disabled until the visitor allows it through the privacy preferences control.
9. Set `GOOGLE_SITE_VERIFICATION` only after the property is verified.
10. Review and approve all visible business information, contact channels, service descriptions and legal pages. Set `LEGAL_REVIEWED=true` and `BUSINESS_DETAILS_CONFIRMED=true` only after that review.

The site intentionally does not invent a telephone number, address, email address, client logo, testimonial, certification or performance result. Edit `src/lib/config.ts` to add confirmed details. Empty values remain hidden from visitors.

## Test and build

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run check:config
```

`check:config` is a deployment gate. It fails until production secrets, the real URL and owner/legal review flags are present. The tests cover form validation, origin checks, rate limiting, honeypot handling, Turnstile verification, email acceptance, all 39 localized routes and content parity.

For browser QA after a production build:

```bash
npm run start
npm run test:e2e
```

The browser suite checks mobile, tablet and desktop layouts, no horizontal overflow, navigation, the interactive workflow, form failure states, localized routes and WCAG 2.2 AA rules with axe-core.

## GitHub and Vercel

1. Create an empty GitHub repository.
2. From the extracted project folder:

   ```bash
   git init
   git add .
   git commit -m "Create Upper Technology website"
   git branch -M main
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

3. Import the repository into Vercel. Framework preset: Next.js. Build command: `npm run build`. Install command: `npm ci`.
4. Add the production environment variables from `.env.local` to Vercel. Keep API keys and tokens server-only; only variables beginning with `NEXT_PUBLIC_` are sent to the browser.
5. Add the final custom domain, wait for HTTPS, then update `NEXT_PUBLIC_SITE_URL` if necessary and redeploy.
6. Test `/en`, `/pt`, `/es`, every main navigation link, the language switcher, the audit form with a real test email, the privacy preference control and `sitemap.xml`.

## Editing content and design

- `src/content/en.ts`, `src/content/pt.ts` and `src/content/es.ts`: visible page copy and translations.
- `src/lib/config.ts`: confirmed brand details, links, service areas and optional pricing settings.
- `src/components/pages.tsx`: page composition and shared sections.
- `src/components/audit-form.tsx`: the client form and Turnstile widget.
- `src/app/api/audit/route.ts`: server-side delivery route.
- `src/styles/globals.css`: visual system and responsive layouts.
- `public/logo-upper-technology.jpg`: the supplied logo reference used in the header, metadata and favicon source.

The demo is intentionally local and sends no data. It is labeled as a concept wherever it appears. Do not present it as a client project or a measured case study until the relevant work and authorization exist.

## Updating the site

Edit the source, run `npm run typecheck`, `npm run lint`, `npm test` and `npm run build`, then commit and push. Vercel will create a new deployment. Recheck the form after any change to environment variables or server integrations.

## Current verification snapshot

- Next.js 16.3.6 / React 19.3.0
- 39 statically generated localized page routes
- One H1, description metadata, language metadata, structured data and valid internal links checked for every generated route
- 18 server/content tests passing in the authoring environment
- Production build passing
- The browser preview was inspected at desktop width and the Portuguese route. In this authoring environment, `npm run test:e2e` was prepared but could not launch because the Playwright Chromium binary was unavailable and its download was blocked by the execution usage limit. Run the command after extraction; it will install/use the browser available in your local Playwright setup.
