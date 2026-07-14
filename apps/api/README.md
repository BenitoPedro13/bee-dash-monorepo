<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

**Bee Dash API** — backend for the Bee Company creator/influencer-marketing performance
dashboard. It tracks brand **campaigns**, the **creators/influencers** in them (Instagram
+ TikTok), their **posts** and per-post performance metrics, grouped into **posts-packs**
(a priced bundle of posts a creator delivers for a campaign), plus **categories**,
**attachments**, and campaign **CSV performance imports**. Built with [NestJS](https://nestjs.com/)
10 + [Prisma](https://www.prisma.io/) 5 + PostgreSQL. Auth is a custom `AuthGuard` + JWT
(`@nestjs/jwt`), not a third-party auth provider. Deployed on [Railway](https://railway.com/).

See `CLAUDE.md` for the full architecture/conventions rundown and
`docs/tasks/TASK-migrate-railway.md` for the AWS → Railway migration history.

## Installation

```bash
$ pnpm install
```

Copy `.env.example` to `.env` and fill in real values for local development (a local
Postgres `DATABASE_URL`, a `JWT_SECRET`, and bucket credentials if you need file uploads
to work locally — see below).

## File storage

Uploads (attachments, CSV performance imports, creator/campaign/profile images) go to an
S3-compatible bucket via `src/s3/s3.service.ts`, not local disk — Railway's filesystem
doesn't persist across deploys. Files are served back at `/public/:key`
(`src/s3/s3.controller.ts`), which streams the object from the bucket, so existing
`/public/<uniqueFilename>` links keep working unchanged for consumers.

In production this is Railway's own object-storage bucket
(`railway bucket credentials --bucket <name>` for the S3-compatible endpoint/keys). Any
S3-compatible provider works locally — set `AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`, `AWS_REGION` in `.env`.

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Database

Prisma owns the schema. After changing `prisma/schema.prisma`:

```bash
$ pnpm run prisma:migrate   # create + apply a migration locally
$ pnpm run prisma:generate  # regenerate the Prisma Client
```

Production runs `npx prisma migrate deploy` automatically as part of the Railway start
command (see `railway environment config`), applying any new migrations on every deploy.

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment (Railway)

The app is deployed on Railway, connected directly to this repo's `main` branch (no CI
gate — pushing to `main` triggers a build+deploy). Build/start commands and environment
variables are configured on the Railway service itself (not in a repo file):

```bash
railway environment config --json   # inspect current build/start/variables config
```

Key pieces:
- **Postgres**: a Railway-managed Postgres plugin; the app service's `DATABASE_URL`
  references it directly (`${{Postgres.DATABASE_URL}}`), no manual composition from parts.
- **Bucket**: a Railway object-storage bucket wired via the `AWS_*` variables described
  above.
- **Custom domain**: `api.thatsbee.co`, proxied to the app's internal port `3000` (the
  domain's `targetPort` must match whatever port `src/main.ts` listens on).
- **JWT_SECRET**: rotated as part of the Railway migration; not the same value that was
  ever committed to git history.

## License

Nest is [MIT licensed](LICENSE).
