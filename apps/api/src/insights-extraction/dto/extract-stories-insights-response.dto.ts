export type ExtractedFieldConfidence = 'high' | 'low';

export interface ExtractedMetricField {
  found: boolean;
  value: number | null;
  confidence: ExtractedFieldConfidence;
}

export const STORIES_METRIC_FIELDS = [
  'impressions',
  'likes',
  'comments',
  'shares',
  'stickerClicks',
  'linkClicks',
] as const;

export type StoriesMetricField = (typeof STORIES_METRIC_FIELDS)[number];

export type ExtractedStoriesFields = Record<
  StoriesMetricField,
  ExtractedMetricField
>;

export interface UnmappedMetric {
  label: string;
  value: string;
}

export interface ExtractStoriesInsightsResponseDto {
  extracted: ExtractedStoriesFields;
  unmapped: UnmappedMetric[];
  warnings: string[];
  uniqueFilenames: string[];
}
