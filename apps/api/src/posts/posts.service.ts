import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { sortFields, sortOrder } from 'types/queyParams';
import { Posts, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostDto: CreatePostDto): Promise<Posts | null> {
    try {
      return this.prisma.posts.create({
        data: createPostDto as Prisma.PostsCreateInput,
      });
    } catch (error) {
      console.error('PostsService.create Error: ', error);
    }
  }

  async findAll({
    start,
    end,
    sort,
    order,
    name,
  }: {
    start: number;
    end: number;
    sort: sortFields<Posts>;
    order: sortOrder;
    name: string | null;
  }) {
    try {
      const orderBy = sort.map((item, index) => {
        return {
          [item]: order[index],
        };
      });

      const pageSize = end - start;

      const findManyPayload: Prisma.PostsFindManyArgs<DefaultArgs> = {
        take: pageSize,
        skip: start,
        orderBy: orderBy,
      };

      const result = await this.prisma.posts.findMany(findManyPayload);

      return {
        result,
        total: await this.prisma.posts.count(),
      };
    } catch (error) {
      console.log('PostsService.findAll: ', error);
    }
  }

  async findAllByUser({
    start,
    end,
    sort,
    order,
    // name,
    userEmail,
    campaignId,
  }: {
    start: number;
    end: number;
    sort: sortFields<Posts>;
    order: sortOrder;
    // name: string | null;
    userEmail: string;
    campaignId: number;
  }) {
    const orderBy = sort.map((item, index) => {
      return {
        [item]: order[index],
      };
    });

    const pageSize = end - start;

    const result = await this.prisma.posts.findMany({
      take: pageSize,
      skip: start,
      orderBy: orderBy,
      where: {
        PostsPack: {
          campaignId,
        },
      },
      include: {
        PostsPack: true,
      },
    });

    return {
      result,
      total: await this.prisma.posts.count({
        where: {
          PostsPack: {
            campaignId,
          },
        },
      }),
    };
  }

  async findOne(id: number): Promise<Posts | null> {
    try {
      return await this.prisma.posts.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('PostsService.findOne: ', error);
    }
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Posts | null> {
    try {
      return await this.prisma.posts.update({
        where: { id },
        data: updatePostDto as Prisma.PostsUpdateInput,
      });
    } catch (error) {
      console.error('PostsService.update: ', error);
    }
  }

  async remove(id: number): Promise<Posts | null> {
    try {
      return await this.prisma.posts.delete({ where: { id } });
    } catch (error) {
      console.error('PostsService.remove: ', error);
    }
  }
}
