# TJ Ibrahim — Portfolio & CMS

A cinematic, black-and-white portfolio website with a full admin backoffice for **TJ Ibrahim**
(Content Creator, Photographer & Video Editor).

Everything on the public site — hero copy, bio, projects, categories, photos, videos, brands,
WhatsApp number, social links, SEO — is editable from `/admin` without touching code.

---

## Tech stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **TypeScript**, **Tailwind CSS v4**, **Framer Motion**
- **Supabase** — Postgres, Auth, Storage, Row-Level Security
- Deploys to **Vercel**

---

## 1. Local development

### Install

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env.local` and fill in your Supabase values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # server only, never commit
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`. The admin is at `http://localhost:3000/admin`.

---

## 2. Supabase setup (one-time)

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the `URL`, `anon` key and `service_role` key into `.env.local`.
3. Open **SQL Editor** and run the two migrations in order:
   - `supabase/migrations/0001_init.sql` — tables, indexes, RLS, default site content
   - `supabase/migrations/0002_storage.sql` — `media` storage bucket + policies
4. Create the admin user:
   - **Authentication → Users → Add user → Create new user**
   - Enter an email and password. **Auto-confirm** the user.
5. Make that user an admin (so RLS allows writes). In the SQL editor:
   ```sql
   insert into public.profiles (id, email, role)
   values (
     (select id from auth.users where email = 'YOUR_EMAIL'),
     'YOUR_EMAIL',
     'admin'
   )
   on conflict (id) do update set role = 'admin';
   ```
6. Sign in at `/admin/login` with that email + password.

---

## 3. Using the CMS

Sidebar sections at `/admin`:

- **Overview** — counts and quick links.
- **Projects** — create, edit, publish, feature, reorder. Each project supports title, slug,
  description, category, cover image, gallery (multiple photos/videos), YouTube URL, hosted
  video URL, tags, year, date, SEO metadata, and brand associations.
- **Categories** — create portfolio categories (e.g. `EST`, `Photography`, `Football`).
  Toggling "Show in nav" immediately adds the category to the public navigation and makes
  `/work/<slug>` work. No code changes needed.
- **Media Library** — upload photos and videos, edit alt text, delete.
- **Brands** — logos (transparent PNG / SVG recommended), website URLs, display order,
  visibility.
- **Website Content** — every editable paragraph, heading, stat and button label on the
  public site: hero, about + specialties + stats, work intro, brands intro, footer.
- **Contact Settings** — email, WhatsApp number + prefilled message. The WhatsApp button
  opens `https://wa.me/<number>?text=<message>`.
- **Social Links** — Instagram and other links shown in the footer and contact page.
- **SEO Settings** — default title, meta description, social sharing image.

### Adding a YouTube video to a project

Paste any supported URL in the **YouTube URL** field:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

The site extracts the ID, embeds the player on the project page, and uses the thumbnail as
a fallback cover image if no cover is set.

---

## 4. Deployment to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo. Project name: `tj-ibrahim`.
3. Add the four environment variables from `.env.local` (except keep
   `SUPABASE_SERVICE_ROLE_KEY` secret).
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL (e.g. `https://tj-ibrahim.vercel.app`).
5. In Supabase **Authentication → URL Configuration**, add the Vercel domain to
   **Site URL** and **Redirect URLs**.
6. Deploy.

Image domains (your Supabase project + YouTube thumbnails) are already whitelisted in
`next.config.ts`.

---

## 5. Hero video

The provided personal video of TJ is bundled at `public/hero.mp4` and played in the hero
section (muted, looping, autoplay). To swap it, drop a new file at the same path and redeploy,
or add a Supabase-hosted URL to the hero component.

For large videos (> 25 MB) we recommend uploading to Supabase Storage via the Media Library
and using that URL instead — Vercel has a 100 MB per-asset deployment limit.

---

## 6. Security notes

- All admin writes go through Server Actions that call `supabase.auth.getUser()` first and
  redirect unauthenticated users to `/admin/login`.
- A middleware at `src/proxy.ts` additionally guards every `/admin/*` route server-side.
- RLS policies ensure the public anon key can only **read** published content; only admins
  (users with `role = 'admin'` in `profiles`) can write.
- The `SUPABASE_SERVICE_ROLE_KEY` is only imported by `src/lib/supabase/admin.ts`, which is
  server-only (used for storage uploads).
- `.env*` is gitignored. Never commit real keys.

---

## 7. Scripts

```bash
npm run dev     # local dev server (Turbopack)
npm run build   # production build + type check
npm run start   # run the production build
npm run lint    # ESLint
```

---

## 8. Troubleshooting

- **"Supabase is not configured yet" on `/admin/login`** — set the three env vars and
  restart `next dev`.
- **"new row violates row-level security policy"** — the signed-in user has no row in
  `public.profiles` with `role = 'admin'`. Run the insert statement from step 5 of the
  Supabase setup.
- **Images don't load** — make sure the Supabase project URL in `next.config.ts`'s
  `remotePatterns` matches your actual project. The config reads from
  `NEXT_PUBLIC_SUPABASE_URL` automatically, so just set the env var and rebuild.
- **Admin redirects loop** — clear cookies for the site and sign in again.
- **Upload fails with 413** — the file is too large. Use Supabase Storage directly or reduce
  size.
