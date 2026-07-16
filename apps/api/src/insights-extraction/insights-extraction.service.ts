import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  ExtractedStoriesFields,
  ExtractStoriesInsightsResponseDto,
  STORIES_METRIC_FIELDS,
  UnmappedMetric,
} from './dto/extract-stories-insights-response.dto';

const RECORD_TOOL_NAME = 'record_stories_insights';

const SYSTEM_PROMPT = `You read screenshots of Instagram's native "Visão geral" (overview)
Insights panel for a Story, in Brazilian Portuguese (PT-BR). This panel has no tabs — it is
a single scrollable view. One story is often captured across 2-3 partially-overlapping
screenshots taken while scrolling, so the same metric (e.g. "Interações", "Visualizações")
may appear in more than one image.

Your job: reconcile all provided images into ONE set of values per metric, not one value per
image. If a metric appears in multiple images with the SAME value, report it once. If a
metric appears with DIFFERING values across images (a real conflict, e.g. the user
accidentally mixed screenshots from two different stories), do not silently pick one — set
"looksLikeStoriesInsights" based on your best judgement, still report your best-guess value,
and add an explicit entry to "warnings" describing the conflict and which images disagreed.

Map ONLY these Instagram labels to the structured fields (all are optional — Stories may not
have all of them, e.g. a story with no link/sticker won't show link or sticker clicks):
- "Visualizações" -> impressions
- "Curtidas" -> likes
- "Respostas" -> comments
- "Compartilhamentos" -> shares
- sticker-tap count (if a sticker like a poll/quiz/slider was used) -> stickerClicks
- link-tap count (if a link sticker/swipe-up was used) -> linkClicks

For each of the six fields above, report:
- "found": true only if that label is actually visible in at least one image
- "value": the integer value if found (parse "1,2 mil" style abbreviations into a plain
  integer where unambiguous), or null if not found
- "confidence": "high" if the number is clearly legible and unambiguous, "low" if it is
  blurry, partially cropped, obstructed, or you are otherwise not fully sure — when in doubt,
  use "low" rather than guessing a specific number with "high" confidence

Every OTHER labeled metric visible in the screenshots that is not one of the six above
(e.g. "Contas alcançadas", "Interações" top-level total, "Atividade do perfil", "Visitas ao
perfil", "Seguidores", "Avanço", "Saiu", "Voltar", "Próximo story", audience/profile-activity
splits, etc.) must be captured in "unmapped" as {label, value} pairs using the label text as
shown on screen (in Portuguese) — never discard a visible metric, and never invent one that
isn't shown.

Set "looksLikeStoriesInsights" to false only if NONE of the provided images resemble an
Instagram Stories Insights ("Visão geral") screen at all — in that case still call the tool,
leave every field "found": false, "value": null, "unmapped": [], and add a warning explaining
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

function buildInputSchema() {
  const properties: Record<string, unknown> = {
    looksLikeStoriesInsights: {
      type: 'boolean',
      description:
        'False only if none of the images resemble a Stories Insights screen at all.',
    },
  };
  for (const field of STORIES_METRIC_FIELDS) {
    properties[field] = metricFieldSchema;
  }
  properties.unmapped = {
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
    required: [
      'looksLikeStoriesInsights',
      ...STORIES_METRIC_FIELDS,
      'unmapped',
      'warnings',
    ],
  };
}

interface RawExtractionInput {
  looksLikeStoriesInsights: boolean;
  unmapped: UnmappedMetric[];
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

@Injectable()
export class InsightsExtractionService {
  private readonly client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  async extractStories(
    images: InsightsImageInput[],
  ): Promise<
    Pick<ExtractStoriesInsightsResponseDto, 'extracted' | 'unmapped' | 'warnings'>
  > {
    const unsupported = images.find(
      (image) => !SUPPORTED_MIME_TYPES.has(image.mimetype),
    );
    if (unsupported) {
      return {
        extracted: emptyFields(),
        unmapped: [],
        warnings: [
          `Unsupported image type "${unsupported.mimetype}" — only JPEG, PNG, GIF, and WebP are supported.`,
        ],
      };
    }

    const response = await this.client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: RECORD_TOOL_NAME,
          description:
            'Record the reconciled Instagram Stories Insights metrics found across all provided screenshots.',
          input_schema: buildInputSchema(),
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
              text: `Extract and reconcile the Instagram Stories Insights metrics visible across these ${images.length} screenshot(s) of the same story.`,
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
        extracted: emptyFields(),
        unmapped: [],
        warnings: [
          'The model did not return structured data — could not extract any metrics.',
        ],
      };
    }

    const input = toolUseBlock.input as RawExtractionInput &
      ExtractedStoriesFields;

    const warnings = [...(input.warnings ?? [])];
    if (!input.looksLikeStoriesInsights) {
      warnings.unshift(
        'One or more images do not look like an Instagram Stories Insights screen — extracted values may be unreliable.',
      );
    }

    const extracted = {} as ExtractedStoriesFields;
    for (const field of STORIES_METRIC_FIELDS) {
      extracted[field] = input[field] ?? {
        found: false,
        value: null,
        confidence: 'low',
      };
    }

    return {
      extracted,
      unmapped: input.unmapped ?? [],
      warnings,
    };
  }
}

function emptyFields(): ExtractedStoriesFields {
  const extracted = {} as ExtractedStoriesFields;
  for (const field of STORIES_METRIC_FIELDS) {
    extracted[field] = { found: false, value: null, confidence: 'low' };
  }
  return extracted;
}
