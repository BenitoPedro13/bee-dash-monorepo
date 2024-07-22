import { Module } from '@nestjs/common';
import { CsvsService } from './csvs.service';
import { CsvsController } from './csvs.controller';
import { CreatorService } from 'externDB/services/CreatorService';

@Module({
  controllers: [CsvsController],
  providers: [CsvsService, CreatorService],
})
export class CsvsModule {}
