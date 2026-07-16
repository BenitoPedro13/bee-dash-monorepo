# TASK: Searchable creator / posts-pack relation pickers in apps/admin

## 1. Cenário actual

`apps/admin` (Refine + Next.js 14 + antd) links records to creators and posts-packs
through 14 relation pickers built on Refine's `useSelect` hook feeding an antd
`<Select>`. Full inventory (file:line):

| Resource picked | Used in |
|---|---|
| `creators` | `posts-pack/edit/[id]/page.tsx:51-56`, `posts-pack/create/page.tsx:9-14`, `social-networks/create/page.tsx:9-14`, `social-networks/edit/[id]/page.tsx:20-25` |
| `posts-pack` | `posts/edit/[id]/page.tsx:27-32`, `posts/create/page.tsx:18-23` |
| `campaigns` | `posts-pack/edit/[id]/page.tsx:58-63`, `posts-pack/create/page.tsx:16-21` |
| `categories` | `creators/edit/[id]/page.tsx:20-29`, `campaigns/edit/[id]/page.tsx:61-70` |
| `users` | `campaigns/create/page.tsx:9-16`, `campaigns/edit/[id]/page.tsx:52-58` |
| `social-networks` | `posts/edit/[id]/page.tsx:18-25`, `posts/create/page.tsx:9-16` |

None of the `creators`/`posts-pack`/`campaigns`/`categories`/`social-networks` pickers
pass `searchField` — Refine defaults to filtering on `optionLabel` client-side-triggered,
server-fetched. That fetch goes nowhere useful because **the API doesn't support it**:

- `apps/api/src/creators/creators.controller.ts:26-50` and
  `creators.service.ts:34-78` accept only `_start/_end/_sort/_order`; `findMany` has
  **no `where` clause** and `take` is commented out (line 55) — every call returns the
  entire creators table.
- `apps/api/src/posts-pack/posts-pack.controller.ts:26-50` /
  `posts-pack.service.ts:25-60` — identical pattern, `take` commented out (line 46), no
  filter param.
- `apps/api/src/campaigns/*`, `apps/api/src/social-networks/*`,
  `apps/api/src/categories/*` — same shape (categories' `findMany()` doesn't even take
  `skip`/`take`).
- `apps/api/src/users/*` is the one exception with a real filter
  (`users.controller.ts:67-89`, `users.service.ts:230-270`, `where: { name: { contains,
  mode: 'insensitive' } }`) — but the admin picker searches `email`
  (`campaigns/create/page.tsx:9-16` sets `searchField: "email"`), not `name`, so even
  this "working" search never actually filters anything. The equivalent picker on
  `campaigns/edit/[id]/page.tsx:52-58` doesn't set `searchField` at all — same relation,
  different behaviour between create and edit.

Consequence for the two relations named in the request: typing into the "Creator"
dropdown (posts-pack, social-networks forms) or the "Post Pack" dropdown (posts forms)
does nothing — both always show the same unfiltered page of results, and as those
tables grow, every dropdown open pulls the full table over the wire.

Separately, `apps/admin/src/database/services/CreatorService.ts:20-42` already
implements a `searchByCreatorName(input)` / `searchByCreatorId(input)` client against
`creators/search-by-creator-name` and `creators/search-by-creator-id` — **routes that
don't exist anywhere in `apps/api`** (confirmed via grep). Its only consumer,
`campaigns/edit/[id]/page.tsx`, has the entire UI block that would use it commented out
(~lines 659–1129). This looks like an abandoned first attempt at exactly this feature —
worth knowing about so we don't duplicate dead work, but not reusable as-is since the
backend half was never built.

List pages for all 7 resources (`creators`, `posts-pack`, `campaigns`, `posts`,
`categories`, `social-networks`, `users`) also each contain identical dead filter logic
(`filter_field`/`filter_value` read from `searchParams`, e.g. `creators/page.tsx:16-30`)
with **no rendered search input anywhere** — the only way to filter today is to hand-edit
the URL. `useTable` runs in `pagination: { mode: "client" }`, consistent with the API
never honoring `take`.

Additional pre-existing bugs noticed while reading this code (out of scope for this task
but flagged for awareness): `categories/page.tsx` exports `function UsersList()`, and
`creators/page.tsx` / `posts-pack/page.tsx` / `social-networks/page.tsx` /
`campaigns/page.tsx` all export `function CampaignList()` — copy-paste artifacts from a
shared template, harmless (internal name only) but a sign this code has had low review
rigor. `creators.service.ts:54-68`'s `findAll` also does one S3 lookup per creator via
`Promise.all(...)` with no `take` limit — will get slower as the table grows, and directly
adds latency to the creator picker once it's fetching real data instead of nothing.

