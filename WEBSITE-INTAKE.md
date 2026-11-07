# Website inquiries and Private Email

The first operational connection is website inquiry → ERP lead + inquiry receipt → next-day follow-up for Administrator. It does not send emails or subscribe visitors to marketing. Existing Cal.com booking links remain available; booking-to-ERP sync is a separate integration.

## Deploy the ERP app

Migrate the updated Codelovers app. It adds the private `Codelovers Website Inquiry` DocType and authenticated POST endpoint `codelovers.inquiries.create`. CRM/Marketing pages link to the inquiry inbox. Each submission has a UUID receipt so retries do not create duplicate messages/tasks. Existing leads are reused by email and company without overwriting their product history; the specific offering and attribution stay on the inquiry record.

In **System Settings → Codelovers Website Lead Capture**, choose company `codelovers`, owner `Administrator` and enable capture only when the website backend is ready. These browser-editable settings override the older site-config enable flag. Existing deployments may still use `codelovers_website_intake_enabled`, `codelovers_inquiry_owner` and `codelovers_inquiry_company` as fallbacks.

Migration installs **Codelovers Website Intake**, with only read/create on Lead, read/create/write on Website Inquiry, read on Product. Follow-up creation uses Frappe’s existing own-task permissions; no role-wide task-reading privilege is added. It does not grant email, billing or administrative access. Native permission APIs preserve other roles; existing customizations of this integration role are retained. Create the approved dedicated user `website-intake@wearecodelovers.com`, assign only this role, suppress the welcome email and restrict its Company User Permission to `codelovers`. API-key generation and deployment-secret entry must be completed securely by the operator. Do not use Administrator's API key.

Create the **Codelovers services** offering (type Service, active, company codelovers) on the site. The service-client case-study form defaults to this offering; its inquiry and new lead retain the service link. Public case-study calls to action open the form on the same page, preserving the referring case study. When intake is disabled, the action opens the company's email address instead of an unavailable form.

## Deploy the website

The existing static site remains on nginx. An internal Bun `inquiry` service holds the ERP credential and handles only `/api/inquiry`; it has no host port or Traefik route. The static browser bundle contains no API secrets.

Configure the website Compose environment using `.env.example`:

- `ERP_URL`: HTTPS ERP origin.
- `ERP_INTAKE_API_KEY` / `ERP_INTAKE_API_SECRET`: dedicated intake user, stored only as deployment secrets.
- `PUBLIC_INQUIRY_ENABLED=true`: exposes the bilingual form at build time. Keep false until the backend is ready. Rebuild when changing this value.
- `PUBLIC_POSTHOG_KEY`: optional existing analytics project key. No project was created by this change.

Compose adds the internal service, nginx proxy, a 24 KiB body limit and a small request ceiling. nginx sees the proxy IP, so the rate limit may be shared by all visitors; increase it only after reviewing traffic and trusted proxy configuration. Honeypot and origin checks reduce simple spam but are not a CAPTCHA or bot-proof authentication. Add a verified challenge if abuse appears.

Test an explicitly labelled QA inquiry, check one linked lead/inquiry/ToDo in ERP, then retry the same request and verify no duplicate. Confirm both French and English, and verify failure states never claim successful delivery. The implementation tests use fake requests only; no production inquiry has been submitted by this change.

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
