# Website inquiries and Private Email

The first operational connection is website inquiry → ERP lead + inquiry receipt → next-day follow-up for Administrator. It does not send emails or subscribe visitors to marketing. Existing Cal.com booking links remain available, and bookings made through them reach ERP the same way (see **Cal.com bookings**).

## Deploy the ERP app

Migrate the updated Codelovers app. It adds the private `Codelovers Website Inquiry` DocType and authenticated POST endpoint `codelovers.inquiries.create`. CRM/Marketing pages link to the inquiry inbox. Each submission has a UUID receipt so retries do not create duplicate messages/tasks. Existing leads are reused by email and company without overwriting their product history; the specific offering and attribution stay on the inquiry record.

In **System Settings → Codelovers Website Lead Capture**, choose company `codelovers`, owner `Administrator` and enable capture only when the website backend is ready. These browser-editable settings override the older site-config enable flag. Existing deployments may still use `codelovers_website_intake_enabled`, `codelovers_inquiry_owner` and `codelovers_inquiry_company` as fallbacks.

Migration installs **Codelovers Website Intake** as a gate role with no document rights at all. `codelovers.inquiries.create` requires the role, then looks up and writes the lead, inquiry and follow-up on the server, only for the company set in System Settings. An API key for this user therefore cannot list, read or edit leads, inquiries or products through `/api/resource`; the most it can do is submit an inquiry, exactly like the public form. Earlier releases gave the role read/create on Lead, read/create/write on Website Inquiry and read on Product: each migration removes those rights (and only those, only for this role) from existing sites, and other roles are untouched. Because the role is only a gate, rights added to it by hand are removed at the next migration too. Create the approved dedicated user `website-intake@wearecodelovers.com`, assign only this role, suppress the welcome email and restrict its Company User Permission to `codelovers`. API-key generation and deployment-secret entry must be completed securely by the operator. Do not use Administrator's API key.

Each new inquiry or booking also puts an in-app alert (the bell) in front of the inquiry owner, created only after the intake is committed: if the alert fails it is logged and the inquiry is kept. Email alerts are deliberately not switched on while outgoing mail is disabled. To add one later, create a standard ERP **Notification** on **Codelovers Website Inquiry**, event **New**, channel **Email**, recipient the owner.

Create the **Codelovers services** offering (type Service, active, company codelovers) on the site. The service-client case-study form defaults to this offering; its inquiry and new lead retain the service link. Public case-study calls to action open the form on the same page, preserving the referring case study. When intake is disabled, the action opens the company's email address instead of an unavailable form.

## Deploy the website

The existing static site remains on nginx. An internal Bun `inquiry` service holds the ERP credential and handles only `/api/inquiry`, `/api/newsletter` and the signed `/api/cal-webhook`; it has no host port or Traefik route. The static browser bundle contains no API secrets.

Configure the website Compose environment using `.env.example`:

- `ERP_URL`: HTTPS ERP origin.
- `ERP_INTAKE_API_KEY` / `ERP_INTAKE_API_SECRET`: dedicated intake user, stored only as deployment secrets.
- `CAL_WEBHOOK_SECRET`: signing secret for Cal.com booking webhooks (see **Cal.com bookings**).
- `PUBLIC_INQUIRY_ENABLED=true`: exposes the bilingual form at build time. Keep false until the backend is ready. Rebuild when changing this value.
- `PUBLIC_POSTHOG_KEY`: optional existing analytics project key. No project was created by this change.

Compose adds the internal service, nginx proxy, a 24 KiB body limit and rate limits. Traefik appends the visitor's address to `X-Forwarded-For`; nginx trusts only that last entry from private Docker peers, so the limit applies per visitor (10 inquiries and 5 newsletter requests per minute each), with a looser ceiling across all visitors (60 and 30 per minute). A forged leading `X-Forwarded-For` value does not change which visitor is limited. `deploy/check-rate-limits.sh` proves this against the production nginx image (it needs Docker). Honeypot and origin checks reduce simple spam but are not a CAPTCHA or bot-proof authentication. Add a verified challenge if abuse appears.

