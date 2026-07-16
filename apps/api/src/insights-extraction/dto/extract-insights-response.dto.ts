export type ExtractedFieldConfidence = 'high' | 'low';

export interface ExtractedMetricField {
  found: boolean;
  value: number | null;
  confidence: ExtractedFieldConfidence;
}

export type PostsMetricField =
  | 'impressions'
  | 'likes'
  | 'comments'
  | 'shares'
  | 'saves'
  | 'stickerClicks'
  | 'linkClicks';

// Stories has no save/bookmark action, so `saves` stays user-entered there.
export const STORIES_METRIC_FIELDS: PostsMetricField[] = [
  'impressions',
  'likes',
  'comments',
  'shares',
  'stickerClicks',
  'linkClicks',
];

// Reels' action bar/tabs show no link- or sticker-tap affordance, so those two
// stay out of the Reels-mapped set (unlike Stories).
export const REELS_METRIC_FIELDS: PostsMetricField[] = [
  'impressions',
  'likes',
  'comments',
  'shares',
  'saves',
];

export type ExtractedFields = Partial<Record<PostsMetricField, ExtractedMetricField>>;

export interface FoundMetric {
  label: string;
  value: string;
}

export interface ExtractInsightsResponseDto {
  extracted: ExtractedFields;
  allMetrics: FoundMetric[];
  warnings: string[];
  uniqueFilenames: string[];
}
