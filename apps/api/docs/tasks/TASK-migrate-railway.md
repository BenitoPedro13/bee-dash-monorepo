# TASK: Migrate hosting from AWS to Railway (Postgres + S3 uploads + secret rotation)

## 1. Cenário actual

The API currently runs on an **AWS VM**, started via `forever start` (`package.json`
script `forever:start`), talking to an **AWS Lightsail-managed Postgres**
(`DB_HOST=ls-...cfqeucsyseiq.us-east-1.rds.amazonaws.com`, referenced from `.env`).

**Uploads are on local disk, not S3, despite S3 deps being present:**
- `src/attachments/attachments.controller.ts:31-45` — `FileInterceptor('file', { storage:
  diskStorage({ destination: './files', ... }) })`. Files land on the VM's local
  filesystem.
- `src/csvs/csvs.service.ts:40-52` (`processCsv`) — `fs.mkdirSync` + `fs.writeFile` into
  the same `./files` folder for CSV performance imports.
- `src/csvs/csvs.service.ts:364-378` (`getAllData`) — reads the CSV back with
  `createReadStream(filePath)` from that same local folder.
- `src/main.ts:44-46` + `src/app.module.ts` (`ServeStaticModule.forRoot`) serve
  `./files` back out at `/public`.
- `@aws-sdk/client-s3` and `aws-sdk` are both `package.json` dependencies, and
  `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_BUCKET_NAME` exist in `.env`,
  but **no code in `src/` calls S3** — they're dead weight today. This matters because
  **Railway's filesystem is ephemeral per-deploy**: anything written to `./files` after
  a deploy is gone on the next one.
- `files/` also has 171+ real files committed straight into git (mostly one-off test
  uploads, some real creator/campaign images).

**Leaked credentials (found and partially remediated this session):**
- `.env` was tracked in git for 4 commits and pushed to the **public** GitHub repo
  `BenitoPedro13/bee-dash-nestjs`, containing: the AWS access key/secret, the Lightsail
  Postgres password, the JWT signing secret, and a second (DigitalOcean) Postgres
  password.
- `bee-dash-nodejs_bucket.csv` duplicated the same AWS key/secret and was also tracked.
- **Done already:** the leaked AWS key was deactivated by the user (confirmed dead via
  `aws sts get-caller-identity` → `InvalidClientTokenId`); `.env` and
  `bee-dash-nodejs_bucket.csv` have been `git rm --cached`'d (staged, not yet committed);
  `.gitignore` now also ignores `bee-dash-nodejs_bucket.csv`; a secret-free
  `.env.example` was created.
- **Not yet done:** the DB password and JWT secret in that same leaked `.env` are still
  the live ones in `AuthModule`/`AuthGuard` (`process.env.JWT_SECRET`,
  `src/auth/auth.module.ts:16`) — moot for the DB password once the old Lightsail
  Postgres is retired, but the JWT secret should be rotated regardless since any token
  ever signed with it (or forged with it) remains valid until it changes.

