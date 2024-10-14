export class CreateCampaignDto {
  userId: number;
  name: string;
  byPosts: boolean;
  imageUrl?: string;
  urlTable?: string;
}