## 2. Mudanças planeadas

Two phases. **Phase 1 is the direct ask** (creator + posts-pack search, wherever those
relations are picked). **Phase 2** is the broader usability cleanup surfaced by the
review — same root cause, larger blast radius, proposed as a follow-up so Phase 1 can
ship and be verified independently.

### Phase 1 — server-side search for `creators` and `posts-pack`

| File | Change |
|---|---|
| `apps/api/src/creators/creators.controller.ts` | Accept an optional `?name=` query param, pass through to the service. |
| `apps/api/src/creators/creators.service.ts` | Add `where: { name: { contains: name, mode: 'insensitive' } }` when `name` is provided; uncomment `take: pageSize` (currently dead at line 55) so the endpoint actually paginates once search narrows the result set. |
| `apps/api/src/posts-pack/posts-pack.controller.ts` | Same shape: optional `?name=` query param. |
| `apps/api/src/posts-pack/posts-pack.service.ts` | `where: { creator: { name: { contains, mode: 'insensitive' } } }` — see correction below; uncomment `take` (dead at line 46). |
| `apps/admin/src/app/posts-pack/edit/[id]/page.tsx`, `posts-pack/create/page.tsx` | Creator `useSelect` (lines 51-56 / 9-14): add `searchField: "name"` and `debounce: 300`. |
| `apps/admin/src/app/social-networks/edit/[id]/page.tsx`, `social-networks/create/page.tsx` | Same creator picker fix (lines 20-25 / 9-14). |
| `apps/admin/src/app/posts/edit/[id]/page.tsx`, `posts/create/page.tsx` | Posts-pack `useSelect` (lines 27-32 / 18-23): add `searchField: "name"`, `debounce: 300`, and change `optionLabel` from `"name"` to `"creator.name"` — see correction below. |

`optionLabel`/`optionValue` (`name`/`id`) already match what the API will filter on, so
no field-name mismatch like the existing `users`/`email` bug — **this held for `creators`
but not for `posts-pack`, see correction below.**

> **Correction found during implementation (2026-07-16):** `PostsPack` has no `name`
> field in the Prisma schema (`price`, `registrations`, `posts`, `campaign`, `creator`,
> `createdAt`, `updatedAt` only) — the `optionLabel: "name"` on the posts-pack pickers
> (`posts/edit/[id]/page.tsx:30`, `posts/create/page.tsx:21`) was already rendering
> blank labels before this task, and a literal `where: { name: { contains } }` on
> `PostsPack` would not compile. Resolved (user confirmed): search/display posts-pack by
> its related **creator's** name instead — `?name=` still hits the same query param
> (`posts-pack.controller.ts`), but `posts-pack.service.ts` filters via
> `where: { creator: { name: { contains, mode: 'insensitive' } } }`, and the two admin
> pickers use `optionLabel: "creator.name"` (Refine's `useSelect` supports dot-path
> accessors) so the dropdown now shows the creator's name per pack instead of blank
> options. `total` count also now uses `count({ where })` when a filter is active
> (matching the existing `users.service.ts` pattern), otherwise pagination totals would
> stay unfiltered even though results are filtered.

**Status: Phase 1 — done (2026-07-16).** All 10 files above implemented; `apps/api` and
`apps/admin` both typecheck clean. Phase 2 remains proposed/not started.

**Alternative considered:** a shared `<CreatorSelect>` / `<PostsPackSelect>` component to
avoid repeating `useSelect({...})` 6 times. Rejected for Phase 1 — with only 6 call
sites and the goal of a fast, low-risk fix, inline changes are simpler to review and
revert; extracting a shared component is proposed as a Phase 2 item once the pattern is
proven and if more pickers need the same treatment.

### Phase 2 — proposed follow-ups (not started without separate alignment)

1. **Apply the same `where: contains` + `take` fix** to `campaigns`, `social-networks`,
   and `categories` `findAll` endpoints (`apps/api/src/campaigns/campaigns.service.ts`,
   `apps/api/src/social-networks/social-networks.service.ts`,
   `apps/api/src/categories/categories.service.ts` + their controllers) — same bug, just
   not the two relations explicitly named in this task.
2. **Fix the `users` picker's field mismatch**: either change
   `apps/admin/src/app/campaigns/create/page.tsx:9-16` and
   `campaigns/edit/[id]/page.tsx:52-58` to `searchField: "name"` (matching what the API
   filters on), or extend `apps/api/src/users/users.service.ts` to also filter on
   `email`. Also fix `campaigns/edit/[id]/page.tsx:52-58` missing `searchField` entirely
   (present on the create form, absent on edit).
