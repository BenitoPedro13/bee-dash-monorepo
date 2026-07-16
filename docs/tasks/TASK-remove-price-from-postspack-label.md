# TASK: Remove the price from the Posts↔PostsPack relation label

## 1. Cenário actual

In `apps/admin`, the "Post Pack" `Select` on the Posts create/edit forms
(`apps/admin/src/app/posts/create/page.tsx:18-33`,
`apps/admin/src/app/posts/edit/[id]/page.tsx:88-103`, structurally identical) uses a
`useSelect({ resource: "posts-pack", optionLabel: (postsPack) => ... })` whose
`optionLabel` builds a string as `${creatorName} · ${campaignName} · ${price}`, where
`price` is `(record?.price ?? 0).toLocaleString("pt-BR", { currency: "BRL", style:
"currency" })`. So every option in that dropdown — and the value shown once a Post Pack
is selected — currently displays the pack's price (e.g. "Jane Creator · Summer Campaign
· R$ 1.234,56").

## 2. Mudanças planeadas

| File | Change |
|---|---|
| `apps/admin/src/app/posts/create/page.tsx` | edit — `optionLabel` for `postsPackSelectProps` drops the `price` computation and the price segment from the returned string: `${creatorName} · ${campaignName}`. |
| `apps/admin/src/app/posts/edit/[id]/page.tsx` | edit — identical change, same `optionLabel`. |

No other files reference this specific label-building code (`posts-pack/page.tsx` and
`posts-pack/show/[id]/page.tsx` show `price` as its own dedicated field on the
Posts-Pack list/show pages, not as part of a relation label — out of scope, not touched).

## 3. Porquê

User request: the money value doesn't belong in the label used to pick which Post Pack a
Post belongs to — it's noise for that selection context (posts-pack rows already show
price on their own page), and surfacing a price figure inline while picking a post-pack
relation reads as more prominent/decision-relevant than intended here.

## 4. Ficheiros afectados

| File | Change type | Notes |
|------|-------------|-------|
| `apps/admin/src/app/posts/create/page.tsx` | edit | drop price from `postsPackSelectProps.optionLabel` |
| `apps/admin/src/app/posts/edit/[id]/page.tsx` | edit | same |
