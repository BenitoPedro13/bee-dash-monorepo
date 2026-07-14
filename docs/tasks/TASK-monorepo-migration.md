# TASK: Merge the 3 Bee Dash repos into one pnpm-workspace monorepo

> **Status (2026-07-14): DONE.** `bee-dash-monorepo` is live with full history for all 3
> apps (`git filter-repo --to-subdirectory-filter` + merge, not squashed). Railway
> (`apps/api`) and both Vercel projects (`apps/web`, `apps/admin`) redeploy automatically
> on push to `main` — Root Directory set on each service/project, verified with real
> deploys. `bee-dash-nestjs`/`-nextjs`/`-refine` are archived on GitHub (not deleted).
> Two real bugs were found and fixed along the way, not just plumbing: (1) `apps/web` and
> `apps/admin` hardcoded their API URL to `api1.thatsbee.co`, a stale DNS record for the
> deleted AWS account — repointed to `https://api.thatsbee.co`; (2) pnpm's stricter
> resolution exposed a phantom peer-dependency bug in `apps/admin` (`@refinedev/core`
> peer-wants `@tanstack/react-query@^4.10.1`, but nothing pinned it so pnpm auto-installed
> `5.101.2`, crashing the admin panel client-side) — fixed by declaring
> `@tanstack/react-query@^4.44.0` directly in `apps/admin/package.json`. See §6 for the
> full list of what shipped vs. the original plan below (kept for history).

## 1. Cenário actual

Bee Dash today is **three separate git repos**, siblings on disk under
`~/Documents/work/mainnet/`, each with its own GitHub remote and independent history:

| Repo | Role | Package manager | Deploy | Node |
|------|------|------------------|--------|------|
| `bee-dash-nestjs` (this repo) | API | pnpm (single-package workspace, `pnpm-workspace.yaml` → `packages: ['.']`) | **Railway**, project `bee-dash`, service `bee-dash-nestjs`, auto-deploys from GitHub `BenitoPedro13/bee-dash-nestjs` on push to `main`. Live at `https://api.thatsbee.co`. | `22.x` (pinned, `packageManager: pnpm@11.5.2`) |
| `bee-dash-nextjs` | Public creator/campaign dashboard | npm (`package-lock.json`) | Unknown from repo — no `vercel.json`/`.vercel/`, likely a Vercel project linked via dashboard, not a repo file. Needs confirming. | not pinned (no `engines`) |
| `bee-dash-refine` | Admin panel (Refine + antd) | npm (`package-lock.json`); has a `Dockerfile` (`refinedev/node:18` base) | Unknown from repo — same as above, needs confirming. **Admin login is currently broken** (user-confirmed, pre-existing, unrelated to this task). | `>=18.0.0` |

Notable findings from inspection:

- `bee-dash-nestjs` has **no uncommitted work of consequence** except two tracked files
  mid-edit (`README.md`, `docs/tasks/TASK-migrate-railway.md`) — will be committed before
  any subtree operation so nothing is lost.
- `bee-dash-nextjs` and `bee-dash-refine` are both clean (`git status` empty), but stale —
  last real commits Nov 2024.
- **Both frontends hard-code the API base URL to `https://api1.thatsbee.co`** (in
  `bee-dash-nextjs/src/store.ts` and `bee-dash-refine/src/providers/data-provider/index.ts`),
  not `https://api.thatsbee.co`, which is the domain actually live on Railway per
  `docs/tasks/TASK-migrate-railway.md`. `api1.thatsbee.co` was very likely the old AWS VM's
  domain — and the AWS account has since been **fully deleted** (per that same doc). This
  is almost certainly why the admin panel (and possibly the public dashboard) can't reach
  the API at all right now. Flagged here because it's directly relevant context, but fixing
  it is **out of scope for this task** — call it out as a fast follow once the monorepo is
  in place and each app is easy to touch again.
- Neither frontend reads the API URL from an env var — both hard-code it as a source
  constant. Worth normalizing to `NEXT_PUBLIC_API_URL` while these files are being touched
  anyway (see open question 4).
- `bee-dash-nestjs`'s own `pnpm-workspace.yaml` currently declares itself as the workspace
  root (`packages: ['.']`). That file cannot simply move as-is into `apps/api/` once a
  *parent* `pnpm-workspace.yaml` exists at the new monorepo root — see open question 1.
- `git log`/`git filter-repo` history in `bee-dash-nestjs` was already rewritten once this
  session (secret scrubbing, force-pushed) with a full backup bundle at
  `../bee-dash-nestjs-backup-2026-07-14.bundle` — unrelated to this task, but means this
  repo's history is already the "clean" version we'd be carrying into the monorepo.
