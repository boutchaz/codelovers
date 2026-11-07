# Newsletter signup

`NewsletterForm.astro` is included in the shared bilingual footer. `PUBLIC_NEWSLETTER_ENABLED=true` exposes it at build time; keep false until the Brevo account is ready. `NEWSLETTER_ENABLED=true` independently enables the server endpoint. All Brevo credentials remain in the internal inquiry service, never in static assets.

The existing Bun service routes `/api/newsletter` to Brevo's fixed DOI endpoint. English and French use separate dedicated list/template IDs. Confirmation is required before a contact becomes a newsletter recipient. No ERP contacts are copied and no campaign is sent by signup. Brevo owns delivery, bounces and unsubscribe suppression.

Set `BREVO_API_KEY`, `BREVO_NEWSLETTER_LIST_EN`, `BREVO_NEWSLETTER_LIST_FR`, `BREVO_DOI_TEMPLATE_EN`, `BREVO_DOI_TEMPLATE_FR` in Dokploy. Create the Text attributes `NEWSLETTER_LANGUAGE`, `NEWSLETTER_CONSENT_VERSION`, `NEWSLETTER_SIGNUP_AT` and activate real API DOI templates first. Configure the sender/domain in Brevo, then rebuild web and recreate inquiry. Full ERP authoring and provider activation instructions: `codeprojects/docs/newsletter.md` in the ERP repository.

The thank-you page is only a landing page. Visiting it does not subscribe anyone; only Brevo's confirmation flow changes subscription state. API responses never expose subscriber existence or provider details. A hashed recipient/language cooldown is process-local; nginx limits public request volume. Honeypot acknowledgements intentionally do not deliver anything.

Run `bun test server/*.test.mjs`, `bunx astro check`, and build with both public flags enabled for preview. Test both languages with your own address after configuring Brevo, and verify unsubscribe using a real test subscriber before sending a campaign. Local tests mock the provider and send no email.
