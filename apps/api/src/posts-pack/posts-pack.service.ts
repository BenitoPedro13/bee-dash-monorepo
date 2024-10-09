import { Injectable } from '@nestjs/common';
import { CreatePostsPackDto } from './dto/create-posts-pack.dto';
import { UpdatePostsPackDto } from './dto/update-posts-pack.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsPack } from '@prisma/client';
import { sortFields, sortOrder } from 'types/queyParams';

@Injectable()
export class PostsPackService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPostsPackDto: CreatePostsPackDto) {
    try {
      const postsPack = await this.prismaService.postsPack.create({
        data: createPostsPackDto,
      });

      return postsPack;
    } catch (error) {
      console.error('PostsPackService.create: Error', error);
      throw error;
    }
  }

  async findAll({
    start,
    end,
    sort,
    order,
  }: {
    start: number;
    end: number;
    sort: sortFields<PostsPack>;
    order: sortOrder;
  }) {
    try {
      const orderBy = sort.map((item, index) => {
        return {
          [item]: order[index],
        };
      });

      const pageSize = end - start;

      const result = await this.prismaService.postsPack.findMany({
        // take: pageSize,
        skip: start,
        orderBy: orderBy,
        include: { creator: true, posts: true, campaign: true },
      });

      return {
        result,
        total: await this.prismaService.postsPack.count(),
      };
    } catch (error) {
      console.error('PostsPackService.findAll: Error', error);
      throw error;
    }
  }

  async findAllByCampaignId(campaignId: number) {
    try {
      const postsPacks = await this.prismaService.postsPack.findMany({
        where: {
          campaignId,
        },
        include: {
          creator: true,
          posts: true,
          campaign: true,
        },
      });

      return postsPacks;
    } catch (error) {
      console.error('PostsPackService.findAllByCampaignId: Error', error);
      throw error;
    }
  }

  async findAllByCreatorId(creatorId: number) {
    try {
      const postsPacks = await this.prismaService.postsPack.findMany({
        where: {
          creatorId,
        },
        include: {
          creator: true,
          posts: true,
          campaign: true,
        },
      });

      return postsPacks;
    } catch (error) {
      console.error('PostsPackService.findAllByCreatorId: Error', error);
      throw error;
    }
  }

  async findOne(postsPackId: number) {
    try {
      const postsPack = await this.prismaService.postsPack.findUnique({
        where: {
          id: postsPackId,
        },
        include: {
          creator: true,
          posts: true,
          campaign: true,
        },
      });

      return postsPack;
    } catch (error) {
      console.error('PostsPackService.findOne: Error', error);
      throw error;
    }
  }

  async update(id: number, updatePostsPackDto: UpdatePostsPackDto) {
    try {
      const postsPack = await this.prismaService.postsPack.update({
        where: { id },
        data: updatePostsPackDto,
      });

      return postsPack;
    } catch (error) {
      console.error('PostsPackService.update: Error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const postsPack = await this.prismaService.postsPack.delete({
        where: { id },
      });

      return postsPack;
    } catch (error) {
      console.error('PostsPackService.remove: Error', error);
      throw error;
    }
  }
}
