import { PostsType } from '@prisma/client';

export class CreatePostDto {
  type: PostsType;
  impressions?: number;
  interactions: number;
  likes?: number;
  shares?: number;
  comments?: number;
  saves?: number;
  clicks?: number;
  stickerClicks?: number;
  linkClicks?: number;
  postDate: string;
  socialNetworkId: number;
  postsPackId: number;
}
