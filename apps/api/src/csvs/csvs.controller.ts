import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Delete,
  Patch,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvsService, MulterFileDTO } from './csvs.service';
import { AuthGuard } from '../auth/auth.guard';
// import { CreateCsvDto } from './dto/create-csv.dto';
// import { UpdateCsvDto } from './dto/update-csv.dto';
import { sortFields, sortOrder } from 'types/queyParams';
import { Performance } from '@prisma/client';
import { UpdateCsvDto } from './dto/update-csv.dto';
@Controller('csvs')
export class CsvsController {
  constructor(private readonly csvsService: CsvsService) {}

  // @UseGuards(AuthGuard)
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @Body() body: { user_email: string },
    @UploadedFile() file: MulterFileDTO,
    @Param('id') id: string,
  ): Promise<void> {
    await this.csvsService.processCsv(file, body.user_email, +id);
  }

  @UseGuards(AuthGuard)
  @Get('data/:id')
  async getAllData(@Req() req: any, @Param('id') id: string) {
    const userEmail = req.user.email;

    return this.csvsService.getAllData(userEmail, +id);
  }

  // @Post()
  // create(@Body() createCsvDto: CreateCsvDto) {
  //   return this.csvsService.create(createCsvDto);
  // }

  @Get()
  async findAll(
    @Query('_start') start?: string,
    @Query('_end') end?: string,
    @Query('_sort') sort?: string,
    @Query('_order') order?: string,
    // @Query('name') nameFilterValue?: string,
  ) {
    const sortFields = (
      sort?.includes(',') ? sort?.split(',') : [sort]
    ) as sortFields<Performance>;
    const sortOrders = (
      order?.includes(',') ? order?.split(',') : [order]
    ) as sortOrder;

    return await this.csvsService.findAll({
      start: start ? +start : 0,
      end: end ? +end : 10,
      sort: sort ? sortFields : ['id'],
      order: order ? sortOrders : ['asc'],
      // name: nameFilterValue ? nameFilterValue : null,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.csvsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCsvDto: UpdateCsvDto) {
  //   return this.csvsService.update(+id, updateCsvDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.csvsService.remove(+id);
  }
}
