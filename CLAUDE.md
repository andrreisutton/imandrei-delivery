# imandrei.com

- The site is in `site/` (Next.js). Pushing to `main` deploys imandrei.com in about 2 minutes.
- **All content lives in `site/src/content/site.ts`.** Edit that file to change text, prices, products, credits, collaborators and links.
- **Sanity is switched off. Keep it off.** Do not set a Sanity project ID in `site/src/lib/sanity.ts` or in Vercel. The CMS holds an old copy of the site, and turning it on makes imandrei.com show that old copy instead of the edits in `site.ts` (this happened on 2026-10-20).
- `imandrei-delivery.vercel.app` is a separate preview. imandrei.com is served by the Vercel project `andreisutton` on the studioraine team, which builds this same repo's `main`. Do not try to move the domain.
- **Product files (what a buyer downloads) are uploaded at imandrei.com/admin, under Product files**, not put in the repo. They live in a private Vercel Blob store (`andrei-products`), and buyers get a 15-minute signed link after paying. A download product sells on the site only when its file is uploaded AND Stripe is on a live key; until then it sells on Gumroad (if it has a Gumroad link in `deliveryUrls`) or shows "Not for sale right now".
- Buyers get a receipt, a review request a few hours later, and a "what to grab next" email 5 days later. Emails only actually send once `RESEND_API_KEY` and `EMAIL_FROM` are set on Vercel; until then they are logged in /admin.
