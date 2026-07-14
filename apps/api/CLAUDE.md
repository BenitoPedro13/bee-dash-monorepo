# Workflow Guidelines (portable)

> Process guidelines for collaborating with AI agents (Claude Code, Cursor, etc.) on **any** project.
> Copy this file — or the relevant sections — into a new repo's `CLAUDE.md`, `AGENTS.md`,
> or `.cursorrules`. Every path below (`docs/tasks/…`, `apps/*`, …) is an **example**;
> adapt it to the target project's layout.
>
> The philosophy in one line: **Plan before you touch code, lean on existing tooling
> while you work, and treat documentation as part of the deliverable when you finish.**

---

## 0. Project context — Bee Dash API

> **Bee Dash** is the backend API for a creator/influencer-marketing performance
> dashboard ("Bee Company Dash"). It tracks **campaigns** run by brand users, the
> **creators/influencers** in them (Instagram + TikTok), their **posts** (stories,
> feed, reels, tiktok) and per-post performance metrics (impressions, interactions,
> likes, clicks, etc.), grouped into **posts-packs** (a priced bundle of posts a
> creator delivers for a campaign), plus **categories** tagging creators/campaigns,
> **attachments** (uploaded files/media) and campaign **CSV performance imports**
> (bulk metrics upload, parsed and cached as a `Performance` row). Auth is a small
> custom **NestJS `AuthGuard` + JWT** (`@nestjs/jwt`, HS256, `process.env.JWT_SECRET`),
> not Supabase. There is no separate `apps/`/`packages/` split — this repo **is** the
> API (`package.json` name `nesjs-api`); the frontend(s) are separate projects,
> reachable at `*.thatsbee.co`, `*.vercel.app`, `*.gopark.app.br` (see CORS allowlist
> in `src/main.ts`).
>
> **Status (2026-07-14): migrating hosting from AWS → Railway.** The app currently
> runs on an AWS VM (`forever start` process manager) against an AWS Lightsail-managed
> Postgres and serves uploads from local disk — see `docs/tasks/TASK-migrate-railway.md`
> for the in-flight plan (new Railway Postgres, real S3 wiring for uploads, secret
> rotation). A batch of real credentials (AWS keys, DB password, JWT secret) was found
> committed in `.env` in git history and pushed to a **public** GitHub repo
> (`BenitoPedro13/bee-dash-nestjs`); the AWS key has been deactivated, `.env` has been
> untracked, and secret rotation is part of the migration task.

**Locked decisions (as found — not aspirational):** npm (not pnpm) · single NestJS 10
app, no monorepo/workspace · Prisma 5 + PostgreSQL, Prisma owns the whole schema ·
uploads currently hit local disk via Multer `diskStorage` + `ServeStaticModule`
(`./files`, served at `/public`) — **ephemeral on Railway, being migrated to S3** ·
`@aws-sdk/client-s3` + legacy `aws-sdk` are both present as deps but unused in `src/`
today (dead weight until the S3 migration wires them in) · `externDB/` is a **legacy,
dead-code** connector to an old DigitalOcean Postgres (only referenced by a
commented-out import in `src/csvs/csvs.service.ts`) — not part of the live request
path · money/metrics fields are plain `Int`/`Float` (no cents convention) · locales/i18n:
none, UI copy lives in the separate frontend.

**Watch out:**
- `.env` is **not** actually gitignore-safe by default in this repo's history — it was
  tracked for 4 commits before being removed; always double-check `git ls-files` for
  `.env`/credential-shaped files before assuming `.gitignore` is honored.
- The `.env` `DATABASE_URL=${DB_TYPE}://${DB_USER}:...` composition relies on shell-style
  variable expansion that **plain `dotenv` does not perform** (no `dotenv-expand` dep) —
  on Railway, set `DATABASE_URL` directly from the Postgres plugin's connection string
  instead of trying to compose it from parts.
- `NODE_TLS_REJECT_UNAUTHORIZED=0` is set globally in `.env` (disables TLS cert
  verification process-wide) — a workaround for the old Lightsail Postgres cert; drop it
  once on Railway's managed Postgres.
- `files/` has 171+ real uploaded files committed straight into git (test data mixed
  with real creator/campaign images) — do not blindly `git add -A` in this repo, and
  don't assume everything under `files/` is disposable without checking first.

---

## 1. Plan before executing — write a task document first

