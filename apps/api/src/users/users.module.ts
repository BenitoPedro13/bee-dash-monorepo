import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreatorsService } from 'src/creators/creators.service';
import { CampaignsService } from 'src/campaigns/campaigns.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreatorsService, CampaignsService],
})
export class UsersModule {}
