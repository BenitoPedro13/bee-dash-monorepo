# TASK: Reels screenshot auto-fill + show all extracted metrics (not just unmapped ones)

## Status: DONE (2026-07-16)

Shipped as planned. Verified: `apps/api` (`tsc --noEmit`, `nest build`) and
`apps/admin` (`tsc --noEmit`, `next build`, including `/posts/create` and
`/posts/edit/[id]`) all build clean. **Not verified live** — same caveat as
`TASK-screenshot-autofill-posts.md`: no `ANTHROPIC_API_KEY` or AWS S3 credentials were
available in the implementing session, so the actual Reels extraction quality (does the
model correctly read the action-bar + 3-tab layout, does it correctly separate
"Compartilhamentos" from "Reposts", does the `allMetrics` list actually include every
visible metric as instructed) has not been exercised end-to-end. Before relying on this
in production: set `ANTHROPIC_API_KEY` and run `POST /insights-extraction/reels` against
`docs/screenshots/reels-{1..7}.jpeg`, and click through `/posts/create` and
`/posts/edit/[id]` with `type=REELS` selected.

## 1. Cenário actual

`TASK-screenshot-autofill-posts.md` shipped Stories-only screenshot auto-fill:
`POST /insights-extraction/stories` (`apps/api/src/insights-extraction/`) accepts 1..6
screenshots, makes one Claude vision call, and returns
`{ extracted, unmapped, warnings, uniqueFilenames }` where `extracted` covers exactly
the six `Posts` columns Stories can fill (`impressions`, `likes`, `comments`, `shares`,
`stickerClicks`, `linkClicks`) and `unmapped` is **only** the metrics visible in the
screenshot that have no `Posts` column at all (e.g. "Contas alcançadas"). In
`apps/admin`'s `posts/create` and `posts/edit/[id]` pages, the upload control only
renders when `type === "STORIES"`, and the "Found in screenshot but not tracked yet"
`<Descriptions>` panel shows only that filtered `unmapped` list — any metric that *is*
mapped (e.g. "Curtidas") never appears in that panel, only in the numeric form field
above.

Reels support was explicitly called out as **out of scope** in that task
(`TASK-screenshot-autofill-posts.md` §2, "Explicitly out of scope for this task", item
1) because Reels' Instagram Insights layout is materially different and needs its own
target schema. Reviewing the 7 example screenshots in `docs/screenshots/reels-{1..7}.jpeg`
confirms this — Reels Insights has a persistent action bar (Curtidas/Comentários/
Reposts/Compartilhamentos/Salvamentos) plus three tabs requiring separate scrolling:

- **Visão geral**: Visualizações, Contas alcançadas, Tempo médio de visualização,
  Seguidores (new), a "Visualizações ao longo do tempo" graph, "O que afeta suas
  visualizações" (Taxa de reels pulados / compartilhamentos / curtidas / salvamentos /
  repost / comentários), a watch-time retention curve, and "Principais fontes das
  visualizações" (Feed/Aba Reels/Stories/Perfil/Explorar %).
- **Engajamento**: "Ações após a visualização" (Visitas ao perfil, Seguidores),
  "Interações" (Curtidas/Comentários/Reposts/Compartilhamentos/Salvamentos — duplicates
  the action bar), and a "Quando as pessoas curtiram" graph.
- **Público**: "Quem visualizou" (Seguidores % / Não seguidores %), "Detalhes do
  público" broken out by Idade/País/Gênero (age-bracket bars shown in the example).

Of all this, only five things map to an existing `Posts` column: Visualizações
(`impressions`), Curtidas (`likes`), Comentários (`comments`), Compartilhamentos
(`shares`), Salvamentos (`saves`) — note **Reels has real Salvamentos data**, unlike
Stories (which has no save action at all, per the original task's decision to leave
`saves` user-entered/0 for Stories). "Reposts" has no column of its own and isn't the
same concept as `shares`/Compartilhamentos, so it has no home either. No sticker/link
click affordance is visible anywhere in the 7 Reels screenshots, so `stickerClicks`/
`linkClicks` are not part of the Reels-mapped set (unlike Stories).

Separately, the current "not tracked yet" panel in `apps/admin` **only shows metrics
that have no schema column** — anything auto-filled into a numeric input never appears
there, so there is no single place to see everything Claude actually read off the
screenshot(s) side-by-side for review. The user wants that panel to show **every**
metric found (mapped or not), not just the leftover ones.

## 2. Mudanças planeadas

### Backend — `apps/api/src/insights-extraction/`