**Rule:** Before editing or creating **any** code file, always write a task document at
`docs/tasks/TASK-<slug>.md` describing the work. No exceptions for "small" changes — a
change that looks like a one-liner often hides assumptions worth surfacing first.

### 1.1 Required sections

Every task document must contain these four sections, in this order:

1. **Current scenario (`Cenário actual`)** — How it works *today*. What exists, what the
   relevant code/flow does right now, and specifically what is broken, blocked, missing,
   or limiting. Be concrete: name the files, functions, endpoints, env vars, or tables
   involved. If there is a bug, describe the exact observed behaviour and (if known) the
   root cause.

2. **Planned changes (`Mudanças planeadas`)** — What will change, **file by file**.
   Describe the new behaviour, not just "edit X". For each file, say what is being added,
   modified, or removed and how the pieces connect. If there are alternatives you
   considered and rejected, note them briefly so the reviewer understands the choice.

3. **Why (`Porquê`)** — Justification with business and/or technical context. Why is this
   the right change? What problem does it solve, what does it unblock, what does it cost?
   This is the section that lets a reviewer agree or push back *before* code exists.

4. **Affected files (`Ficheiros afectados`)** — A table listing every file the change
   touches, with the type of change:

   | File | Change type | Notes |
   |------|-------------|-------|
   | `apps/api/src/foo.service.ts` | edit | add `bar()` method |
   | `packages/shared/src/baz.ts` | new | new Zod schema |
   | `apps/api/src/old.ts` | removal | superseded by `foo.service.ts` |

### 1.2 How to apply it

- **Write the document silently.** Do not dump its full contents into the chat. Create the
  file, then point the user at it (or summarize in 2–3 lines) and wait for alignment when
  the change is significant. Only proceed to code after the user has reviewed/approved.
- **One document per task / unit of work.** Use a short, descriptive kebab-case slug:
  `TASK-add-google-oauth.md`, `TASK-fix-pagination-cap.md`.
- **Keep it in sync.** If the plan changes mid-task, update the document — it is a living
  record of intent, not a write-once artifact.
- **The document is the contract.** When in doubt about scope, the task doc is the source
  of truth for what was agreed.

### 1.3 Why this matters

The user wants **review and alignment before code is written**. This avoids doing work
that gets rejected, forces the thinking to happen up front, and leaves a durable trail of
*why* each change was made — useful months later when the reasoning is no longer obvious.

---

## 2. Use CLIs, generators, and SDKs — don't write everything by hand

**Rule:** Prefer invoking existing, canonical tooling over reimplementing logic or
hand-authoring files that a tool can generate correctly. Reach for the command first; only
hand-write when no tool fits.

### 2.1 What this looks like in practice

- **Scaffolding & generators.** Use official generators instead of hand-typing boilerplate:
  `nest g resource`, `prisma migrate dev` / `prisma generate`, `npm create vite@latest`,
  `gh repo create`, framework CLIs, and project `package.json` scripts. Generated output is
  canonical, consistent, and less error-prone than hand-written equivalents.
