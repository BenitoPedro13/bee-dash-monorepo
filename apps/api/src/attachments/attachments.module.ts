import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  // imports: [
  //   MulterModule.register({
  //     dest: './uploads',
  //   }),
  // ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
