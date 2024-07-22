// import { Campaign, Performance } from '@prisma/client';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  totalInitialInvestment: number;
  estimatedExecutedInvestment: number;
  campaignName: string;
  byPosts: boolean;
  color?: string;
  urlProfilePicture?: string;
}