- **Service operations via official CLI/SDK.** Deploys, database migrations, queries,
  cloud resource changes, auth flows — drive them through the official CLI or SDK
  (`gh`, `railway`, `aws`, `gcloud`, `stripe`, `psql`, the project's own scripts) rather
  than reconstructing requests, SQL, or config by hand.
- **Run the command, then verify the output.** When a reliable, idempotent command does
  the job, run it and check what it produced — do not recreate the result line by line.
  Reproducing a generator's output manually is slower and silently drifts from the tool's
  conventions.
- **Use the agent's dedicated tools.** Prefer the purpose-built file read/edit/search tools
  over improvised shell commands (`cat`, `sed`, `awk`, `echo`) when one fits — they are
  safer, clearer, and easier to review.
- **Respect the project's existing tooling.** Match the package manager, the lint/format
  commands, the migration tool, and the build scripts already in the repo. Don't introduce
  a parallel way of doing something the project already has a command for.

### 2.2 When to hand-write instead

Hand-writing is correct when: no generator/CLI covers the case; the tool's output would
need heavy rework anyway; or the generated code conflicts with established project
conventions. In those cases, still match the surrounding code's style and idioms.

### 2.3 Why this matters

Less human error, canonical and reproducible output, alignment with the project's existing
tooling, and lower maintenance cost. The tool encodes conventions you'd otherwise have to
remember and reapply by hand every time.

---

## 3. Update documentation after executing

**Rule:** Before considering a task **done**, update **all documentation affected** by the
change. Documentation is part of the deliverable, not an optional follow-up. A change isn't
finished until the docs describing the changed behaviour are correct again.

### 3.1 What to check and update

Go through each of these and update anything the change touched:

- **`CLAUDE.md` / agent instructions** — If the change alters architecture, data flows,
  build/run commands, conventions, or any behaviour described in the agent guide, update
  the corresponding section. Keep it accurate; a stale agent guide actively misleads.
- **`docs/*.md`** — Any architecture, design, AUTH, IMPLEMENTATION, DEPLOY/RAILWAY, or
  feature docs whose described behaviour changed. Update the specific sections, don't just
  append a note.
- **`README.md` (root and per app/package)** — Endpoint tables, flow descriptions, setup
  and run instructions, feature lists, command references.
- **`.env.example` + deploy docs** — Whenever env vars are added, renamed, or removed. The
  example file and the deployment guide must list every variable the code now reads.
- **ADRs (Architecture Decision Records)** — Do **not** rewrite existing ADRs; they are a
  historical record. Instead, add a **dated update note** when a previous assumption became
  outdated (e.g. `> Update 2026-06-14: superseded by …`).

### 3.2 How to apply it

- Treat "docs updated" as an explicit checklist item before declaring the task complete.
- If a change introduces a new env var, the same change must update `.env.example` and the
  deploy docs — they travel together, never separately.
- When unsure whether a doc is affected, grep for the names of the things you changed
  (function, endpoint, env var, table) across `*.md` to find references that went stale.

### 3.3 Why this matters

The user explicitly requires this as part of the guidelines: project documentation is
treated as part of the deliverable, not optional. Stale docs cost more than no docs — they
send the next person (or agent) down the wrong path.

---

## 4. Project conventions — monorepo + pnpm

**Rule:** Default to a **pnpm workspace monorepo**. Unless told otherwise, assume:

- **pnpm is the package manager.** Use `pnpm` for every command — `pnpm install`,
  `pnpm add`, `pnpm dlx`, `pnpm --filter <pkg> run <script>`. Never run `npm` or `yarn`,
  and never hand-edit `node_modules`. Respect the `pnpm-lock.yaml` lockfile; commit it.
- **The repo is a monorepo** with a workspace layout, typically:

  ```
  apps/        deployable apps (api, worker, web, plugins, …)
  packages/    shared libraries (contracts/types, config, ui, utils, …)
  pnpm-workspace.yaml   declares the workspace globs
  ```

- **Shared code lives in `packages/`** and is consumed by `apps/` via workspace deps
  (`"@scope/shared": "workspace:*"`), not by relative cross-app imports or copy-paste.
- **Each package owns its dependencies.** Every `package.json` must declare the npm deps it
  actually imports (don't rely on a dependency being hoisted from another package), or
  bundlers like Rollup/Vite can fail to resolve them.
- **Run scripts with filters.** Prefer `pnpm --filter <pkg> run <script>` (or
  `pnpm -r run <script>` for all packages) over `cd`-ing into a directory.
- **Watch for cross-package pitfalls** in tooling: dedupe singletons like `react` /
  `react-dom` in bundler config when workspace symlinks cause "multiple instances"
  errors; ensure shared `tsconfig`/ESLint base configs live in a `packages/config`-style
  package and are extended, not duplicated.

**Why:** consistent tooling across every project, real code sharing instead of duplication,
fast installs, and a strict node_modules layout that surfaces missing-dependency bugs early.

---

## TL;DR

| Phase | Rule | Output |
|-------|------|--------|
| **Stack** | pnpm workspace monorepo by default | `apps/*` + `packages/*`, `pnpm`/`pnpm --filter`, committed `pnpm-lock.yaml` |
| **Before** | Write a task document first | `docs/tasks/TASK-<slug>.md` with: current scenario, planned changes (file by file), why, affected-files table |
| **During** | Use CLIs / generators / SDKs instead of writing everything by hand | Canonical, reproducible output; the agent's dedicated tools over improvised shell |
| **After** | Update all affected documentation | `CLAUDE.md`, `docs/*.md`, `README.md` (root + per app), `.env.example` + deploy docs, dated ADR notes |

**The loop:** plan → align → build with tooling → document → done.
