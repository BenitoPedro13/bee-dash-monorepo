# Bee Dash

Monorepo for **Bee Dash**, the Bee Company creator/influencer-marketing performance
dashboard. Three apps, one pnpm workspace:

| App | Path | Stack | Live | Deploy |
|-----|------|-------|------|--------|
| API | [`apps/api`](apps/api) | NestJS 10 + Prisma 5 + PostgreSQL | https://api.thatsbee.co | [Railway](https://railway.com/), auto-deploys from `main` (Root Directory `apps/api`) |
| Public dashboard | [`apps/web`](apps/web) | Next.js 14 | https://www.thatsbee.co | [Vercel](https://vercel.com/), CLI-deployed (`vercel --prod`, not Git-integrated) |
| Admin panel | [`apps/admin`](apps/admin) | Refine + Next.js 14 + antd | https://admin.thatsbee.co | [Vercel](https://vercel.com/), CLI-deployed (`vercel --prod`, not Git-integrated) |

See each app's own README for app-specific setup. See `CLAUDE.md` for full architecture,
conventions, and known issues.

## History

This repo merges three formerly-separate repos (`bee-dash-nestjs`, `bee-dash-nextjs`,
`bee-dash-refine`) into one pnpm workspace, preserving full git history/blame for every
file (via `git filter-repo --to-subdirectory-filter` + merge, not a squashed import) — see
`docs/tasks/TASK-monorepo-migration.md`.

## Getting started

```bash
pnpm install
```

Each app manages its own env vars — see `apps/api/.env.example`. `apps/web` and
`apps/admin` don't use env files for their API base URL today (hardcoded constants); see
the known-issues note in `CLAUDE.md`.

```bash
pnpm run dev:api     # NestJS, watch mode
pnpm run dev:web     # Next.js public dashboard
pnpm run dev:admin   # Refine admin panel
pnpm run build       # build all 3 apps
```
