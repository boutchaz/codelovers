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
