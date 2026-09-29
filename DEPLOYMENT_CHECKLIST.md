# Production checklist

## Owner review

- [ ] Confirm the legal contracting entity and business name.
- [ ] Confirm the final email, phone, WhatsApp, scheduling URL and social links.
- [ ] Approve English, Portuguese and Spanish page copy.
- [ ] Review the Privacy Policy and Terms with the appropriate legal adviser.
- [ ] Confirm that the supplied logo can be used on the website and in metadata.
- [ ] Approve the service descriptions, industry maturity labels and the “concept demonstration” wording.
- [ ] Decide whether planning prices should remain private or be published after recalibration.

## Technical setup

- [ ] Configure all required `.env.local` / Vercel variables.
- [ ] Verify the Resend sending domain and send a real test email.
- [ ] Test Upstash rate limiting with a safe test request.
- [ ] Create Turnstile keys for the exact production hostname.
- [ ] Configure the trusted IP header for the selected host.
- [ ] Configure the optional CRM webhook only if its receiving system is ready.
- [ ] Configure analytics only after the privacy approach is approved.
- [ ] Set `LEGAL_REVIEWED=true` and `BUSINESS_DETAILS_CONFIRMED=true` only after approval.

## Release test

- [ ] `npm ci`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run test:e2e`
- [ ] Test the audit form with a real test email and verify the inbox.
- [ ] Test invalid input, consent, honeypot, Turnstile and provider-failure behavior.
- [ ] Check the three language roots and all language links.
- [ ] Check `robots.txt`, `sitemap.xml`, canonical and `hreflang` after the domain is configured.
- [ ] Check phone, tablet and desktop layouts.
- [ ] Check keyboard navigation, focus states and reduced-motion behavior.
- [ ] Submit the final deployment for owner approval before public promotion.
