# Website editorial workflow

Current scope: the Codelovers website blog only. Existing X, LinkedIn and Instagram drafts stay unpublished while account strategy is undecided.

1. Open **Codelovers → Website blog & calendar**. Create one Website Blog post per language, linked to its product/project and shared story.
2. Review the article, SEO description, author, tags and distinct English/French slug. Set destination `https://wearecodelovers.com/` and an actual planned time in ERP's configured timezone.
3. Request review. A Sales Manager/System Manager approves the exact copy, destination and date. Editing any reviewed field clears approval. The first website publisher accepts Text/Article format without media attachments; use Markdown links for references. Attached creatives deliberately block automatic delivery until image publishing is added.
4. The website's GitHub worker fetches due approved blog posts, builds Astro, rechecks the approval, commits the article to the website main branch and requests deployment. It records Published in ERP only after the public page exposes the matching revision.
5. A failed build does not push. The workflow requests a website deployment only for a commit it just pushed. If the page is not live after about 7 minutes the run fails and the ERP post stays Approved; later scheduled runs keep checking and confirm it once the deployment finishes, but never request another deployment (a slow or broken build is not redeployed every 15 minutes). To deploy again, run **Publish approved website articles** manually with **Redeploy** checked, or deploy the website main branch in Dokploy. Existing manual articles cannot be overwritten. Published copy is preserved; duplicate it to prepare a new edition.

The starter setup contains six blog drafts (three products × English/French), with no approvals or publication dates. Social drafts are excluded from the worker endpoint. No customer-confidential material belongs in public copy.

## Deployment and activation

ERP repository: `boutchaz/codeprojects`. Install/migrate the updated portable Codelovers app. Keep Server Scripts enabled; the app seeds the **Codelovers - Content Approval Guard**. The publisher refuses operation when that guard is disabled. A migration upgrades the guard when the site still has an unmodified earlier release (keeping it enabled or disabled as you left it). If someone edited the script on the site it is left alone and an Error Log entry titled **Content approval guard not updated** asks you to merge the newer rules from `templates/content/validate.py`.

Website repository: `boutchaz/codelovers`. The implementation checkout is `codelovers-site` alongside `codeprojects`; the original Documents checkout is untouched. Deploy the website changes before enabling publishing.

In the website repository's Actions settings:

- Create a dedicated enabled ERP API user with Sales User access only to the appropriate company/content records. Generate its API key/secret and store as Actions secrets `ERP_API_KEY` and `ERP_API_SECRET`.
- Store an HTTPS POST deployment hook for the website application as `DEPLOY_WEBHOOK_URL`. It must deploy the latest website main branch. The workflow explicitly calls this hook, rather than relying on a subsequent GitHub Actions push event.
- Ensure Actions may push to website main (branch protection may require a narrowly scoped GitHub App/token instead of the default workflow token).
- Set repository variable `ERP_PUBLISHING_ENABLED=true` only when the above is ready. The workflow is disabled by default. Run **Publish approved website articles** manually for the first approved article; scheduled runs then check roughly every 15 minutes. GitHub schedules are best effort, not exact-time delivery.

Set the Actions values from a terminal; `gh secret set` asks for each value with hidden input, so nothing lands in shell history, chat or source:

```bash
gh secret set ERP_API_KEY -R boutchaz/codelovers
gh secret set ERP_API_SECRET -R boutchaz/codelovers
gh secret set DEPLOY_WEBHOOK_URL -R boutchaz/codelovers
gh variable set ERP_PUBLISHING_ENABLED --body true -R boutchaz/codelovers
gh workflow run "Publish approved website articles" -R boutchaz/codelovers
```

Until the variable is `true` every scheduled run shows as skipped. Check what is configured (names only, never values) with `gh secret list` and `gh variable list`.

Never put credentials in posts, attachments or source. Neither credentials nor deployment hooks have been configured by this code change. No public article has been sent.

## API and exports

`codelovers.content.get_due_posts` requires authenticated read access and returns only due Approved/Ready Website Blog records, their exact Markdown export, revision, idempotency key and ERP timezone. `confirm_publication` requires write access and the same approved revision; stale callbacks and conflicting repeated URLs are rejected. Markdown exports are private ERP attachments. Manually committing an export publishes it on deployment; a frontmatter date alone does not schedule Astro.

Worker jobs serialize and verify public revisions before confirmation. Approval is rechecked immediately before pushing, but it is not a distributed lock: a concurrent edit after that check cannot cancel a deployment already in progress. Restrict publishing credentials to trusted operators and avoid editing articles during an active deployment. A pushed version whose confirmation fails may be publicly accessible while ERP still shows Approved; the next run retries verification.
