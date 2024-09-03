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
import { PostsPackService } from './posts-pack.service';
import { CreatePostsPackDto } from './dto/create-posts-pack.dto';
import { UpdatePostsPackDto } from './dto/update-posts-pack.dto';
import { PostsPack } from '@prisma/client';
import { sortFields, sortOrder } from 'types/queyParams';

@Controller('posts-pack')
export class PostsPackController {
  constructor(private readonly postsPackService: PostsPackService) {}

  @Post()
  create(@Body() createPostsPackDto: CreatePostsPackDto) {
    return this.postsPackService.create(createPostsPackDto);
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
      ) as sortFields<PostsPack>;
      const sortOrders = (
        order?.includes(',') ? order?.split(',') : [order]
      ) as sortOrder;

      return await this.postsPackService.findAll({
        start: start ? +start : 0,
        end: end ? +end : 10,
        sort: sort ? sortFields : ['id'],
        order: order ? sortOrders : ['asc'],
      });
    } catch (error) {
      console.error('PostsPackController.findAll: Error', error);
    }
  }

  @Get('by-campaign-id/:campaignId')
  findAllByCampaignId(@Param('campaignId') campaignId: string) {
    return this.postsPackService.findAllByCampaignId(+campaignId);
  }

  @Get('by-creator-id/:creatorId')
  findAllByCreatorId(@Param('creatorId') creatorId: string) {
    return this.postsPackService.findAllByCampaignId(+creatorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsPackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostsPackDto: UpdatePostsPackDto,
  ) {
    return this.postsPackService.update(+id, updatePostsPackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsPackService.remove(+id);
  }
}
