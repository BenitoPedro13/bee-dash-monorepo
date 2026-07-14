import { Module } from '@nestjs/common';
import { CsvsService } from './csvs.service';
import { CsvsController } from './csvs.controller';

@Module({
  controllers: [CsvsController],
  providers: [CsvsService],
})
export class CsvsModule {}
