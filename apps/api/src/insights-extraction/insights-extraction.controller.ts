import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from 'src/s3/s3.service';
import { InsightsExtractionService } from './insights-extraction.service';
import { ExtractStoriesInsightsResponseDto } from './dto/extract-stories-insights-response.dto';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

@Controller('insights-extraction')
export class InsightsExtractionController {
  constructor(
    private readonly insightsExtractionService: InsightsExtractionService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('stories')
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      fileFilter: (_req, file, callback) => {
        callback(null, ALLOWED_MIME_TYPES.has(file.mimetype));
      },
    }),
  )
  async extractStories(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ExtractStoriesInsightsResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'Send at least one screenshot under the "files" field (JPEG, PNG, GIF, or WebP).',
      );
    }

    // Upload every raw screenshot to S3 first, so nothing is lost even if extraction fails.
    const uniqueFilenames = await Promise.all(
      files.map(async (file) => {
        const uniqueFilename = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        await this.s3Service.upload(uniqueFilename, file.buffer, file.mimetype);
        return uniqueFilename;
      }),
    );

    const { extracted, unmapped, warnings } =
      await this.insightsExtractionService.extractStories(
        files.map((file) => ({
          buffer: file.buffer,
          mimetype: file.mimetype,
        })),
      );

    return { extracted, unmapped, warnings, uniqueFilenames };
  }
}
