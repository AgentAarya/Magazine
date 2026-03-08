# The Creative Chronicles

A production-ready digital magazine archive built with Next.js, Tailwind CSS, Supabase, and PDF.js.

## Features

- Admin password authentication
- Admin dashboard for issue CRUD and site branding
- PDF-only issue upload with file type checks
- Supabase Storage upload support (fallback to local `/public/uploads` when Supabase is not configured)
- Homepage with banner, logo, featured + latest sections
- Archive with instant search + sort toggle
- Issue reader with embedded PDF.js controls
- Visitor rating (1-5 stars) with anti-spam hash upsert
- Visitor comments with input sanitization

## Tech Stack

- **Frontend/Backend:** Next.js (pages router + API routes)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage (default when configured)
- **Styling:** Tailwind CSS
- **PDF Viewer:** react-pdf (PDF.js)

## 1) Installation

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` values for your Supabase project.

## 2) Database Setup (Supabase)

1. Open Supabase SQL editor.
2. Run `sql/schema.sql`.
3. Ensure tables/views are created.

## 3) Storage Setup (Supabase)

1. Create a public bucket (default expected bucket name is `creative-chronicles`).
2. Optional: set `SUPABASE_STORAGE_BUCKET` to another bucket name.
3. Ensure your `SUPABASE_SERVICE_ROLE_KEY` is present so server-side upload API can write to storage.

## 4) Run locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## 5) Admin password

Set in `.env.local`:

```bash
ADMIN_PASSWORD=Aarya
```

Default is `Aarya` if env is missing, but set env in production.

## 6) Deployment

### Vercel
1. Push repo to GitHub.
2. Import project in Vercel.
3. Add all `.env.local` variables in Vercel settings.
4. Deploy.

### Netlify
1. Import repo in Netlify.
2. Build command: `npm run build`.
3. Use Netlify Next.js runtime (auto-detected for Next projects).
4. Add env vars.

### Railway
1. Create new project from GitHub repo.
2. Add env vars.
3. Build command: `npm run build`.
4. Start command: `npm run start`.

## Notes

- Upload API stores to Supabase Storage when configured, and falls back to local `/public/uploads` if Supabase env vars are missing.
- For hardened production security, place app behind WAF/CDN and enforce rate limits at edge.