| File | Change |
|---|---|
| `dto/extract-stories-insights-response.dto.ts` | renamed to `dto/extract-insights-response.dto.ts` (generic — no longer Stories-only). New shape: `PostsMetricField` union (`impressions`\|`likes`\|`comments`\|`shares`\|`saves`\|`stickerClicks`\|`linkClicks`), `STORIES_METRIC_FIELDS` and `REELS_METRIC_FIELDS` field-list constants, `ExtractedFields = Partial<Record<PostsMetricField, ExtractedMetricField>>`, and `FoundMetric { label, value }` replacing `UnmappedMetric`. Response DTO renames `unmapped` → `allMetrics: FoundMetric[]` to reflect the new "show everything" semantics. |
| `insights-extraction.service.ts` | `extractStories` reworked to use the shared field-list/schema builder; its system prompt updated so `allMetrics` is instructed to include **every** visible metric, including the six mapped ones, using the on-screen label and displayed value verbatim (e.g. `"Curtidas": "866"`) — not just leftovers. New `extractReels(images)` method: its own system prompt describing the action-bar + 3-tab Reels layout above, its own tool schema over `REELS_METRIC_FIELDS`, same reconciliation-across-images and low-confidence/not-found rules as Stories, same never-guess policy, and the same "if none of the images look like a Reels Insights screen, warn instead of guessing" escape hatch. |
| `insights-extraction.controller.ts` | add `POST /insights-extraction/reels`, `FilesInterceptor('files', 8, ...)` (7 example images + 1 headroom; Reels needs more captures than Stories' 6 since it has 3 tabs to scroll through), same upload-to-S3-first behavior, calls `extractReels`. Existing `POST /insights-extraction/stories` unchanged in shape, still unguarded (per the prior confirmed deviation — admin sends no bearer token anywhere). |

### Frontend — `apps/admin/src/app/posts/{create,edit/[id]}/page.tsx`

| File | Change |
|---|---|
| both pages | The screenshot-upload block now renders for `postType === "STORIES" || postType === "REELS"`, picking per type: the target endpoint (`/insights-extraction/stories` vs `/insights-extraction/reels`), the max staged files (6 vs 8), and which metric-field list to read out of `extracted` for auto-fill (`STORIES_METRIC_FIELDS` vs `REELS_METRIC_FIELDS` — the latter now also auto-fills `saves`, which Stories never touches). The "Found in screenshot but not tracked yet" `<Descriptions>` panel is renamed to "All metrics found in screenshot(s)" and now renders `data.allMetrics` unfiltered — every label Claude found, mapped or not, so the reviewer can cross-check the auto-filled numbers against the same list rather than having to look in two places. |

### Explicitly still out of scope

Schema migration to persist reach/profile-visits/follows/traffic-source/demographic
breakdowns as real `Posts` columns — same reasoning as the original task: that's a
separate design decision (new columns, new reporting rollups in `csvs.service.ts`), not
bundled here. Those values keep surfacing read-only in "All metrics found in
screenshot(s)".

## 3. Porquê

Reels is the second-most-common post type after Stories in this dataset, and the same
UX problem (manually retyping numbers off a phone screenshot) applies to it — the user
asked for it as the promised fast-follow from the original task, now that Stories has
shipped and the multi-image/reconciliation approach is proven.

The "show all metrics, not just unmapped" change is a straightforward usability fix: a
reviewer checking whether the auto-fill is correct currently has to cross-reference the
numeric form fields against the screenshot directly, with no single audit view. Making
the panel show everything Claude read (duplicating the mapped ones next to the leftover
ones) means one glance answers "does this match the screenshot" for every number, mapped
or not — matching the schema-review spirit that was already the whole point of
human-in-the-loop review in the original task.

## 4. Ficheiros afectados

| File | Change type | Notes |
|------|-------------|-------|
| `apps/api/src/insights-extraction/dto/extract-stories-insights-response.dto.ts` | rename → `extract-insights-response.dto.ts` | generic DTO covering both Stories and Reels; `unmapped` → `allMetrics` |
| `apps/api/src/insights-extraction/insights-extraction.service.ts` | edit | shared field-list/schema builder; Stories prompt updated for "show all metrics"; new `extractReels` |
| `apps/api/src/insights-extraction/insights-extraction.controller.ts` | edit | new `POST /insights-extraction/reels` route |
| `apps/admin/src/app/posts/create/page.tsx` | edit | Reels support + renamed "all metrics" panel |
| `apps/admin/src/app/posts/edit/[id]/page.tsx` | edit | same |
