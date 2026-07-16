# TASK: Auto-fill Post performance fields from an Instagram Insights screenshot

## Status: DONE (2026-07-16)

Shipped as planned, with one confirmed deviation (see §2's note on `AuthGuard`).
Verified: `apps/api` (`tsc --noEmit`, `nest build`) and `apps/admin` (`tsc --noEmit`,
`next build`, including `/posts/create` and `/posts/edit/[id]`) all build clean.
**Not verified live** — no `ANTHROPIC_API_KEY` or AWS S3 credentials were available in
the implementing session, so the actual Claude vision extraction quality (does it read
PT-BR Stories screenshots correctly, does multi-image reconciliation work as designed)
and the S3 upload path have not been exercised end-to-end. Before relying on this in
production: set `ANTHROPIC_API_KEY` in `apps/api`'s environment and run a real
`POST /insights-extraction/stories` against `docs/screenshots/stories-{1,2,3}.jpeg`,
and click through the admin UI at `/posts/create` with `type=STORIES` selected.

## 1. Cenário actual

Filling in a `Posts` row's performance metrics in `apps/admin` is 100% manual. The
create/edit forms (`apps/admin/src/app/posts/create/page.tsx:36-224`,
`apps/admin/src/app/posts/edit/[id]/page.tsx`, structurally identical) render nine
`InputNumber` fields the user must read off their phone's Instagram app and retype by
hand: `impressions`, `interactions` (disabled — server-computed), `likes`, `shares`,
`comments`, `saves`, `clicks` (disabled — server-computed), `stickerClicks`,
`linkClicks`, plus `type`, `postDate`, `socialNetworkId`, `postsPackId`.

Server side, `PostsService.create` (`apps/api/src/posts/posts.service.ts:13-52`) derives
two fields instead of trusting client input:
```ts
const finalClicks = linkClicks;
const finalInteractions = likes + shares + comments + saves + linkClicks + stickerClicks;
```
So only `impressions`, `likes`, `shares`, `comments`, `saves`, `stickerClicks`,
`linkClicks` are ever actually hand-typed; `interactions`/`clicks` just echo back a sum
the form already shows disabled.

Ten example screenshots were reviewed (`docs/screenshots/stories-{1,2,3}.jpeg`,
`docs/screenshots/reels-{1..7}.jpeg`) to see what Instagram's native Insights UI (PT-BR)
actually exposes per post type:

- **Stories** — a single scrollable "Visão geral" panel, no tabs. Exposes: Curtidas,
  Respostas, Compartilhamentos, Navegação (Avanço/Saiu/Voltar/Próximo story), Contas
  alcançadas, Interações (+ seguidor/não-seguidor split), Visualizações, Atividade do
  perfil (Visitas ao perfil, Seguidores/new-follows). **In practice this still needs
  more than one screenshot**: the three examples reviewed (`stories-1/2/3.jpeg`) are
  themselves three separate partial captures of one story taken while scrolling — the
  same fields (e.g. Interações, Visualizações) show up again across images, cropped
  differently each time. So "one screenshot is enough" does not hold in the field; users
  routinely upload 2–3 per story, and the feature has to expect that from v1, not add it
  later.
- **Reels** — data is split across three tabs (Visão geral / Engajamento / Público) plus
  a persistent action bar (Curtidas/Comentários/Reposts/Compartilhamentos/Salvamentos)
  and requires scrolling within each tab — the 7 example images are needed to cover a
  single reel. Also exposes per-tab: Tempo médio de visualização, retention curve, "O
  que afeta suas visualizações" (skip/share/like/save/comment rates), "Principais fontes
  das visualizações" (Feed/Aba Reels/Stories/Perfil/Explorar %), and full audience
  demographics (idade/país/gênero) — none of which has anywhere to live in the schema
  today, and none of which is in scope for this task.

Mapping screenshot labels → existing `Posts` columns (Stories, the only type in scope):

| Instagram label (PT-BR) | `Posts` field | In scope for v1 |
|---|---|---|
| Visualizações | `impressions` | yes |
| Curtidas | `likes` | yes |
| Respostas | `comments` | yes |
| Compartilhamentos | `shares` | yes |
| (not shown on Stories overview unless a link/sticker was used) | `stickerClicks`, `linkClicks` | yes, if present |
| Saves — Stories has no save/bookmark action, so this stays user-entered/0 | `saves` | n/a from screenshot |
| Contas alcançadas, Interações (top-level), Atividade do perfil, Visitas ao perfil, Seguidores (new), Navegação (Avanço/Saiu/Voltar/Próximo story) | *(no column exists)* | **no** — surfaced read-only, not persisted (explicit decision, see §3) |

There is no OCR/vision/LLM integration anywhere in the monorepo today (`apps/api`,
`apps/web`, `apps/admin` package.jsons have no `openai`/`anthropic`/`tesseract`/vision
deps) — this is a greenfield integration, not an extension of an existing one.

Two existing patterns this task reuses directly:
- **File upload idiom**: `AttachmentsController.create`
  (`apps/api/src/attachments/attachments.controller.ts:32-50`) — `FileInterceptor('file')`
  + `S3Service.upload(uniqueFilename, file.buffer, file.mimetype)`
  (`apps/api/src/s3/s3.service.ts:30-40`), fronted client-side by antd's
  `<Upload beforeUpload={...}>` + `FormData` + `axios.post(..., multipart/form-data)`
  (established e.g. in `apps/admin/src/app/campaigns/edit/[id]/page.tsx:199-220`).
- **Post ↔ screenshot linkage**: `Attachments` already has an optional `postsId` FK
  (`apps/api/prisma/schema.prisma` line 110) — a post's source screenshot can be stored
  as a normal `Attachments` row linked to the `Posts` row, no schema change needed.

## 2. Mudanças planeadas

**Scope for v1 (confirmed with user):** Stories only. Map only to `Posts` columns that
already exist — no Prisma migration. Any metric visible in the screenshot that has no
column (reach, profile visits, follows, navigation taps) is shown to the user, read-only,
in a "found in screenshot but not tracked yet" panel — never silently discarded, never
persisted. Extraction runs via Claude vision (confirmed), forced to a structured JSON
schema via tool use, so the response is typed and validated rather than free text.
Extraction always requires human review before save — the endpoint returns extracted
values for the form to pre-fill, it does **not** write to the `Posts` table itself; the
existing `POST /posts` / `PATCH /posts/:id` flow is unchanged and still the only write
path.

**Multi-image input (revised — confirmed by the user after reviewing this plan):**
uploads are **1..N screenshots per post, not exactly one**. The upload control lets the
user add several images before running extraction (matching how they actually shoot
these — scrolling through the same Insights screen and capturing 2-3 partial views). All
images for a post are sent to Claude in a **single** request so the model reconciles
overlap itself (e.g. "Interações" visible in two of three images should produce one
value, not a conflict) rather than the backend trying to merge N separate extraction
calls. If two images genuinely disagree on the same field (e.g. user uploaded
screenshots from two different stories by mistake), the response surfaces that as a
`warnings` entry instead of silently picking one — the reviewer decides, not the model.

### New backend module — `apps/api/src/insights-extraction/`

| File | Change |
|---|---|
| `insights-extraction.module.ts` | new — registers controller + service, imports `S3Module` (screenshot is stored regardless of extraction outcome, for audit). |
| `insights-extraction.controller.ts` | new — `POST /insights-extraction/stories`, **no `AuthGuard`** (deviation from the original plan — see note below), `FilesInterceptor('files', 6)` (array, up to 6 images per request — same idiom as `attachments.controller.ts:32-50` but plural). Uploads every raw image to S3 immediately (so nothing is lost even if extraction fails), then calls the service once with all buffers, returns `{ extracted: {...fields, confidence}, unmapped: {...labels found with no schema column}, warnings: string[], uniqueFilenames: string[] }`. Does not touch `Posts` or `Attachments` — that write happens only when the user submits the normal create/edit form. |
| `insights-extraction.service.ts` | new — builds **one** Claude vision request containing all N images together: system prompt describing the Stories Insights layout + the exact target schema (`impressions`, `likes`, `comments`, `shares`, `stickerClicks`, `linkClicks`, each with a `found: boolean` + `value: number | null` + `confidence: "high"\|"low"`), plus a free-form `unmapped: Record<string,string>` bucket for any other labeled metric visible (Contas alcançadas, Seguidores, Visitas ao perfil, Navegação, etc.). Instructed to reconcile the same field appearing across multiple images into one value, and to emit a `warnings` entry instead of silently picking one if two images disagree on a field. Uses `@anthropic-ai/sdk`'s tool-use forced-schema pattern so the response is guaranteed valid JSON, not parsed from prose. If none of the images look like an Instagram Stories Insights screen at all, returns a `warnings` entry instead of guessing — never invents numbers for a field it can't read. |
| `dto/extract-stories-insights-response.dto.ts` | new — response shape shared by controller/service (typed, not `any`). |

### `apps/api` wiring

| File | Change |
|---|---|
| `apps/api/src/app.module.ts` | edit — register `InsightsExtractionModule`. |
| `apps/api/package.json` | edit — add `@anthropic-ai/sdk`. |
| `apps/api/.env.example` | edit — add `ANTHROPIC_API_KEY=` (new section, "AI screenshot extraction"). |

### `apps/admin` — posts create/edit forms

| File | Change |
|---|---|
| `apps/admin/src/app/posts/create/page.tsx` | edit — above the `type` field, add an "Import from screenshot" `<Upload multiple>` control (same `beforeUpload` + `FormData` + `axios.post` idiom as `campaigns/edit/[id]/page.tsx:199-220`, extended to append multiple files to one `FormData` under the same `files` key), only enabled/shown once `type === "STORIES"` (Reels/Feed/Tiktok show nothing extra in v1). Lets the user stage 1..6 screenshots (thumbnail list, removable) before running extraction, then sends them all in one request. On success, call `form.setFieldsValue({...extracted numeric fields})`, visually mark auto-filled inputs (subtle badge/border, e.g. antd `Form.Item`'s `tooltip`/`extra` prop reading "auto-filled from screenshot — tap to edit") so the user knows to double-check rather than blindly trusting it. If any field came back `confidence: "low"` or `found: false`, leave it as-is (don't fill a guess) and flag it in the review banner; if `warnings` contains a cross-image conflict, surface it prominently rather than mixed in with low-confidence notices. Render `unmapped` (reach, profile visits, follows, navigation) in a collapsed read-only `<Descriptions>` block so the data is visible but clearly "not saved anywhere yet". |
| `apps/admin/src/app/posts/edit/[id]/page.tsx` | edit — identical addition, mirroring whatever structural pattern `create/page.tsx` ends up with. |

### Explicitly out of scope for this task (fast-follows, not started without separate alignment)

1. **Reels support** — the multi-image reconciliation this task adds for Stories
   directly reuses for Reels (same "send N screenshots in one call, let Claude
   reconcile" approach, e.g. Curtidas appearing on both the "Visão geral" action bar and
   the "Engajamento" tab), but Reels still needs a materially different target schema
   (avg watch time, skip rate, traffic sources, demographics) and its own review-panel
   design. Meaningfully bigger scope — proposed as a separate task once Stories ships
   and is validated in real use.
   > **Update 2026-07-16: shipped.** See
   > `TASK-screenshot-autofill-reels-and-full-metrics-table.md` — adds
   > `POST /insights-extraction/reels` and generalizes the admin UI to both post types.
   > That task also changed the "found in screenshot but not tracked yet" panel (added
   > by this task) to show *every* extracted metric, not just unmapped ones — the
   > `unmapped` response field described below was renamed to `allMetrics` accordingly.
2. **Schema extension** to persist reach / profile visits / follows / story-navigation
   taps as real `Posts` columns (would need a Prisma migration + new form fields +
   likely new aggregate-reporting logic touching `csvs.service.ts`'s `getAllData`,
   since that's where per-post metrics currently get rolled up into campaign reports).
3. Batch/multi-post upload (e.g. dragging in a whole campaign's worth of story
   screenshots at once) — v1 is one screenshot → one post's form, same granularity as
   today's manual flow.

**Alternative considered:** traditional OCR (Tesseract) + positional/regex parsing —
rejected (user confirmed) because the screenshots mix icons, charts, and PT-BR labels
whose position/wording will drift across Instagram app versions; a vision LLM with a
forced JSON schema tolerates that drift far better than hand-tuned per-locale
coordinates, at the cost of a per-image API call instead of free local processing.

**Deviation from the original plan (confirmed with user during implementation): no
`AuthGuard` on the new endpoint.** The plan above originally called for
`POST /insights-extraction/stories` behind `AuthGuard`, mirroring
`attachments.controller.ts`. Investigation during implementation found that
`apps/admin` never actually sends a JWT anywhere — its login
(`apps/admin/src/app/api/auth/login/route.ts`) is a hardcoded check against Vercel env
vars, not a real credential exchange with `apps/api`, and neither the admin
data-provider (`apps/admin/src/providers/data-provider/index.ts`) nor its `axios.post`
upload calls (`apps/admin/src/app/campaigns/edit/[id]/page.tsx`) ever attach an
`Authorization` header. Consistent with that reality, every upload endpoint admin
*actually* calls today — `users/upload-profile-image`, `users/upload-attachment`,
`users/upload-campaign-image`, `csvs/upload/:id` — is unguarded; the only guarded
upload endpoint, `attachments.controller.ts`'s `POST /`, is unused by any admin page and
would 401 on every real call if admin tried it. The new endpoint follows the pattern
admin actually exercises: **unguarded**, like the other upload routes it calls. Fixing
admin's auth flow to send real bearer tokens is a separate, pre-existing gap — out of
scope here.

## 3. Porquê

Whoever fills in `Posts` rows today is manually transcribing up to 7 numbers per story
off a phone screen — slow, and error-prone (mistyped digits, wrong field). The user
wants this UX cost removed for the highest-volume, simplest case first (Stories), rather
than trying to boil the ocean with Reels (which genuinely needs multiple screenshots and
a richer schema) on day one.

Scoping v1 to *only* the columns `Posts` already has means this ships with **zero schema
migration** — the review confirmed the current model has no home for reach/profile
visits/follows/navigation metrics, and extending it is a real design decision (new
columns, new form fields, new reporting rollups in `csvs.service.ts`) that deserves its
own alignment rather than being bundled into "add screenshot upload." Surfacing those
extra metrics read-only (not silently dropping them) means no information is lost if/when
the schema extension does happen — the groundwork (what Claude can already extract) will
already exist.

Human-in-the-loop review (pre-fill, never auto-save) is required because this is
financial/reporting data feeding client-facing campaign performance numbers — a
misread screenshot (glare, wrong post, cropped number) must be user-catchable before
it lands in a report, not after.

Claude vision with a forced structured-output schema was chosen over OCR+regex because
these screenshots are a genuinely hard target for positional parsing (icons, charts,
localized labels that shift between Instagram app versions) — a vision LLM's label→value
association is far more robust to that drift, and the "not confident, don't guess"
behavior is expressible directly in the schema (`found`/`confidence` per field) rather
than needing separate heuristic thresholding logic.

## 4. Ficheiros afectados

| File | Change type | Notes |
|------|-------------|-------|
| `apps/api/src/insights-extraction/insights-extraction.module.ts` | new | wires controller+service, imports S3 |
| `apps/api/src/insights-extraction/insights-extraction.controller.ts` | new | `POST /insights-extraction/stories`, auth-guarded, accepts 1..6 images, uploads all to S3, calls service |
| `apps/api/src/insights-extraction/insights-extraction.service.ts` | new | single Claude vision call over all images, forced JSON schema, reconciles cross-image duplicates, never guesses low-confidence fields |
| `apps/api/src/insights-extraction/dto/extract-stories-insights-response.dto.ts` | new | typed response shape |
| `apps/api/src/app.module.ts` | edit | register `InsightsExtractionModule` |
| `apps/api/package.json` | edit | add `@anthropic-ai/sdk` |
| `apps/api/.env.example` | edit | add `ANTHROPIC_API_KEY=` |
| `apps/admin/src/app/posts/create/page.tsx` | edit | screenshot upload control, auto-fill, unmapped-metrics panel |
| `apps/admin/src/app/posts/edit/[id]/page.tsx` | edit | same, mirrored |

**Explicitly not touched in this task** (see §2 out-of-scope list): Reels support, any
`Posts`/Prisma schema migration, `csvs.service.ts` reporting rollups, batch upload.
