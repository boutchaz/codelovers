# Private stakeholder article review

`/review/<32 lowercase hexadecimal characters>/` uses the existing internal preview
service. GET displays an access-code form. POST checks the code and renders a fixed
article snapshot with the shared sanitized blog renderer. Public blog content,
feeds, sitemap and publication workflows are unchanged.

The private `stakeholder-reviews` Docker volume is mounted read-only in the preview
service at `/var/lib/codelovers-reviews`. It must never be mounted in nginx or added
to Git/build context. Operators provision `<id>.json` with mode 0640, readable by
the renderer's node user. Each record has `salt` (16 random bytes, hex), `codeHash`
(Node scrypt with that byte salt, 32 output bytes, hex), `expiresAt` (ISO UTC), and
`article` (the normalized fields accepted by the blog preview).

Generate a random 20-character base32 code with a cryptographic RNG; normalize to
uppercase and omit whitespace/hyphens before hashing. Keep the plaintext code out
of source, logs, URLs and ERP records. Send it only to authorized reviewers. Anyone
with the link and code can read the snapshot until expiry: it is a bearer secret,
not verification of the reviewer's identity. No session or cookie is stored.

The endpoint fails closed when unconfigured, unknown or expired. Nginx limits body
size and requests per IP and globally. Responses are no-store/noindex; scripts,
analytics, framing and share buttons are disabled. Never put confidential farm or
customer data into marketing drafts. Feedback is by reply to the review email;
reading or replying does not approve or publish the article.

Update a snapshot by issuing a fresh record/code and expiring the old one. Remove
its private record to revoke it. Review approval must refer to the actual final
version in ERP; publication remains a separate action.

Verify with `node --test scripts/stakeholder-review.test.mjs` and the existing blog
preview tests, then build. Check the deployed GET, wrong-code POST, correct-code
POST and a separate browser session before sending a review invitation.

## Visual story and participation

An optional private `article.visuals` object supplies the editable copy for the
AgroGina visual template. The diagram, evidence cards, scope cards and roadmap are
native HTML/CSS, not raster images. The full Markdown context stays available in
an expandable section. Keep the complete JSON snapshot attached privately to the
ERP draft. Publishing the public article and its visual layout is a separate step.

Optional participation uses a second volume, `stakeholder-responses`, mounted
read/write at `/var/lib/codelovers-responses` with node-user ownership. The review
content volume remains read-only. Configure `STAKEHOLDER_RESPONSE_DIR`; without it
the page does not offer a working submission button or claim to save answers.

Code authentication issues a signed, random, 20-minute form ticket bound to the
review ID and exact snapshot. Survey POSTs retain the same-site Origin check and
8 KiB request limit. The handler validates choices, role, consent and a maximum
500-character optional comment before writing one mode-0600 JSON record per
ticket with an exclusive create. Replays do not overwrite records. Storage
failure displays an error, never a success receipt. The access code is not
included in the form or response file.

Response records contain review ID, article revision, survey version, choice,
role, comment and creation time. They contain no email, IP address or access code.
Infrastructure logs are separate. No newsletter signup or third-party analytics
is triggered. No counts or representative-survey claims are shown. A code holder
can reopen the article and obtain another ticket; submissions are not verified
unique people or identified stakeholder approvals.

Operators can export the response JSON from the private volume using an
administrator-only Docker helper or `docker cp` from the preview container. Keep
exports private; never mount that volume in nginx or expose a response-list API.
Review and remove research data when it is no longer needed. No automatic expiry
or cleanup policy for responses is implied by the article access expiry.

Run `bun test scripts/review-participation.test.mjs scripts/stakeholder-review.test.mjs scripts/blog-preview.test.mjs`.
Test real successful writes only in isolated local storage. Do not create fake
production survey responses when checking the deployed form.
