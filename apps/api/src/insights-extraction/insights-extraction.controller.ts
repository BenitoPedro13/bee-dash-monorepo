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
import { ExtractInsightsResponseDto } from './dto/extract-insights-response.dto';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const imageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  callback(null, ALLOWED_MIME_TYPES.has(file.mimetype));
};

@Controller('insights-extraction')
export class InsightsExtractionController {
  constructor(
    private readonly insightsExtractionService: InsightsExtractionService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('stories')
  @UseInterceptors(
    FilesInterceptor('files', 6, { fileFilter: imageFileFilter }),
  )
  async extractStories(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ExtractInsightsResponseDto> {
    const uniqueFilenames = await this.uploadAll(files);

    const { extracted, allMetrics, warnings } =
      await this.insightsExtractionService.extractStories(
        files.map((file) => ({
          buffer: file.buffer,
          mimetype: file.mimetype,
        })),
      );

    return { extracted, allMetrics, warnings, uniqueFilenames };
  }

  @Post('reels')
  @UseInterceptors(
    FilesInterceptor('files', 8, { fileFilter: imageFileFilter }),
  )
  async extractReels(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ExtractInsightsResponseDto> {
    const uniqueFilenames = await this.uploadAll(files);

    const { extracted, allMetrics, warnings } =
      await this.insightsExtractionService.extractReels(
        files.map((file) => ({
          buffer: file.buffer,
          mimetype: file.mimetype,
        })),
      );

    return { extracted, allMetrics, warnings, uniqueFilenames };
  }

  // Uploads every raw screenshot to S3 first, so nothing is lost even if extraction fails.
  private async uploadAll(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        'Send at least one screenshot under the "files" field (JPEG, PNG, GIF, or WebP).',
      );
    }

    return Promise.all(
      files.map(async (file) => {
        const uniqueFilename = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        await this.s3Service.upload(uniqueFilename, file.buffer, file.mimetype);
        return uniqueFilename;
      }),
    );
  }
}
