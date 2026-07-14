import { SocialNetworksType } from '@prisma/client';

export class CreateSocialNetworkDto {
  type: SocialNetworksType;
  followers: number;
  username: string;
  creatorId?: number;
}
