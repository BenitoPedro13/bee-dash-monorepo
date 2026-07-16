import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  ExtractedFields,
  ExtractInsightsResponseDto,
  FoundMetric,
  PostsMetricField,
  REELS_METRIC_FIELDS,
  STORIES_METRIC_FIELDS,
} from './dto/extract-insights-response.dto';

const RECORD_TOOL_NAME = 'record_insights';

const STORIES_SYSTEM_PROMPT = `You read screenshots of Instagram's native "Visão geral" (overview)
Insights panel for a Story, in Brazilian Portuguese (PT-BR). This panel has no tabs — it is
a single scrollable view. One story is often captured across 2-3 partially-overlapping
screenshots taken while scrolling, so the same metric (e.g. "Interações", "Visualizações")
may appear in more than one image.

Your job: reconcile all provided images into ONE set of values per metric, not one value per
image. If a metric appears in multiple images with the SAME value, report it once. If a
metric appears with DIFFERING values across images (a real conflict, e.g. the user
accidentally mixed screenshots from two different stories), do not silently pick one — set
"looksLikeInsightsScreen" based on your best judgement, still report your best-guess value,
and add an explicit entry to "warnings" describing the conflict and which images disagreed.

Map ONLY these Instagram labels to the structured fields (all are optional — Stories may not
have all of them, e.g. a story with no link/sticker won't show link or sticker clicks):
- "Visualizações" -> impressions
- "Curtidas" -> likes
- "Respostas" -> comments
- "Compartilhamentos" -> shares
- sticker-tap count (if a sticker like a poll/quiz/slider was used) -> stickerClicks
- link-tap count (if a link sticker/swipe-up was used) -> linkClicks

For each of the mapped fields, report:
- "found": true only if that label is actually visible in at least one image
- "value": the integer value if found (parse "1,2 mil" style abbreviations into a plain
  integer where unambiguous), or null if not found
- "confidence": "high" if the number is clearly legible and unambiguous, "low" if it is
  blurry, partially cropped, obstructed, or you are otherwise not fully sure — when in doubt,
  use "low" rather than guessing a specific number with "high" confidence

"allMetrics" must list EVERY labeled metric visible anywhere in the screenshots — including
the ones you already reported in the mapped fields above (e.g. also add {"label": "Curtidas",
"value": "866"} even though "likes" already covers it) — plus everything else with no mapped
field (e.g. "Contas alcançadas", "Interações" top-level total, "Atividade do perfil", "Visitas
ao perfil", "Seguidores", "Avanço", "Saiu", "Voltar", "Próximo story", audience/profile
splits, etc.). Use the exact label text as shown on screen (in Portuguese) and the value
exactly as displayed (keep the original formatting, e.g. "1,2 mil" or "52,8%") — never
discard a visible metric, and never invent one that isn't shown.

Set "looksLikeInsightsScreen" to false only if NONE of the provided images resemble an
Instagram Stories Insights ("Visão geral") screen at all — in that case still call the tool,
leave every mapped field "found": false, "value": null, "allMetrics": [], and add a warning
explaining why nothing could be extracted. Never invent numbers for a field you cannot
actually read.`;

const REELS_SYSTEM_PROMPT = `You read screenshots of Instagram's native "Insights do reel"
panel, in Brazilian Portuguese (PT-BR). Unlike Stories, Reels Insights has a persistent
action bar (Curtidas/Comentários/Reposts/Compartilhamentos/Salvamentos, always visible) plus
THREE tabs that each require their own scrolling: "Visão geral", "Engajamento", "Público".
Covering one reel typically takes several screenshots across all three tabs — expect the same
metric to repeat across images (e.g. "Curtidas" appears on the action bar AND again under
"Interações" in the Engajamento tab) and reconcile them into ONE value per metric, exactly as
you would for Stories.

If a metric appears with DIFFERING values across images (a real conflict, e.g. screenshots
from two different reels got mixed together), do not silently pick one — report your
best-guess value, set "looksLikeInsightsScreen" based on your best judgement, and add an
explicit "warnings" entry describing the conflict and which images disagreed.

Map ONLY these Instagram labels to the structured fields:
- "Visualizações" -> impressions
- "Curtidas" -> likes
- "Comentários" -> comments
- "Compartilhamentos" -> shares (NOT "Reposts" — that is a distinct action with no mapped
  field; always report it only in "allMetrics")
- "Salvamentos" -> saves

For each of the mapped fields, report:
- "found": true only if that label is actually visible in at least one image
- "value": the integer value if found (parse "1,2 mil" style abbreviations into a plain
  integer where unambiguous), or null if not found
- "confidence": "high" if the number is clearly legible and unambiguous, "low" if it is
  blurry, partially cropped, obstructed, or you are otherwise not fully sure — when in doubt,
  use "low" rather than guessing a specific number with "high" confidence

"allMetrics" must list EVERY labeled metric visible anywhere across all three tabs —
including the ones you already reported in the mapped fields above (e.g. also add
{"label": "Curtidas", "value": "866"} even though "likes" already covers it) — plus
everything else with no mapped field: "Reposts", "Contas alcançadas", "Tempo médio de
visualização", new "Seguidores", every "Taxa de ..." rate under "O que afeta suas
visualizações" (reels pulados/compartilhamentos/curtidas/salvamentos/repost/comentários),
"Principais fontes das visualizações" (Feed/Aba Reels/Stories/Perfil/Explorar percentages),
"Visitas ao perfil", "Quem visualizou" (Seguidores/Não seguidores percentages), and the
"Detalhes do público" age/country/gender breakdown rows. Use the exact label text as shown on
screen (in Portuguese) and the value exactly as displayed (keep the original formatting, e.g.
"52,8%" or "13 s") — never discard a visible metric, and never invent one that isn't shown.
Graphs/curves with no single readable number (e.g. the retention curve, "visualizações ao
longo do tempo") do not need an "allMetrics" entry — only labeled scalar values.

Set "looksLikeInsightsScreen" to false only if NONE of the provided images resemble an
Instagram Reels Insights screen at all — in that case still call the tool, leave every
mapped field "found": false, "value": null, "allMetrics": [], and add a warning explaining
why nothing could be extracted. Never invent numbers for a field you cannot actually read.`;

