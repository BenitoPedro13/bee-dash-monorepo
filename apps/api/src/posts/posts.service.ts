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
        include: {
          user: true,
        },
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
  }: {
    start: number;
    end: number;
    sort: sortFields<Posts>;
    order: sortOrder;
    // name: string | null;
    userEmail: string;
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
        user: {
          email: userEmail,
        },
      },
      include: {
        user: true,
      },
    });

    return {
      result,
      total: await this.prisma.posts.count({
        where: {
          user: {
            email: userEmail,
          },
        },
      }),
    };
  }

  async findOne(id: number): Promise<Posts | null> {
    try {
      return await this.prisma.posts.findUnique({
        where: { id },
        include: {
          user: true,
        },
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
