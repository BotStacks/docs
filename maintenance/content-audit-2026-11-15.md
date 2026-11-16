# Documentation audit — November 15, 2026

## Scope and evidence
All 55 source documentation pages in the preceding build were inventoried. The replacement has 30 canonical documentation pages. Existing billing and CMS setup pages were read and retained; outdated editor, node, embed and channel integration procedures were replaced or retired. All former sitemap paths have a destination; the unused docs blog redirects to the marketing blog.

Product evidence: BotStacks/platform main 6b7e51637b54b74f9c4a332799cfcfe1535b0a63. Read frontend/src/routes.tsx, config/nav.ts, config/productPaths.ts, pages/BrainVaultPage.tsx, pages/TestAndTrainPage.tsx, pages/builder/ConfigurePage.tsx, pages/WorkflowBuilderPage.tsx, lib/workflow-graph.ts, lib/knowledge.ts and pages/ui-kits/UIKitsPage.tsx. These verify navigation and implemented UI behavior, not successful deployment, customer installations, immutable knowledge snapshots or delivered handoffs. Specs and audit records were treated as context, not launch proof. The obsolete widget README was rejected as unrelated evidence.

## Claim decisions
- Current canvas has seven step types; remove the obsolete node catalog rather than relabel it.
- Configure uses Preview then Apply; preview alone does not save.
- Knowledge upload limits are supplied by the account API; remove fixed 50 MB assertions.
- DIRTbox tests and saved corrections are distinct from publishing and CMS acceptance.
- Remove old sample embed code. Use workspace-generated public Bot ID and matching environment.
- Existing source-backed CMS guides retain listing and rollout caveats. No new marketplace availability asserted.
- Slack, Discord, WhatsApp, CRM and Crisp self-service steps lack current validation: replace with one availability guide rather than fabricate setup steps.
- Preserve the November 15 customer billing catalog and its explicit upcoming/not-for-sale status; older internal pricing specs conflict and are not used.
- No promises of ranking, tax/legal changes, supported model versions or successful external delivery added.

## Information architecture and SEO
Start here → Product guides → Your website → Manage and improve → Billing → Help and updates. Unique titles/descriptions, canonical URLs, one visible H1, branded social image, XML sitemap, crawlable robots.txt. Explicit sidebar avoids redundant category landing pages. audit-redirects.json maps old routes to specific replacements. Cloudflare _redirects provides HTTP 301s; the Docusaurus redirect plugin provides static-host fallback pages. Retired content is excluded from canonical sitemap and local search. The previous release history remains available in git, not presented as current product guidance.

Primary guidance reviewed: https://developers.google.com/search/docs/fundamentals/seo-starter-guide ; https://support.squarespace.com/hc/en-us/articles/205815908-Using-code-injection ; https://help.webflow.com/hc/en-us/articles/33961357265299-Custom-code-in-head-and-body-tags .

## Mobile correction
Replace conflicting global wrapper margins and navbar padding. Bound CTA to hero content, allow wrapped text with automatic height, and set 48px minimum target. Use a full-width phone drawer, separate close and brand flex space, 44px menu/close targets, scrollable menu content and safe-area padding. Retain native Docusaurus focus/navigation behavior.

## Verification
Production build passes locally. CI scripts/verify-docs.mjs checks every canonical page at 320/390/768/1440, CTA containment, mobile close/logo separation, real CTA navigation, title/description uniqueness, canonical/H1 presence, retired terminology, overflow and every redirect target. Screenshots and JSON results are uploaded by Docs build. Live deployment and full authenticated app/CMS acceptance are not performed by this docs change.