const metricFieldSchema = {
  type: 'object' as const,
  properties: {
    found: { type: 'boolean' as const },
    value: { type: ['number', 'null'] as const },
    confidence: { type: 'string' as const, enum: ['high', 'low'] },
  },
  required: ['found', 'value', 'confidence'],
};

function buildInputSchema(fields: PostsMetricField[]) {
  const properties: Record<string, unknown> = {
    looksLikeInsightsScreen: {
      type: 'boolean',
      description:
        'False only if none of the images resemble the expected Insights screen at all.',
    },
  };
  for (const field of fields) {
    properties[field] = metricFieldSchema;
  }
  properties.allMetrics = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        label: { type: 'string' },
        value: { type: 'string' },
      },
      required: ['label', 'value'],
    },
  };
  properties.warnings = {
    type: 'array',
    items: { type: 'string' },
  };

  return {
    type: 'object' as const,
    properties,
    required: ['looksLikeInsightsScreen', ...fields, 'allMetrics', 'warnings'],
  };
}

interface RawExtractionInput {
  looksLikeInsightsScreen: boolean;
  allMetrics: FoundMetric[];
  warnings: string[];
}

const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

type SupportedImageMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp';

export interface InsightsImageInput {
  buffer: Buffer;
  mimetype: string;
}

type ExtractionResult = Pick<
  ExtractInsightsResponseDto,
  'extracted' | 'allMetrics' | 'warnings'
>;

@Injectable()
export class InsightsExtractionService {
  private readonly client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  async extractStories(images: InsightsImageInput[]): Promise<ExtractionResult> {
    return this.extract(images, STORIES_SYSTEM_PROMPT, STORIES_METRIC_FIELDS, 'Story');
  }

  async extractReels(images: InsightsImageInput[]): Promise<ExtractionResult> {
    return this.extract(images, REELS_SYSTEM_PROMPT, REELS_METRIC_FIELDS, 'Reel');
  }

  private async extract(
    images: InsightsImageInput[],
    systemPrompt: string,
    fields: PostsMetricField[],
    subjectLabel: string,
  ): Promise<ExtractionResult> {
    const unsupported = images.find(
      (image) => !SUPPORTED_MIME_TYPES.has(image.mimetype),
    );
    if (unsupported) {
      return {
        extracted: emptyFields(fields),
        allMetrics: [],
        warnings: [
          `Unsupported image type "${unsupported.mimetype}" — only JPEG, PNG, GIF, and WebP are supported.`,
        ],
      };
    }

    const response = await this.client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      system: systemPrompt,
      tools: [
        {
          name: RECORD_TOOL_NAME,
          description: `Record the reconciled Instagram Insights metrics found across all provided ${subjectLabel} screenshots.`,
          input_schema: buildInputSchema(fields),
        },
      ],
      tool_choice: { type: 'tool', name: RECORD_TOOL_NAME },
      messages: [
        {
          role: 'user',
          content: [
            ...images.map((image) => ({
              type: 'image' as const,
              source: {
                type: 'base64' as const,
                media_type: image.mimetype as SupportedImageMimeType,
                data: image.buffer.toString('base64'),
              },
            })),
            {
              type: 'text' as const,
              text: `Extract and reconcile the Instagram Insights metrics visible across these ${images.length} screenshot(s) of the same ${subjectLabel.toLowerCase()}.`,
            },
          ],
        },
      ],
    });

    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );

    if (!toolUseBlock) {
      return {
        extracted: emptyFields(fields),
        allMetrics: [],
        warnings: [
          'The model did not return structured data — could not extract any metrics.',
        ],
      };
    }

    const input = toolUseBlock.input as RawExtractionInput & ExtractedFields;

    const warnings = [...(input.warnings ?? [])];
    if (!input.looksLikeInsightsScreen) {
      warnings.unshift(
        `One or more images do not look like an Instagram ${subjectLabel} Insights screen — extracted values may be unreliable.`,
      );
    }

    const extracted: ExtractedFields = {};
    for (const field of fields) {
      extracted[field] = input[field] ?? {
        found: false,
        value: null,
        confidence: 'low',
      };
    }

    return {
      extracted,
      allMetrics: input.allMetrics ?? [],
      warnings,
    };
  }
}

function emptyFields(fields: PostsMetricField[]): ExtractedFields {
  const extracted: ExtractedFields = {};
  for (const field of fields) {
    extracted[field] = { found: false, value: null, confidence: 'low' };
  }
  return extracted;
}
