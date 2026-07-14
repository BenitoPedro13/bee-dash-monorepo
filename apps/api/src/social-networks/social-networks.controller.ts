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
import { SocialNetworksService } from './social-networks.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';
import { sortFields, sortOrder } from 'types/queyParams';
import { SocialNetworks } from '@prisma/client';

@Controller('social-networks')
export class SocialNetworksController {
  constructor(private readonly socialNetworksService: SocialNetworksService) {}

  @Post()
  create(@Body() createSocialNetworkDto: CreateSocialNetworkDto) {
    return this.socialNetworksService.create(createSocialNetworkDto);
  }

  @Get()
  async findAll(
    @Query('_start') start?: string,
    @Query('_end') end?: string,
    @Query('_sort') sort?: string,
    @Query('_order') order?: string,
  ) {
    try {
      const sortFields = (
        sort?.includes(',') ? sort?.split(',') : [sort]
      ) as sortFields<SocialNetworks>;
      const sortOrders = (
        order?.includes(',') ? order?.split(',') : [order]
      ) as sortOrder;

      return this.socialNetworksService.findAll({
        start: start ? +start : 0,
        end: end ? +end : 10,
        sort: sort ? sortFields : ['id'],
        order: order ? sortOrders : ['asc'],
      });
    } catch (error) {
      console.error('SocialNetworksController.findAll: Error', error);
    }
  }

  @Get('by-creator-id/:creatorId')
  findAllByCreatorId(@Param('creatorId') creatorId: string) {
    return this.socialNetworksService.findAllByCreatorId(+creatorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialNetworksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSocialNetworkDto: UpdateSocialNetworkDto,
  ) {
    return this.socialNetworksService.update(+id, updateSocialNetworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialNetworksService.remove(+id);
  }
}