Test an explicitly labelled QA inquiry, check one linked lead/inquiry/ToDo in ERP, then retry the same request and verify no duplicate. Confirm both French and English, and verify failure states never claim successful delivery. The implementation tests use fake requests only; no production inquiry has been submitted by this change.

## Cal.com bookings

A booking is a visitor asking for a call, so it becomes the same Lead (reused by email), inquiry receipt and owner task as a form submission, except that the task is due on the day of the call and the inquiry records `cal.com` / `booking` as its source. Nothing is sent to the booker, and a booking is not a newsletter opt-in.

1. In Cal.com open **Settings → Developer → Webhooks → New**. Subscriber URL `https://wearecodelovers.com/api/cal-webhook`, trigger **Booking Created** only, and a long random secret.
2. Save the same secret as `CAL_WEBHOOK_SECRET` in the website's Dokploy environment (never in Git or chat) and recreate the `inquiry` service. Without the secret the endpoint refuses everything.
3. Use Cal.com's **Ping test**: it should report success (the relay acknowledges and ignores it). Then make one labelled test booking and check the new inquiry, the task dated for the call and the owner's alert in ERP. Replaying the same delivery from Cal.com must not create a second inquiry.

Every delivery is checked against its HMAC signature before anything is read. The relay uses the same dedicated intake user as the form. Rescheduled and cancelled bookings are acknowledged but not synced: adjust or close the task by hand.

## Private Email

The verified mailbox is `tech@wearecodelovers.com`. Its ERP Email Account is prepared with incoming/outgoing disabled, encrypted IMAP 993 and SMTP 587 (STARTTLS) at `mail.privateemail.com`. The portable helper is an explicit site operation, not an identity/credential fixture:

```
bench --site SITE execute codelovers.email_setup.prepare --kwargs '{"email":"tech@wearecodelovers.com"}'
```

An operator must use Private Email Settings → Connect third-party apps to enable the required protocols and generate an application password, then enter that password directly in the ERP Email Account. Do not paste it into chat, source, scripts or logs. Namecheap now documents application passwords for mail clients: https://www.namecheap.com/support/knowledgebase/article.aspx/1179/2175/general-private-email-configuration-for-mail-clients-and-mobile-devices/

Before enabling outgoing, review existing ERP Email Queue entries: an enabled account may process pending mail. Keep automatic replies and global outgoing defaults off initially. Verify SMTP authentication first without delivering mail; send a labelled self-test only after choosing and authorizing its recipient. Check the existing delivery-failure notices before relying on automatic customer messages.

For incoming, choose the intended folder and initial-sync behavior before enabling. Enable automatic linking only after incoming is enabled. Leave Append To blank initially: this mixed mailbox contains bounces and non-sales messages that should not all become leads. Link relevant communications to their Lead/Opportunity manually. Native mailbox synchronization imports messages to ERP, so enable it only after confirming that scope with the operator.

## Measurement

The form records current-page UTM source/medium/campaign on the inquiry. This is not cross-session attribution. With PostHog configured, a successful response emits `website_inquiry_recorded` with product and language only. Autocapture and session replay are disabled so the form's contact details/message are not automatically captured. The form's permission checkbox covers replying to the inquiry, not newsletter opt-in. Private Email is the initial conversation mailbox; no bulk campaign or automated nurture is activated here.

## SMTP verification

The saved application password authenticated successfully on encrypted port 587. Port 465 timed out from the ERP host, so the site and helper now use STARTTLS on 587. One authorized test to the operator's Gmail address was accepted by the SMTP server; the Email Account activity contains the receipt. Inbox placement still needs recipient confirmation. Incoming synchronization and routine outgoing sending remain disabled.
