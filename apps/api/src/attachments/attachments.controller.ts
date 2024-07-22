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
import { diskStorage } from 'multer';
import { AttachmentsService } from './attachments.service';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Attachments } from '@prisma/client';
import { sortFields, sortOrder } from 'types/queyParams';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const uniqueFilename = `${Date.now()}-${uuidv4()}-${
            file.originalname
          }`;

          req['uniqueFileName'] = uniqueFilename;
          callback(null, uniqueFilename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAttachmentDto: CreateAttachmentDto, // Add the Body decorator
    @Req() req: any, // Inject the Request object using @Req()
  ) {
    // Assign the userId from the request body to the CreateAttachmentDto
    createAttachmentDto.fileSize = file.size;
    createAttachmentDto.userEmail = req.user.email;
    createAttachmentDto.originalFilename = file.originalname;
    createAttachmentDto.uniqueFilename = req['uniqueFileName'];

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
    @Query('email') email?: string,
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
      userEmail: email,
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(+id);
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
