import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { Creator } from '@prisma/client';
import { sortFields, sortOrder } from 'types/queyParams';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto) {
    return this.creatorsService.create(createCreatorDto);
  }

  @Get()
  async findAll(
    @Query('_start') start?: string,
    @Query('_end') end?: string,
    @Query('_sort') sort?: string,
    @Query('_order') order?: string,
    @Query('name') nameFilterValue?: string,
  ) {
    try {
      const sortFields = (
        sort?.includes(',') ? sort?.split(',') : [sort]
      ) as sortFields<Creator>;
      const sortOrders = (
        order?.includes(',') ? order?.split(',') : [order]
      ) as sortOrder;

      return await this.creatorsService.findAll({
        start: start ? +start : 0,
        end: end ? +end : 10,
        sort: sort ? sortFields : ['id'],
        order: order ? sortOrders : ['asc'],
        name: nameFilterValue ? nameFilterValue : null,
      });
    } catch (error) {
      console.error('CreatorsController.findAll: Error', error);
    }
  }

  @Get('by-campaign-id/:campaignId')
  findAllByCampaignId(@Param('campaignId') campaignId: string) {
    return this.creatorsService.findAllByCampaignId(+campaignId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creatorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreatorDto: UpdateCreatorDto) {
    return this.creatorsService.update(+id, updateCreatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creatorsService.remove(+id);
  }
}
