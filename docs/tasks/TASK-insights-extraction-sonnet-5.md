# TASK: Switch insights-extraction from Opus 4.8 to Sonnet 5

## 1. Cenário actual

`apps/api/src/insights-extraction/insights-extraction.service.ts:214-215` calls the
Anthropic Messages API with `model: 'claude-opus-4-8'` to read Instagram Stories/Reels
Insights screenshots (vision input) and reconcile them into structured metrics via a
forced tool call (`tool_choice: { type: 'tool', name: RECORD_TOOL_NAME }`). This is the
only call site for this model string in the codebase (confirmed via grep — no other
`.ts` file references `claude-opus-4-8`). Opus 4.8 pricing is $5/$25 per MTok
(input/output).

## 2. Mudanças planeadas

| File | Change |
|---|---|
| `apps/api/src/insights-extraction/insights-extraction.service.ts` | edit — change the single `model: 'claude-opus-4-8'` literal (line 215) to `model: 'claude-sonnet-5'`. No other logic changes — system prompts, tool schema, and reconciliation code are untouched. |

No other files reference this model string, so this is a single-line change.

## 3. Porquê

Cost reduction with minimal quality risk: Sonnet 5 is priced at $3/$15 per MTok
(~40-60% cheaper than Opus 4.8, plus an intro rate of $2/$10 through 2026-08-31) and is
positioned by Anthropic as near-Opus quality on most tasks. Considered but rejected for
now: Haiku 4.5 ($1/$5, the cheapest option) — this task depends on reading small/blurry
numeric text and telling apart visually similar Portuguese labels
("Compartilhamentos" vs "Reposts"), which is exactly where a cheaper vision model is
most likely to lose accuracy. Recommendation is to validate Sonnet 5's extraction
quality against real screenshots first, and only evaluate Haiku 4.5 later with its own
A/B test if further savings are wanted.

## 4. Ficheiros afectados

| File | Change type | Notes |
|------|-------------|-------|
| `apps/api/src/insights-extraction/insights-extraction.service.ts` | edit | `model: 'claude-opus-4-8'` → `model: 'claude-sonnet-5'` |
