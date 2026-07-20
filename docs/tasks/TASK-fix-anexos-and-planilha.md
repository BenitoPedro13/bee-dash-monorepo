# TASK: Fix Anexos table, add multi-file upload, gate "Abrir Planilha"

## 1. Cenário actual

On the campaign detail page in `apps/web` (public dashboard), the "Anexos" (attachments)
table renders `undefined bytes` for file size and `NaN/NaN/aN NaN:NaN` for the "Data de
Envio" date on every row, and interacting with the table's sort headers makes rows
disappear. The upload button ("Enviar Anexo") only accepts one file at a time. The
"Abrir Planilha" button (opens the campaign's `Table URL`/`urlTable`, set in the admin
panel) is always rendered as clickable even when no URL has been set.

Root cause, confirmed via code inspection plus a live read-only `curl` against the
production API:

- **Decisive bug**: `apps/api/src/attachments/dto/create-attachment.dto.ts` still
  declares `userEmail: string`, left over from a schema refactor. The `Attachments`
  Prisma model (`apps/api/prisma/schema.prisma`) no longer has a `userEmail` column — it
  was replaced by `campaignId Int?`. `apps/api/src/attachments/attachments.controller.ts`'s
  `create()` still sets `createAttachmentDto.userEmail = req.user.email` and passes the
  DTO straight into `prisma.attachments.create()`. **Every attachment upload currently
  throws `PrismaClientValidationError: Unknown argument userEmail` and returns HTTP
  500.** NestJS's default exception filter still returns a JSON error body for that.
  `apps/web/src/components/FileUploadButton.tsx`'s `uploadFile()` does
  `const res: Attachment = await response.json()` **without checking `response.ok`** —
  the only fetch call in the codebase that skips this guard (contrast with
  `store.ts`'s `fetchAttachment`/`fetchData`). The 500's error body gets blindly cast to
  `Attachment` and unshifted into table state, and rendering `data.fileSize`/
  `data.updatedAt` off that error object produces exactly `"undefined bytes"` (template
  literal interpolation of `undefined`) and, via `parseUpdatedAt`'s
  `new Date(undefined)` → Invalid Date → `"NaN".slice(-2)` → `"aN"`, exactly
  `NaN/NaN/aN NaN:NaN`.
- **Second bug**: even once `userEmail` is fixed, uploads still don't attach to a
  campaign — `CreateAttachmentDto` has no `campaignId`, the controller never sets one,
  the frontend never sends one. Verified live: the only 2 rows in production
  `Attachments` both have `campaignId: null`. Since the Anexos table is fetched via
  `GET /attachments/by-campaign/:id` (campaign-scoped), no upload can ever appear in the
  table it was uploaded to until this is wired through.
- **Third bug (state desync)**: `AttachmentsTable.tsx` passes `FileUploadButton` the
  *paginated* `currentAttachments`/`setCurrentAttachments` slice, not the full list or
  the Zustand global store — a newly-added item only patches the visible page slice, not
  the array the sort/paginate `useEffect` derives from, reproducing "vanishes when I
  interact with the table" once uploads start succeeding.
- **Issue 3 root cause**: `apps/web/src/components/CreatorsTable/CreatorsTable.tsx`
  renders `<Link href={campaigns[0]?.urlTable ?? "#"}>` — always a normal
  styled/clickable link (falls back to `href="#"`, still visually/behaviorally
  clickable), no disabled state, and hardcodes `campaigns[0]` (first campaign in the
  user's whole list) instead of resolving the campaign actually being viewed from the
  route.

## 2. Mudanças planeadas

**Backend (`apps/api`):**

| File | Change |
|---|---|
| `apps/api/src/attachments/dto/create-attachment.dto.ts` | Remove dead `userEmail: string`; add `campaignId?: number`. |
| `apps/api/src/attachments/attachments.controller.ts` | Stop setting `userEmail` on the DTO; coerce+set `campaignId` (arrives as a multipart string) as a number; drop the now-unused `@Req() req` param. |
| `apps/api/src/attachments/attachments.service.ts` | No change expected — `create()` already does `data: createAttachmentDto`, which works once the DTO shape matches the Prisma model. |

**Frontend (`apps/web`):**

| File | Change |
|---|---|
| `apps/web/src/store.ts` | Add `addAttachments(newAttachments: Attachment[])` action, prepending to the global `attachments` array — the single write path for "an upload succeeded." Add `campaignId?: number \| null` to the `Attachment` type. |
| `apps/web/src/components/FileUploadButton.tsx` | Rewrite: resolve `campaignId` itself via `useParams()`/`getParam()` (no longer prop-driven); `<input>` gains `multiple`; `handleFileChange` reads all selected files; `uploadFile()` sends `campaignId` in `FormData` and checks `response.ok` before parsing, throwing on failure instead of trusting the body; new `uploadFiles()` fans out via `Promise.allSettled`, batches successes into one `addAttachments()` call, surfaces per-file failures inline (small local error text, no new toast infra). |
| `apps/web/src/components/AttachmentsTable/AttachmentsTable.tsx` | Render `<FileUploadButton />` with no props; fix the sort `useEffect` to not mutate state in place and to use a null-safe comparator for all three sortable columns. |
| `apps/web/utils/utils.ts` | `parseUpdatedAt` returns `"—"` instead of `NaN/NaN/aN NaN:NaN` for missing/invalid input; new exported `compareNullable` helper for null-safe sorting. |
| `apps/web/src/components/AttachmentsTable/AttachmentsTableRow.tsx` | `formatFileSize` returns `"—"` for nullish input; "Data de Envio" cell switches from `data.updatedAt` to `data.createdAt` (matches what the column header already sorts by, and "date sent" semantically means creation date). |
| `apps/web/src/components/CreatorsTable/CreatorsTable.tsx` | Resolve the campaign being viewed from the route (mirrors `apps/web/src/app/campaigns/[campaignId]/page.tsx`'s existing pattern); render the real `<Link>` only when `urlTable` is truthy, otherwise a visually-disabled non-interactive button with a tooltip. |

## 3. Porquê

Issue 1 isn't cosmetic — it's a complete upload outage caused by a DTO left out of sync
with a Prisma schema migration (`userEmail` relation → `campaignId` relation). Fixing
only the frontend's rendering would hide the symptom without restoring the feature;
`userEmail` must be removed and `campaignId` threaded through for uploads to actually
work and land in the right campaign's table. The state-desync fix directly explains "if
I filter [sort], all anexos disappear." Issue 2 (multi-upload) reuses the same corrected
upload path instead of duplicating logic. Issue 3 is an independent, small UX
correctness fix: a button that looks clickable but does nothing (or opens the wrong
campaign's sheet) is worse than one that's visibly disabled with an explanatory tooltip.

## 5. Follow-up (2026-07-19): multi-upload not live yet + missing delete action

After the first pass deployed to `apps/api` only (Railway auto-deploy on push), the user
tested against the still-live *old* `apps/web` build (not yet redeployed to Vercel) and
reported: single-file upload now works (the 500 fix alone was enough for the old
single-file code path to succeed), but multi-file selection still didn't work (expected —
that code hadn't been deployed yet), and there was no way to delete an attachment at all.

Delete was genuinely missing, not just undeployed: `apps/api/src/attachments/attachments.controller.ts`'s
`DELETE /attachments/:id` route existed but had `@UseGuards(AuthGuard)` commented out (an
unauthenticated delete-by-id endpoint) and `AttachmentsService.remove()` only deleted the
Prisma row, never the underlying S3 object (`s3Service.upload` is called on create but no
matching `s3Service.delete` on remove — confirmed `S3Service.delete(key)` exists and is
used nowhere in `attachments.service.ts`). There was also no delete button anywhere in
`apps/web`'s Anexos table — only a Download link.

**Changes:**

| File | Change |
|---|---|
| `apps/api/src/attachments/attachments.controller.ts` | Re-enable `@UseGuards(AuthGuard)` on `remove()` — closes an unauthenticated delete-by-id gap. |
| `apps/api/src/attachments/attachments.service.ts` | Inject `S3Service` (already `@Global()`-exported, no module wiring needed); `remove()` now looks up the row first, deletes the matching S3 object via `s3Service.delete(uniqueFilename)`, then deletes the Prisma row — avoids orphaned S3 storage. |
| `apps/web/src/store.ts` | Add `removeAttachment(id: number)` action, filtering the deleted id out of the global `attachments` array. |
| `apps/web/src/components/AttachmentsTable/AttachmentsTableRow.tsx` | Add a delete (trash icon) button next to Download: `window.confirm`, `DELETE ${baseApiUrl}/attachments/:id` with the auth cookie, then `removeAttachment()` on success. |

**Why:** delete is a basic, expected capability for an attachment list and was simply
never built; fixing the missing `AuthGuard` and adding the S3 cleanup while wiring this up
is the same-sized change as doing it without those fixes, and leaving either gap open
(unauthenticated delete, or leaking storage on every delete) would be shipping a new
security/cost bug alongside a bug fix.

## 4. Ficheiros afectados

| File | Change type | Notes |
|------|-------------|-------|
| `apps/api/src/attachments/dto/create-attachment.dto.ts` | edit | remove dead `userEmail`, add `campaignId?: number` |
| `apps/api/src/attachments/attachments.controller.ts` | edit | stop setting `userEmail`, coerce+set `campaignId`, drop unused `req`, re-enable `AuthGuard` on delete |
| `apps/api/src/attachments/attachments.service.ts` | edit | `remove()` now also deletes the S3 object |
| `apps/web/src/store.ts` | edit | add `addAttachments`/`removeAttachment` actions, add `campaignId` to `Attachment` type |
| `apps/web/src/components/FileUploadButton.tsx` | edit | multi-file input, `response.ok` guard, `campaignId` via route, store-driven state |
| `apps/web/src/components/AttachmentsTable/AttachmentsTable.tsx` | edit | drop prop-drilling to `FileUploadButton`, non-mutating null-safe sort |
| `apps/web/utils/utils.ts` | edit | null-safe `parseUpdatedAt`, new `compareNullable` helper |
| `apps/web/src/components/AttachmentsTable/AttachmentsTableRow.tsx` | edit | null-safe `formatFileSize`, fix date field to `createdAt`, add delete button |
| `apps/web/src/components/CreatorsTable/CreatorsTable.tsx` | edit | resolve campaign from route, disable button when no `urlTable` |