- No `gh` CLI is installed on this machine (checked `which gh`, `brew list gh`) — needed to
  create the new GitHub repo and later archive the old 3. `railway` CLI **is** installed and
  authenticated, already linked to the `bee-dash` project/service.

## 2. Mudanças planeadas

New sibling directory: **`~/Documents/work/mainnet/bee-dash-monorepo/`** (new, separate git
repo — not nested inside any of the 3 existing ones).

| Step | Detail |
|------|--------|
| 0. Pre-flight | Commit the 2 pending changes in `bee-dash-nestjs` (`README.md`, `docs/tasks/TASK-migrate-railway.md`) so the repo is fully clean before it becomes a subtree source. |
| 1. Scaffold new repo | `git init bee-dash-monorepo`; root `package.json` (private, workspace scripts only, no real deps); root `pnpm-workspace.yaml` with `packages: ['apps/*', 'packages/*']`; root `.gitignore` (node_modules, dist/.next/build output, `.env*` except `.env.example`); initial commit. |
| 2. Pull in history via `git subtree` | For each of the 3 repos, `git remote add <name> <local-path>` then `git subtree add --prefix apps/<api\|web\|admin> <name> main` (no `--squash`, so full commit history is preserved and `git log`/`git blame` keep working inside the subdirectory). Order: `apps/api` (nestjs) → `apps/web` (nextjs) → `apps/admin` (refine). |
| 3. Reconcile `bee-dash-nestjs`'s workspace file | Delete `apps/api/pnpm-workspace.yaml` (superseded by the root one) and `apps/api/pnpm-lock.yaml` (superseded by one root lockfile). Confirm `allowBuilds` entries (`@nestjs/core`, `@prisma/client`, `@prisma/engines`, `prisma`) move into the **root** `pnpm-workspace.yaml`, since Prisma's postinstall generate step needs them wherever pnpm resolves the workspace root. |
| 4. Migrate `apps/web` and `apps/admin` off npm | Delete each `package-lock.json`; run `pnpm install` from the monorepo root so both land in the single root `pnpm-lock.yaml`; fix any dependency-resolution breakage (peer deps, hoisting) that npm was silently tolerating. Verify each still builds (`pnpm --filter web run build`, `pnpm --filter admin run build`) before moving on. |
| 5. Root scripts | Root `package.json` gets convenience scripts: `dev:api`, `dev:web`, `dev:admin` (each `pnpm --filter <app> run dev`), and `build` (`pnpm -r run build`). No Turborepo — not needed at this scale (3 apps, no shared `packages/` yet). |
| 6. Per-app env files | Each app keeps its **own** `.env` / `.env.example` inside `apps/<name>/` (API creds, DB URL, S3/bucket vars for the API; API base URL for the two frontends) — not hoisted to root, since the three apps deploy independently and have no overlapping vars today. |
| 7. Reconnect Railway | The `bee-dash-nestjs` Railway service is currently source-linked to GitHub `BenitoPedro13/bee-dash-nestjs`. Once `bee-dash-monorepo` is pushed, reconnect that Railway service's source to the new repo and set its **Root Directory** to `apps/api` (`railway` CLI / dashboard). **Verify a real deploy succeeds and `https://api.thatsbee.co` still serves `GET /` before touching anything else** — this is the one step with real production blast radius. |
| 8. Frontend deploy targets | Still need to confirm *how* `bee-dash-nextjs`/`bee-dash-refine` are currently deployed (Vercel dashboard-linked project, most likely) — once confirmed, repoint those Vercel projects at `bee-dash-monorepo` with root directories `apps/web` / `apps/admin` respectively. Blocked on open question 3 below. |
| 9. New GitHub repo | Create `BenitoPedro13/bee-dash-monorepo` (needs `gh` CLI — `brew install gh` first, or done manually via github.com if the user prefers) and push. |
| 10. Archive old repos | Once Railway (and the two Vercel projects, once reconnected) are confirmed working from the new monorepo, archive (not delete) `bee-dash-nestjs`, `bee-dash-nextjs`, `bee-dash-refine` on GitHub. Local sibling folders left alone (or removed later, user's call). |
| 11. Docs | New root `README.md` describing the monorepo layout and linking each app's own README. Update `bee-dash-nestjs`'s `CLAUDE.md` §0/§4 (it already *describes* the pnpm-monorepo convention as the default — this makes it actually true) — the updated `CLAUDE.md` moves to the monorepo root and should get a short top section explaining the 3-app layout. `docs/tasks/` (including this file and `TASK-migrate-railway.md`) moves with `apps/api` since it's app-specific history. |

**Rejected alternative:** copy-paste file trees into the new structure with one fresh
commit (no subtree). Simpler, but throws away `git blame`/`git log` for all 3 apps' prior
history in the repo that becomes canonical going forward — rejected per your call to
preserve history.

## 3. Porquê

- Matches the pnpm-workspace-monorepo convention `CLAUDE.md` §4 already documents as the
  project default — today that section describes an aspiration, not this repo's actual
  layout (§0's "locked decisions" explicitly say *no monorepo, npm not pnpm* for the
  current single-repo API — this task supersedes that).
- The three apps are one product (Bee Dash) split across repos for no strong reason today;
  a monorepo makes cross-app changes (e.g. an API contract change touching both frontends)
  a single PR instead of three coordinated ones across three repos.
- You confirmed doing all three now rather than API-only, since the admin panel is already
  broken and not in active use — lower cost to move it while it's not serving traffic than
  to come back later.
- `git subtree` (vs. a fresh-history copy) keeps the AWS→Railway migration history,
  the secret-leak/rotation history, and normal feature history all queryable in place.

## 4. Ficheiros afectados

| File | Change type | Notes |
|------|-------------|-------|
| `bee-dash-nestjs/README.md`, `docs/tasks/TASK-migrate-railway.md` | edit (commit pending) | pre-flight cleanup, this repo only |
| `bee-dash-monorepo/` (new repo, new dir) | new | git-initialized, separate from all 3 existing repos |
| `bee-dash-monorepo/package.json` | new | root workspace scripts |
| `bee-dash-monorepo/pnpm-workspace.yaml` | new | `packages: ['apps/*', 'packages/*']` + merged `allowBuilds` |
| `bee-dash-monorepo/.gitignore` | new | root-level ignore rules |
| `bee-dash-monorepo/apps/api/**` | new (via `git subtree`, history preserved) | current `bee-dash-nestjs` contents |
| `bee-dash-monorepo/apps/api/pnpm-workspace.yaml` | removal | superseded by root |
| `bee-dash-monorepo/apps/api/pnpm-lock.yaml` | removal | superseded by root lockfile |
| `bee-dash-monorepo/apps/web/**` | new (via `git subtree`, history preserved) | current `bee-dash-nextjs` contents |
| `bee-dash-monorepo/apps/web/package-lock.json` | removal | migrated to pnpm |
| `bee-dash-monorepo/apps/admin/**` | new (via `git subtree`, history preserved) | current `bee-dash-refine` contents |
| `bee-dash-monorepo/apps/admin/package-lock.json` | removal | migrated to pnpm |
| `bee-dash-monorepo/README.md` | new | monorepo overview |
| `bee-dash-monorepo/CLAUDE.md` | new (moved + edited from `bee-dash-nestjs/CLAUDE.md`) | §0/§4 updated to describe the real 3-app layout |
| Railway service `bee-dash-nestjs` | config change (via `railway`/dashboard) | source repo + root directory repointed to `apps/api` |
| Vercel project(s) for web/admin | config change (via dashboard, TBC) | pending open question 3 |
| GitHub | new repo + 3 archived repos | `bee-dash-monorepo` created; old 3 archived once verified |

## 5. Open questions — resolved

1. **`pnpm-workspace.yaml` + Railway "Root Directory" interaction**: unresolved by design —
   will be tested live against the real Railway service in step 7, not guessed at up front.
2. **`gh` CLI**: installed (was already present, `2.96.0`), not yet authenticated. You're
   running `gh auth login` yourself (interactive browser flow) — I'll proceed once that's
   confirmed done.
3. **Vercel linkage — resolved via `vercel project ls` / `vercel project inspect` /
   `vercel ls`**: both frontends are real Vercel projects (`vercel whoami` → `benitopedro13`,
   auto-authenticated via device flow this session):
   - `bee-dash-nextjs` → production `https://www.thatsbee.co`, `Root Directory: .`, Node 20.x.
   - `bee-dash-refine` → production `https://admin.thatsbee.co`, Node 20.x.
   - **Neither is Git-integrated.** `vercel ls bee-dash-nextjs` shows every deployment
     (newest ~610 days old) attributed to CLI user `benitopedro13`, not a `vercel[bot]`
     git-triggered deploy, and `vercel project inspect` shows no connected repository. They
     were pushed with `vercel --prod` directly from the local working copy, independent of
     git history — which also explains why both are stale (last real commit Nov 2024) yet
     "Updated" more recently (env var tweaks / manual redeploys since).
   - **Practical effect on step 8**: no GitHub-integration reconnect needed. After the
     subtree move, re-link each project from its new path (`vercel link` inside
     `apps/web`/`apps/admin`, reusing the existing project IDs) and set **Root Directory** to
     `apps/web` / `apps/admin` respectively if we ever do turn on git-based deploys later;
     for now, redeploy with `vercel --prod --cwd apps/web` (and `apps/admin`) same as today,
     just from the new path.
4. **`api1.thatsbee.co` → `api.thatsbee.co` fix**: confirmed — will open a follow-up task
   once this migration lands.
5. **Local sibling folders**: confirmed — leave `bee-dash-nestjs` / `bee-dash-nextjs` /
   `bee-dash-refine` on disk as-is, no deletion.

## 6. What actually shipped (differs from the plan above)

- **History merge used `git filter-repo --to-subdirectory-filter` + a real merge, not
  `git subtree add`.** Tried `subtree add` first — it does put full history in the repo's
  object graph (reachable via the merge commit's 2nd parent), but plain `git log`/`git
  blame` on files under `apps/*` came back empty (only the merge commit), which fails the
  actual goal ("commits, blame, and history carry over"). Fixed by making a
  `--no-local`-cloned, `filter-repo`-rewritten copy of each source repo first (paths
  rewritten to `apps/<name>/...` for every historical commit), then
  `git merge --allow-unrelated-histories` — `git log`/`git blame` walk straight through
  into pre-merge history this way.
- **Repo visibility: public** (matching 2 of the original 3 repos), after confirming no
  `.env`/credential-shaped files are tracked (the earlier `git filter-repo` secret scrub
  in `bee-dash-nestjs`'s own history carried over cleanly).
- **`gh` and `vercel` CLIs installed mid-task** (`brew install gh vercel-cli`) — `gh` was
  already present; `vercel-cli` wasn't. Both authenticated via their own device-code flows.
- **Railway's Root Directory build is isolated from the monorepo root** — confirmed the
  open question from §1: with Root Directory = `apps/api`, Railway's pnpm install can't
  see the root `pnpm-workspace.yaml`'s `allowBuilds`, so native postinstall scripts
  (`@nestjs/core`, `prisma`, `@prisma/client`, `@prisma/engines`) get silently blocked
  (`ERR_PNPM_IGNORED_BUILDS`). Fixed by keeping `apps/api`'s own `pnpm-workspace.yaml`
  (`packages: ['.']` + the same `allowBuilds`) alongside the root one, not deleting it as
  originally planned in §2 step 3.
- **Railway also security-scans the whole root `pnpm-lock.yaml`**, not just `apps/api`'s
  slice of it — a HIGH-severity CVE in `apps/web`/`apps/admin`'s pinned `next@14.2.13`
  blocked an `apps/api`-only deploy. Fixed by bumping `next` to `14.2.35` in both
  frontends (a real fix, not a scan bypass).
- **Vercel Root Directory isn't a CLI flag either** — same shape of gotcha as Railway.
  Set via a direct `PATCH https://api.vercel.com/v9/projects/{id}` call using the
  Vercel CLI's own locally-stored token (`~/Library/Application Support/com.vercel.cli/auth.json`),
  since `vercel project update` doesn't expose it.
- **Vercel ended up Git-integrated after all**, reversing the §2/step 8 plan (which
  assumed CLI-only `vercel --prod` deploys forever) — user asked for push-to-deploy once
  the manual CLI deploys worked. `vercel git connect <repo-url>` (per-project, from
  inside `apps/web`/`apps/admin`) + the Root Directory API call above; verified for real
  with an empty test commit producing a `-git-main-` deployment alias.
- **Two real, previously-latent bugs found and fixed**, beyond pure infrastructure
  plumbing:
  1. `apps/web`/`apps/admin` hardcoded their API base URL to `https://api1.thatsbee.co`
     — stale DNS for the AWS account deleted during the Railway migration (dead TLS
     cert). Repointed both to `https://api.thatsbee.co`.
  2. `apps/admin` crashed client-side after login (`defaultMutationOptions is not a
     function`, React error #419) — `@refinedev/core` peer-wants
     `@tanstack/react-query@^4.10.1`, nothing in `apps/admin/package.json` pinned it, so
     pnpm's peer auto-install grabbed `5.101.2` (silently violating the peer's own
     semver range — pnpm only warns, doesn't block). A `pnpm.overrides`/`pnpm-workspace.yaml`
     `overrides:` entry does **not** fix this, since overrides only affect real
     `dependencies`, not peer-driven auto-install. Fixed by declaring
     `@tanstack/react-query@^4.44.0` as a direct dependency in `apps/admin/package.json`.
  Also found two phantom dependencies (`axios`, `prop-types`, used directly in
  `apps/admin/src` but never declared) that only broke the build once pnpm's strict
  `node_modules` replaced npm's flat hoisting — declared explicitly.
- **Seeded real test data** against the live API (`test@thatsbee.co` / `Test1234!`,
  3 categories, 3 creators, 2 campaigns, posts with metrics) via direct `curl` POSTs —
  `apps/api`'s creation endpoints (`/users`, `/categories`, `/creators`, `/campaigns`,
  etc.) have no auth guard.
- **Old repos archived, not deleted** (`gh repo archive`) — reversible via
  `gh repo unarchive` if ever needed.
