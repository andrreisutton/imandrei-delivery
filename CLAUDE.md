# imandrei.com

- The site is in `site/` (Next.js). Pushing to `main` deploys imandrei.com in about 2 minutes.
- **All content lives in `site/src/content/site.ts`.** Edit that file to change text, prices, products, credits, collaborators and links.
- **Sanity is switched off. Keep it off.** Do not set a Sanity project ID in `site/src/lib/sanity.ts` or in Vercel. The CMS holds an old copy of the site, and turning it on makes imandrei.com show that old copy instead of the edits in `site.ts` (this happened on 2026-10-20).
- `imandrei-delivery.vercel.app` is a separate preview. imandrei.com is served by the Vercel project `andreisutton` on the studioraine team, which builds this same repo's `main`. Do not try to move the domain.
