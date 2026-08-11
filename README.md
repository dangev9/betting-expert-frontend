# Betting Expert — Frontend

Angular app for [Betting Expert](https://github.com/YOUR_GITHUB_USERNAME/betting-expert-backend) — a
football betting tips site. Public site (today's picks, results, archive, VIP, about) plus a
JWT-protected admin dashboard for managing tickets.

Companion repo: **betting-expert-backend** (Spring Boot).

## Tech stack

Angular 21 · TypeScript · SCSS · standalone components + signals · Angular Router (lazy-loaded
routes) · HttpClient · Reactive Forms

## Architecture

Feature-based, not by-type:

```
core/         Services (HTTP calls), models (TS interfaces mirroring backend DTOs),
              JWT interceptor, admin route guard — no UI here
shared/       Reusable UI components used across features: ticket-card, navbar, footer,
              status-badge, stat-tile, empty-state, loading-spinner, layouts
features/
  home/ today/ results/ archive/ vip/ about/            Public pages
  admin/login/ admin/layout/ admin/dashboard/            Admin
  admin/ticket-form/                                     Create/edit ticket (FormArray + live odds)
```

Design system (dark, emerald-accent, sports-analytics look) lives in `src/styles.scss` as CSS
custom properties — colors, spacing, radius, typography tokens used everywhere.

## Local development

Requires the backend running (see the companion repo) — this app expects it at
`http://localhost:8080/api` by default.

```bash
npm install
npm start
```

Opens on `http://localhost:4200`.

## Environment

`src/environments/environment.ts` (production) and `environment.development.ts` (local):

- `apiUrl` — backend base URL
-  `contact.instagramUrl` — replace the placeholders with your real links before deploying

## Build & deploy

```bash
npm run build
```

Produces a static `dist/betting-expert-frontend/browser` folder — deployable to any static host
(Vercel, Netlify, Cloudflare Pages, S3+CDN...). Set `apiUrl` in `environment.ts` to your deployed
backend URL before building.

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/today` | Today's active picks |
| `/results` | Recent settled results |
| `/archive` | Full historical archive (filterable) |
| `/vip` | VIP info + contact CTAs |
| `/about` | About / methodology |
| `/admin/login` | Admin sign-in (not in public nav) |
| `/admin` | Dashboard (guarded) |
| `/admin/tickets/new` | Create ticket (guarded) |
| `/admin/tickets/:id/edit` | Edit ticket (guarded) |