**Other things that don't carry over cleanly to Railway:**
- `.env`'s `DATABASE_URL=${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@...` relies on
  shell-style `${VAR}` expansion. Plain `dotenv` (no `dotenv-expand` dependency) does
  **not** perform that expansion — this only worked because the AWS VM's real shell
  environment (not the committed `.env` file's composition) supplied the final value.
  Railway's Postgres plugin exposes a single ready-made `DATABASE_URL`; that's what we
  should consume directly.
- `NODE_TLS_REJECT_UNAUTHORIZED=0` is set globally in `.env`, disabling TLS certificate
  verification for the whole process — a workaround for the old Lightsail Postgres
  cert. Should be dropped on Railway's managed Postgres.
- `externDB/` (DigitalOcean Postgres connector, `EXTERNAL_DB_*` env vars) is dead code
  — only referenced via a commented-out import in `src/csvs/csvs.service.ts:16`. Not
  part of the live request path; not needed on Railway.
- No `Dockerfile` / `railway.json` / `nixpacks.toml` / `Procfile` exists, and
  `package.json` has no `engines` field pinning a Node version. Railway's Nixpacks
  builder would auto-detect a build/start command, but `npm start` runs `nest start`
  (dev-mode watcher), not the production build — needs an explicit start command.

**Decisions already confirmed with the user for this migration:**
- File storage → real **AWS S3 bucket** (not a Railway Volume) — matches the existing
  (currently unused) `aws-sdk` deps.
- The existing 171+ files in `files/` → **not migrated**; mostly test data, only new
  uploads need to work going forward. `files/` will stop being tracked in git.
- Database → **fresh Railway Postgres, no data migration** from the old
  AWS/Lightsort/Lightsail instance (current data is test/seed data, not production
  traffic).

## 2. Mudanças planeadas

| Step | What changes |
|------|--------------|
| Git hygiene | Commit the already-staged removal of `.env` / `bee-dash-nodejs_bucket.csv` from tracking; also `git rm -r --cached files/` and add `files/` to `.gitignore` (stop tracking upload data entirely — new uploads live in S3). |
| `src/s3/s3.module.ts`, `src/s3/s3.service.ts` (new) | A small shared module wrapping `@aws-sdk/client-s3`: `upload(buffer, key, contentType)`, `getObjectStream(key)`, `getPublicUrl(key)`. Reads `AWS_REGION` / `AWS_BUCKET_NAME` / credentials from env. Both attachments and CSV imports use this instead of duplicating S3 calls. |
| `src/attachments/attachments.controller.ts` | Swap `diskStorage` for Multer's `memoryStorage()`; after `S3Service.upload(...)`, store the returned S3 key/URL on the `Attachments` row instead of assuming a local path. |
| `src/csvs/csvs.service.ts` | `processCsv()`: replace `fs.mkdirSync`/`fs.writeFile` with `S3Service.upload(...)`. `getAllData()`: replace `createReadStream(filePath)` with `S3Service.getObjectStream(uniqueFilename)` piped into `csv-parser`. |
| `src/main.ts` / `src/app.module.ts` | Drop (or scope down) `app.useStaticAssets` / `ServeStaticModule.forRoot` for `./files` — new uploads are served from S3 URLs, not the app process. Open question below on what to do about links to the 171 old local files that stay unmigrated. |
| `package.json` | Add `"engines": { "node": "20.x" }` so Railway's Nixpacks build uses a pinned, known-good Node version. |
| `railway.json` (new) | Explicit `build` (`npm ci && npm run build` — already runs `prisma generate && nest build`) and `start` (`node dist/src/main.js`, i.e. the existing `start:prod` script) commands, so Railway doesn't fall back to `nest start` dev mode. |
| `.env.example` (done) | Already rewritten to list `DATABASE_URL` (consumed directly, no `${VAR}` composition), `JWT_SECRET`, `AWS_*`, `PORT`, `NODE_ENV` — drops `EXTERNAL_DB_*`, `DB_SSL`, `NODE_TLS_REJECT_UNAUTHORIZED`. |
| Railway project (via `railway` CLI) | `railway init`/`link`, add a Postgres plugin (`railway add`), set env vars (`railway variables set ...` — new `JWT_SECRET`, new `AWS_*` once the bucket/IAM user exist, `DATABASE_URL` auto-injected by the Postgres plugin), deploy (`railway up`), then `railway run npx prisma migrate deploy` (or as part of the build) against the fresh DB. |
| `README.md` | Replace the generic Nest starter boilerplate with a real description of Bee Dash API, setup, and the Railway deploy flow. |
| `CLAUDE.md` | Done — section 0 rewritten to describe this project and the in-flight migration instead of the copied Red & White Club content. |

**Rejected alternative:** Railway Volume instead of S3 — simpler (no AWS account
juggling) but doesn't survive multi-replica scaling and doesn't give a clean public URL
for images without also running the app as the file server. Rejected per user's stated
preference to keep using the existing S3 deps.

## 3. Porquê

- **AWS → Railway**: stated goal — moving off the AWS VM (`forever` process manager) to
  a managed platform.
- **Real S3 wiring, not just provisioning a bucket**: Railway containers don't persist
  local disk across deploys. Provisioning a bucket without also changing
  `attachments.controller.ts` / `csvs.service.ts` would silently break every upload the
  first time the service redeploys.
- **Secret rotation**: `.env` (AWS key, DB password, JWT secret) sat in a **public**
  GitHub repo across 4 commits. The AWS key is confirmed dead; the JWT secret should be
  rotated too since it's public regardless of whether the app is being redeployed — a
  new one costs nothing and invalidates every token anyone could forge with the leaked
  value. The DB password point is moot once the old Postgres is retired (fresh Railway
  Postgres, new password issued by the Postgres plugin).
- **Explicit build/start config + `engines`**: without it, Railway's auto-detected start
  command would run the app in `nest start` dev/watch mode in production.
- **Drop dead code paths from the docs, not the repo** (`externDB/`, unused S3 deps
  becoming used): keeps `CLAUDE.md` honest per the project's own doc-sync rule, since a
  stale "these deps are unused" note would now be wrong.

## 4. Ficheiros afectados

| File | Change type | Notes |
|------|-------------|-------|
| `.env` (tracked copy) | removal | already staged via `git rm --cached` |
| `bee-dash-nodejs_bucket.csv` | removal | already staged via `git rm --cached` |
| `.gitignore` | edit | already done (adds `bee-dash-nodejs_bucket.csv`); needs one more edit to also ignore `files/` |
| `files/*` (171+ files) | removal (git tracking only) | `git rm -r --cached files/`; files stay on disk locally, not migrated to S3 per decision |
| `.env.example` | new | already created |
| `src/s3/s3.module.ts` | new | shared S3 client wrapper |
| `src/s3/s3.service.ts` | new | `upload` / `getObjectStream` / `getPublicUrl` helpers |
| `src/attachments/attachments.controller.ts` | edit | `diskStorage` → `memoryStorage` + S3 upload |
| `src/attachments/attachments.service.ts` | edit | only if the create DTO/shape needs to change to store an S3 key vs local filename |
| `src/csvs/csvs.service.ts` | edit | `processCsv`/`getAllData` switch from local `fs` to `S3Service` |
| `src/main.ts` | edit | remove/scope `app.useStaticAssets` for `./files` |
| `src/app.module.ts` | edit | remove/scope `ServeStaticModule.forRoot` for `./files` |
| `package.json` | edit | add `engines.node` |
| `railway.json` | new | explicit build/start commands |
| `README.md` | edit | replace Nest boilerplate with real project + deploy docs |
| `CLAUDE.md` | edit | done |
| `docs/tasks/TASK-migrate-railway.md` | new | this document |

## 5. Open questions (need your input before I execute)

1. **New AWS credentials**: I don't have a working AWS CLI session (the profile in
   `~/.aws/credentials` is also dead — same `InvalidClientTokenId`). You'll need to
   either (a) create a new IAM user/access key scoped to S3 (console or `aws configure`
   with valid creds so I can drive it via CLI), and confirm the bucket name
   (`bucket-bee-dash` reuse, or a new one), or (b) hand me a working profile.
2. **Old local files (171+)**: since they're not being migrated, do their existing
   `/public/...` links (already shared with anyone, e.g. embedded in the frontend or
   sent to users) need to keep working for some grace period, or is it fine if they
   404 once we cut over? This decides whether `ServeStaticModule` for `./files` gets
   removed outright or kept read-only for a while.
3. **Old AWS VM + Lightsail Postgres**: once Railway is live, do you want them
   decommissioned (stop `forever`, terminate the Lightsail DB) right away, kept as a
   fallback for a few days, or left running for some other reason?
4. **Custom domain / DNS**: is there a custom API domain currently pointed at the AWS
   VM (vs. hitting it by IP or an AWS-generated hostname) that needs to be repointed to
   Railway once it's live?
