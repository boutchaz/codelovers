# Website analytics (PostHog)

The site measures visits and the clicks that mean "this visitor is trying to reach us". It records nothing about who they are: autocapture and session replay are off, and no event carries an email address, phone number, message or full link.

## Turn it on

1. Create a **separate PostHog project for Codelovers** (not the AgroGina one) in the **EU cloud**; the site's `/ingest` proxy points at `eu.posthog.com`. Copy the **Project API key** (starts with `phc_`). It is a public key, but keep it out of Git; set it in Dokploy.
2. In the website's Dokploy environment set `PUBLIC_POSTHOG_KEY` to that key. It is a **build** argument: redeploy the `web` service so the site is rebuilt. Without a key no analytics code ships at all.
3. Open the site, then PostHog → **Activity** (live events). You should see `$pageview`. Click a Cal.com link and look for `cta_click`.

Ad blockers still drop some events even through `/ingest`, so treat the numbers as a floor.

## Events

| Event | When | Properties |
|---|---|---|
| `$pageview` | every page load | path only (no query string), `product` and `article` (see below) |
| `cta_click` | click on a booking, WhatsApp, email, phone or other outbound link | `kind` (`booking`, `whatsapp`, `email`, `phone`, `outbound`), `host` (empty for email/phone), `product` and `article` (see below) |
| `share_click` | click on an article's LinkedIn, WhatsApp or copy-link button (never also a `cta_click`) | `kind` (`linkedin`, `whatsapp`, `copy`), `product` and `article` |
| `website_inquiry_recorded` | the ERP confirmed an inquiry from the form | `language`, `product` |
| `newsletter_signup_requested` | Brevo accepted a signup request | `language` |

`product` is the case-study slug on a case-study page, or the `product` set in a blog post's frontmatter (for example `passion-fitness`). `article` is the blog post's own slug. Both are empty when they do not apply, and anything that is not a plain lowercase slug is dropped.

UTM source, medium and campaign and the referrer are stored by PostHog on first visit, so you can break any event down by channel.

## The funnel to watch

Build one PostHog funnel per product and check it weekly:

1. `$pageview` where `product` is `<product>` (this covers the case study and every blog post about that product)
2. `cta_click` where `kind` is `booking` or `whatsapp`, or `website_inquiry_recorded`

To see which article does the work, break the funnel down by `article`, or chart `cta_click` with `kind` = `booking` by `article`.

Then add a trend of unique visitors by referrer, and by `utm_source` for anything you post. Tag every link you share with `?utm_source=...&utm_medium=...&utm_campaign=...` (for example `utm_source=instagram&utm_medium=dm&utm_campaign=passion-fitness-gyms`) so the visit and the resulting inquiry both name the channel.

## Privacy

The privacy page says PostHog sets analytics cookies; this setup matches that. If you want to avoid cookies entirely, posthog-js offers `cookieless_mode`; changing it also changes how returning visitors are counted, so update the privacy page at the same time.
