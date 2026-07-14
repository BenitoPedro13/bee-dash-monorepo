import { Module } from '@nestjs/common';
import { SocialNetworksService } from './social-networks.service';
import { SocialNetworksController } from './social-networks.controller';

@Module({
  controllers: [SocialNetworksController],
  providers: [SocialNetworksService],
})
export class SocialNetworksModule {}
