import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Attachments } from '@prisma/client';
import { sortFields, sortOrder } from 'types/queyParams';
import { S3Service } from 'src/s3/s3.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly s3Service: S3Service,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAttachmentDto: CreateAttachmentDto, // Add the Body decorator
    @Req() req: any, // Inject the Request object using @Req()
  ) {
    const uniqueFilename = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    await this.s3Service.upload(uniqueFilename, file.buffer, file.mimetype);

    // Assign the userId from the request body to the CreateAttachmentDto
    createAttachmentDto.fileSize = file.size;
    createAttachmentDto.userEmail = req.user.email;
    createAttachmentDto.originalFilename = file.originalname;
    createAttachmentDto.uniqueFilename = uniqueFilename;

    return await this.attachmentsService.create(createAttachmentDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const userEmail = req.user.email;
    return this.attachmentsService.findAll(userEmail);
  }

  @Get('all')
  async findAllWithoutAuth(
    @Query('campaign_id') campaignId?: number,
    @Query('_start') start?: string,
    @Query('_end') end?: string,
    @Query('_sort') sort?: string,
    @Query('_order') order?: string,
  ) {
    const sortFields = (
      sort?.includes(',') ? sort?.split(',') : [sort]
    ) as sortFields<Attachments>;
    const sortOrders = (
      order?.includes(',') ? order?.split(',') : [order]
    ) as sortOrder;

    return await this.attachmentsService.findAllWithoutAuth({
      start: start ? +start : 0,
      end: end ? +end : 10,
      sort: sort ? sortFields : ['id'],
      order: order ? sortOrders : ['asc'],
      campaignId: campaignId,
    });
  }

  @UseGuards(AuthGuard)
  @Get('by-campaign/:id')
  async findOneByCampaign(@Param('id') id: string) {
    return this.attachmentsService.findAll(+id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.attachmentsService.findAll(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAttachmentDto: UpdateAttachmentDto,
  ) {
    return this.attachmentsService.update(+id, updateAttachmentDto);
  }

  // @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.attachmentsService.remove(+id);
  }
}
