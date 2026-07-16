import { Module } from '@nestjs/common';
import { S3Module } from 'src/s3/s3.module';
import { InsightsExtractionController } from './insights-extraction.controller';
import { InsightsExtractionService } from './insights-extraction.service';

@Module({
  imports: [S3Module],
  controllers: [InsightsExtractionController],
  providers: [InsightsExtractionService],
})
export class InsightsExtractionModule {}