3. **Add a visible search box to list pages** (`creators/page.tsx`, `posts-pack/page.tsx`,
   and siblings) wired to the existing-but-dead `filter_field`/`filter_value` URL-param
   logic — currently only reachable by hand-editing the URL. Switch `useTable`'s
   `pagination.mode` from `"client"` to `"server"` once the backend `take` fix (item 1 /
   Phase 1) is in place, so growth in table size doesn't mean full-table fetches.
4. **Extract a shared `<CreatorSelect>` / `<PostsPackSelect>` component** once Phase 1 is
   verified, so future search/debounce/loading-state improvements apply once instead of
   per call site.
5. **Surface loading/empty states** on relation pickers — every `useSelect` call
   destructures `queryResult` but never reads `.isLoading`/`.isError`, so a slow or
   failed fetch shows no feedback.
6. **Remove dead code**: `apps/admin/src/database/services/CreatorService.ts` (calls
   nonexistent `creators/search-by-creator-name` / `-id` routes) and the commented-out
   consumer block in `campaigns/edit/[id]/page.tsx`; fix the `defaultValue` for the
   categories multi-select on `campaigns/edit/[id]/page.tsx:66-69` (currently commented
   out, so pre-selected categories don't display, unlike the working equivalent in
   `creators/edit/[id]/page.tsx:20-29`).
7. **Naming cleanup**: rename the copy-pasted `function CampaignList()` /
   `function UsersList()` exports in `creators/page.tsx`, `posts-pack/page.tsx`,
   `social-networks/page.tsx`, `campaigns/page.tsx`, `categories/page.tsx` to match their
   actual resource.

## 3. Porquê

The user directly reported that searching creators and posts-packs when relating them
in the admin doesn't work — the review confirms this is a real, reproducible bug, not a
missing nice-to-have: the API silently ignores any filter and returns the whole table,
so every dropdown looks identical no matter what's typed. As the `creators` and
`posts-pack` tables grow this also becomes a performance problem (full-table fetch per
dropdown open, plus a per-row S3 lookup in `creators.service.ts`'s `findAll`), so fixing
search and fixing "unbounded dropdown" are the same fix, not two separate ones.

Phase 1 is scoped tightly to the two relations actually named in the request
(`creators`, `posts-pack`) to ship something verifiable quickly. Phase 2 exists because
the same root cause (`take` commented out, no `where` filter) is duplicated across
`campaigns`, `social-networks`, and `categories`, and because the review surfaced
adjacent, already-broken UX (dead list-page search UI, inconsistent picker config
between create/edit forms, dead code hitting nonexistent endpoints) that directly bears
on "improve admin usability further" — but touches more files and more resources, so
it's separated out for an explicit go/no-go rather than bundled into the same change.

## 4. Ficheiros afectados

**Phase 1:**

| File | Change type | Notes |
|------|-------------|-------|
| `apps/api/src/creators/creators.controller.ts` | edit | accept `?name=` query param |
| `apps/api/src/creators/creators.service.ts` | edit | add `where: contains` filter, uncomment `take` |
| `apps/api/src/posts-pack/posts-pack.controller.ts` | edit | accept `?name=` query param |
| `apps/api/src/posts-pack/posts-pack.service.ts` | edit | add `where: contains` filter, uncomment `take` |
| `apps/admin/src/app/posts-pack/edit/[id]/page.tsx` | edit | creator picker: `searchField`, `debounce` |
| `apps/admin/src/app/posts-pack/create/page.tsx` | edit | creator picker: `searchField`, `debounce` |
| `apps/admin/src/app/social-networks/edit/[id]/page.tsx` | edit | creator picker: `searchField`, `debounce` |
| `apps/admin/src/app/social-networks/create/page.tsx` | edit | creator picker: `searchField`, `debounce` |
| `apps/admin/src/app/posts/edit/[id]/page.tsx` | edit | posts-pack picker: `searchField`, `debounce` |
| `apps/admin/src/app/posts/create/page.tsx` | edit | posts-pack picker: `searchField`, `debounce` |

**Phase 2 (proposed, pending alignment):** `apps/api/src/campaigns/*`,
`apps/api/src/social-networks/*`, `apps/api/src/categories/*` (edit — pagination/filter
parity), `apps/admin/src/app/campaigns/create/page.tsx` +
`campaigns/edit/[id]/page.tsx` (edit — fix `users` search field mismatch), all 7 list
`page.tsx` files under `apps/admin/src/app/*/page.tsx` (edit — real search box), a new
`apps/admin/src/components/CreatorSelect.tsx` / `PostsPackSelect.tsx` (new — shared
picker), `apps/admin/src/database/services/CreatorService.ts` (removal — dead code).
