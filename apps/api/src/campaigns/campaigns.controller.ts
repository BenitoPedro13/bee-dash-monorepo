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
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { sortFields, sortOrder } from 'types/queyParams';
import { Campaign } from '@prisma/client';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
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
      ) as sortFields<Campaign>;
      const sortOrders = (
        order?.includes(',') ? order?.split(',') : [order]
      ) as sortOrder;

      return await this.campaignsService.findAll({
        start: start ? +start : 0,
        end: end ? +end : 10,
        sort: sort ? sortFields : ['id'],
        order: order ? sortOrders : ['asc'],
        name: nameFilterValue ? nameFilterValue : null,
      });
    } catch (error) {
      console.error('CampaignsController.findAll: Error', error);
    }
  }

  @Get('by-user-id/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.campaignsService.findAllByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(+id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(+id);
  }
}
