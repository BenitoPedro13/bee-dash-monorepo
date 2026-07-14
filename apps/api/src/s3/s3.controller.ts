import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { S3Service } from './s3.service';

@Controller('public')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get(':key')
  async getObject(@Param('key') key: string, @Res() res: Response) {
    try {
      const { stream, contentType, contentLength } =
        await this.s3Service.getObject(key);

      res.setHeader('Content-Type', contentType ?? 'application/octet-stream');
      if (contentLength !== undefined) {
        res.setHeader('Content-Length', contentLength);
      }

      stream.pipe(res);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
