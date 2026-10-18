# imandrei.com

The website for Andrei Sutton: the store, services, booking, work and credits
at https://imandrei.com.

## What's in here

| Folder | What it is |
|---|---|
| `site/` | The website (Next.js). This is what runs at imandrei.com. |
| `studio/` | The content editor (Sanity Studio) at https://andreisutton.sanity.studio, where the text, prices, videos, photos and links on the site are changed. |

Day-to-day changes (wording, prices, products, videos, photos, partner codes)
are made in the editor, not in this code. Publishing there updates the live
site within about a minute.

## Running the site locally

```bash
cd site
npm install
npm run dev
```

Then open http://localhost:3000. Without the environment variables below the
site still runs, using the content built into the code.

## Environment variables (site)

Set these in the hosting project (Vercel). Never commit them.

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Which Sanity project the site reads content from |
| `SANITY_API_READ_TOKEN` | Reading content (the dataset is private) and the editor's live preview |
| `SANITY_REVALIDATE_SECRET` | Lets Sanity tell the site to refresh after a publish |
| `SITE_URL` | The site's own address, `https://imandrei.com` |
| `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING` | Where orders, bookings and enquiries are stored |
| `ADMIN_PASSWORD` | Password for the private dashboard at `/admin` |
| `APP_SECRET` | Signs order, download and review links |
| `CRON_SECRET` | Protects the scheduled review-email job |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Card payments. Without them checkout runs in demo mode and says so. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL` | Sending email. Without them emails are listed in `/admin` instead of sent. |

The database table is created by `node --env-file=<your env file> scripts/migrate.mjs`
from `site/`.

## The content editor

```bash
cd studio
npm install
npm run dev      # local editor at http://localhost:3333
npm run deploy   # publish the editor to andreisutton.sanity.studio
```

## Scheduled jobs

- `site/vercel.json` runs the review-email job once a day on Vercel.
- The live site already runs the job every 30 minutes from its hosting setup.
  `.github/workflows/review-emails.yml` here runs it only when started by
  hand. If this repository becomes the one that deploys the site, add the
  schedule back (`schedule:` with `cron: "*/30 * * * *"` under `on:`) and two
  repository secrets: `SITE_URL` and `CRON_SECRET` (the same value as on the
  site).
