enum PostsType {
  STORIES,
  FEED,
  TIKTOK,
}

export interface Posts {
  id: number;
  type: PostsType;
  isVideo: boolean;
  impressions: number;
  interactions: number;
  clicks: number;
  videoViews: number;
  engagement: number;
  price: number;
  postDate: Date;
  creatorId: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}
