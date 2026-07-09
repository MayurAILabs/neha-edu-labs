# Neha Edu Labs

**Learn Engineering. Master AI. Build Your Future.**

A free, production-ready educational platform for Engineering, Electronics, VLSI, Embedded Systems, Programming and Artificial Intelligence — built by educator **Neha Badgujar** (Assistant Professor, M.Tech VLSI Design, 8+ years teaching experience).

Live site: `https://<your-github-username>.github.io/<repo-name>/` (or a custom domain, see [Deployment](#deployment)).

---

## Tech Stack

Pure static site, zero build step, zero backend:

- **HTML5 / CSS3 / Vanilla JavaScript** — no React, Angular, Vue, PHP or Node server
- **Font Awesome 6** — icons (CDN)
- **AOS** — scroll animations (CDN)
- **Typed.js** — homepage hero typing effect (CDN)
- **Chart.js** — available for data-viz pages (CDN, loaded where used)
- **GitHub Actions** — hourly RSS → `data/news.json` automation (the site's only "backend")

Because there is no build step, you can open `index.html` directly after cloning — though a local static server is recommended (see [Local Development](#local-development)) so `fetch()` calls to the JSON files work everywhere.

---

## Project Structure

```
/
├── index.html              Homepage
├── about.html               About Neha Badgujar — timeline, research, qualifications
├── courses.html              Course catalog (filterable by AI/ML, Programming, Electronics & VLSI)
├── course-detail.html        Single-course template, driven by ?id=<course-id>
├── notes.html                 Semester/subject-wise notes, papers, lab manuals
├── blog.html                  Blog listing
├── blog-post.html             Single-article template, driven by ?id=<post-id>
├── projects.html              Student project showcase
├── ai-tools.html               AI tools directory
├── resources.html              Student corner (daily quiz) + career guidance
├── contact.html                 Contact form + info
├── privacy.html / terms.html    Legal pages
├── sitemap.xml / robots.txt      SEO
├── manifest.json / sw.js          PWA
├── favicon.svg
│
├── assets/
│   ├── css/style.css          Entire design system (tokens, dark mode, components)
│   ├── js/
│   │   ├── components.js       Injects shared header (nav+ticker+search) & footer, dark mode, mobile nav
│   │   ├── data.js               fetch/cache helper + date formatting
│   │   ├── news.js                Renders the breaking-news ticker + news cards
│   │   ├── courses.js             Course grid, category filters, course detail view
│   │   ├── blog.js                 Blog grid + article view
│   │   ├── projects.js             Project grid + category filters
│   │   ├── notes.js                 Notes tables (search + semester filter)
│   │   ├── search.js                 Global Ctrl/Cmd+K search index across all JSON data
│   │   └── main.js                    Page loader, AOS/Typed.js init, counters, forms, PWA install, service worker registration
│   ├── images/                  SVG illustrations (generated placeholders — replace with real photos/art anytime, see below)
│   └── icons/                    PWA icons
│
├── data/
│   ├── news.json                 Auto-updated hourly by GitHub Actions
│   ├── courses.json
│   ├── blog.json
│   ├── projects.json
│   └── notes.json
│
├── .github/
│   ├── workflows/update-news.yml    Hourly cron job
│   └── scripts/
│       ├── fetch_news.py              RSS aggregator (stdlib only, no pip installs required)
│       └── feeds.json                  Editable list of RSS sources
│
└── scripts/                      Local-only dev tooling (not required for the live site)
    ├── dev-server.js               Zero-dependency static file server for local preview
    ├── gen-placeholders.js          Regenerates the gradient SVG illustrations
    └── gen-avatars.js               Regenerates the SVG avatar placeholders
```

---

## Local Development

No dependencies to install for the site itself. To preview it locally with working `fetch()` calls:

```bash
node scripts/dev-server.js
# → http://localhost:5500
```

(Any other static server works too — e.g. `npx serve`, `python -m http.server` — the site has no server-side requirements.)

---

## How the Site Is Wired Together

- **Shared header/footer**: every page has empty `<header id="site-header">` / `<footer id="site-footer">` containers. `assets/js/components.js` injects the nav, breaking-news ticker, search overlay and footer into them at runtime, and highlights the active nav link using `<body data-page="...">`. This keeps navigation/footer changes to **one file** instead of 13.
- **JSON-driven content**: courses, blog posts, projects and notes all live in `data/*.json` and are rendered client-side by the matching `assets/js/*.js` module. To add a new course, blog post, project or note, **edit the JSON — no HTML changes needed**.
- **Detail pages**: `course-detail.html?id=vlsi-design` and `blog-post.html?id=vlsi-career-guide` are single templates that render whichever record matches `?id=` from the JSON. Card links throughout the site already point to the right query string.
- **Category filtering**: `courses.html#ai-ml`, `courses.html#programming`, `courses.html#electronics` and `projects.html#ai` etc. auto-select the matching filter tab on load.
- **Global search**: press `Ctrl/Cmd+K` (or the search icon) anywhere on the site to fuzzy-search across courses, notes, blog and projects.
- **Dark mode**: toggled via the moon/sun icon, persisted in `localStorage`, and respects the OS `prefers-color-scheme` on first visit.

---

## News Automation (GitHub Actions)

`data/news.json` powers the breaking-news ticker and the "Latest AI News" / "Latest Education News" homepage sections. It is regenerated automatically:

1. `.github/workflows/update-news.yml` runs every hour (`cron: "0 * * * *"`), and can also be triggered manually from the **Actions** tab (`Run workflow`).
2. It runs `.github/scripts/fetch_news.py`, which reads the feed list in `.github/scripts/feeds.json`, downloads each RSS/Atom feed using only the Python standard library (no `pip install` needed), and normalizes entries into the schema `assets/js/news.js` expects.
3. New items are **merged** with the existing `data/news.json` (not replaced) — if a single feed is temporarily down or its URL has changed, older items stay on the site instead of disappearing, and the run never fails because of one bad feed.
4. If `data/news.json` changed, the workflow commits and pushes it back to the repository automatically using `stefanzweifel/git-auto-commit-action`.

**To add, remove or fix a feed**, edit `.github/scripts/feeds.json` — each entry is `{ "source": "...", "url": "...", "category": "AI" | "Education" | "Programming" | "Engineering" }`. Government/education portal RSS URLs (AICTE, NPTEL, UGC) change occasionally — if the ticker stops showing fresh items from one of them, check the workflow's run logs in the **Actions** tab (each feed logs `OK` or `SKIP <reason>`) and update the URL.

No paid services, no external cron provider, no server — this all runs on GitHub's free Actions minutes.

---

## SEO

- Per-page `<title>`, meta description, canonical URL, Open Graph and Twitter Card tags
- `sitemap.xml` and `robots.txt` at the site root
- JSON-LD structured data: `EducationalOrganization`, `Person` (Neha Badgujar) and `WebSite` on the homepage; `Person`/`BreadcrumbList`-style markup on inner pages
- Semantic HTML, descriptive `alt` text, and a logical heading hierarchy throughout

**Before launch**, update every `https://www.nehaedulabs.in/...` canonical/OG URL to your real domain (a quick project-wide find-and-replace) and regenerate `sitemap.xml` if you add or remove pages.

---

## Accessibility

- Skip-to-content link on every page
- Visible focus states (`:focus-visible`) on all interactive elements
- `aria-label`s on icon-only buttons (search, theme toggle, mobile nav, back-to-top)
- Respects `prefers-reduced-motion` (disables animations/smooth scroll)
- Color palette checked for adequate contrast in both light and dark themes

---

## PWA

- `manifest.json` + SVG icons enable "Add to Home Screen" / install prompts on supported browsers
- `sw.js` precaches the app shell (HTML/CSS/JS) and serves a network-first, cache-fallback strategy so the site keeps working offline after a first visit
- An in-page install banner (bottom of screen) appears when the browser fires `beforeinstallprompt`

---

## Customization

| I want to...                                  | Edit this |
|------------------------------------------------|-----------|
| Change colors / fonts / spacing                 | `assets/css/style.css` (CSS custom properties at the top) |
| Add a course                                     | `data/courses.json` |
| Add a blog post                                   | `data/blog.json` |
| Add a student project                              | `data/projects.json` |
| Add notes / a previous paper                        | `data/notes.json` |
| Change nav links or footer content                    | `assets/js/components.js` |
| Add/remove an RSS source for the news ticker            | `.github/scripts/feeds.json` |
| Replace a placeholder illustration                        | Regenerate via `node scripts/gen-placeholders.js <dir> <config.json>`, or simply drop in your own image at the same path |

All placeholder illustrations, avatars and the hero graphic under `assets/images/` are generated SVGs (gradient + icon), not stock photography — swap them for real photos/screenshots any time without touching any HTML.

---

## Deployment (GitHub Pages)

1. **Create a GitHub repository** (if you haven't already) and push this project to it.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` (or your default branch) and `/ (root)`, then **Save**.
5. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two — check the **Actions** tab for the "pages build and deployment" run.
6. **(Optional) Custom domain**: add a `CNAME` file at the repo root containing your domain, and configure your DNS provider with a `CNAME` record pointing to `<your-username>.github.io` (or `A` records to GitHub Pages' IPs for an apex domain), then set the domain under **Settings → Pages → Custom domain**.
7. **Enable the news automation**: no extra setup needed — `.github/workflows/update-news.yml` runs automatically once the repo is on GitHub (it needs `contents: write` permission, which the workflow already requests; if your organization restricts default `GITHUB_TOKEN` permissions, enable **"Read and write permissions"** under **Settings → Actions → General → Workflow permissions**).
8. Update the canonical/OG URLs (search for `nehaedulabs.in`) to match your actual GitHub Pages URL or custom domain.

That's it — no build pipeline, no environment variables, no paid infrastructure.

---

## License & Content

Site code is free to adapt for your own educational project. Course/blog/notes content is written for Neha Edu Labs — see [`terms.html`](terms.html) before redistributing it elsewhere.

---

Built with ❤️ for students learning Engineering and AI.
