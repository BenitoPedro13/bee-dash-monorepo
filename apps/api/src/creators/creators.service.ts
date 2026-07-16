import { Injectable } from '@nestjs/common';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { sortFields, sortOrder } from 'types/queyParams';
import { Creator, Posts, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class CreatorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createCreatorDto: CreateCreatorDto) {
    try {
      const { categories, ...rest } = createCreatorDto;

      const creator = await this.prismaService.creator.create({
        data: {
          ...rest,
          urlProfilePicture: rest?.urlProfilePicture ?? '',
        },
      });

      return creator;
    } catch (error) {
      console.error('CreatorsService.create: Error', error);
      throw error;
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
    sort: sortFields<Creator>;
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

      const where: Prisma.CreatorWhereInput = name
        ? {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          }
        : undefined;

      const findManyPayload: Prisma.CreatorFindManyArgs<DefaultArgs> = {
        take: pageSize,
        skip: start,
        orderBy: orderBy,
        include: { categories: true, socialNetworks: true },
      };

      if (where !== undefined) {
        findManyPayload.where = where;
      }

      const result = await this.prismaService.creator.findMany(findManyPayload);

      await Promise.all(
        result.map(async (creator) => {
          creator.urlProfilePicture =
            await this.s3Service.findPublicUrlBySubstring(
              `-creatorImage-${creator.id}-`,
            );
        }),
      );

      return {
        result,
        total:
          where !== undefined
            ? await this.prismaService.creator.count({ where })
            : await this.prismaService.creator.count(),
      };
    } catch (error) {
      console.error('CreatorsService.findAll: Error', error);
      throw error;
    }
  }

  async findAllByCampaignId(campaignId: number) {
    try {
      const creators = await this.prismaService.postsPack.findMany({
        where: {
          campaignId: campaignId,
        },
        select: {
          posts: {
            select: { socialNetwork: { select: { creatorId: true } } },
          },
        },
      });

      return creators;
    } catch (error) {
      console.error('CreatorsService.findAllByCampaignId: Error', error);
      throw error;
    }
  }

  async findAllByUserId(userId: number) {
    try {
      const posts = await this.prismaService.posts.findMany({
        where: {
          postsPack: { campaign: { userId } },
        },
        include: {
          socialNetwork: {
            include: {
              creator: {
                include: { categories: true, socialNetworks: true },
              },
            },
          },
          postsPack: true,
        },
      });

      await Promise.all(
        posts.map(async (post) => {
          const creatorId = post.socialNetwork.creatorId;

          post.socialNetwork.creator.urlProfilePicture =
            await this.s3Service.findPublicUrlBySubstring(
              `-creatorImage-${creatorId}-`,
            );
        }),
      );

      const groupedPosts = posts.reduce((acc, post) => {
        if (!acc[post.socialNetwork.creatorId]) {
          acc[post.socialNetwork.creatorId] = [];
        }
        acc[post.socialNetwork.creatorId].push(post);
        return acc;
      }, {});

      const influencers: Record<
        string,
        { posts: Posts[]; mediumEngagement: number }
      > = {};
      for (const creatorId in groupedPosts) {
        const posts = groupedPosts[creatorId];

        const groupedPostsPack = posts.reduce((acc, post) => {
          if (!acc[post.postsPack.id]) {
            acc[post.postsPack.id] = post.postsPack;
          }
          return acc;
        }, {});

        const groupedPostsByPostsPack = posts.reduce((acc, post) => {
          if (!acc[post.postsPack.id]) {
            acc[post.postsPack.id] = [];
          }
          acc[post.postsPack.id].push(post);
          return acc;
        }, {});

        for (const postsPackId in groupedPostsPack) {
          let mediumPrice = 0;

          const postsPack = groupedPostsPack[postsPackId];
          const posts = groupedPostsByPostsPack[postsPackId];

          mediumPrice = postsPack.price / posts.length;

          groupedPostsByPostsPack[postsPackId].forEach((item) => {
            item.mediumPrice = mediumPrice;

            if (!influencers[item.socialNetwork.creatorId]) {
              influencers[item.socialNetwork.creatorId] = {
                posts: [],
                mediumEngagement: 0,
              };
            }
            influencers[item.socialNetwork.creatorId].posts.push(item);
          });
        }
      }

      for (const creatorId in influencers) {
        let totalInteractions = 0;
        let totalImpressions = 0;

        influencers[creatorId].posts.forEach((item) => {
          totalImpressions += item.impressions;
          totalInteractions += item.interactions;
        });

        const mediumEngagement =
          totalImpressions === 0
            ? 0
            : (totalInteractions / totalImpressions) * 100;

        influencers[creatorId].mediumEngagement = +mediumEngagement.toFixed(2);
      }

      return influencers;
    } catch (error) {
      console.error('CampaignsService.findAllByUserId: Error', error);
      throw error;
    }
  }

  async findOne(creatorId: number) {
    try {
      const creator = await this.prismaService.creator.findUnique({
        where: {
          id: creatorId,
        },
        include: {
          categories: true,
          socialNetworks: true,
        },
      });

      creator.urlProfilePicture = await this.s3Service.findPublicUrlBySubstring(
        `-creatorImage-${creator.id}-`,
      );

      return creator;
    } catch (error) {
      console.error('CreatorsService.findOne: Error', error);
      throw error;
    }
  }

  async update(id: number, updateCreatorDto: UpdateCreatorDto) {
    let { categories, ...rest } = updateCreatorDto;

    try {
      if (
        Object.keys(updateCreatorDto).includes('categories') &&
        categories &&
        Array.isArray(categories)
      ) {
        delete updateCreatorDto.categories;

        const creator = await this.prismaService.creator.update({
          where: { id },
          data: {
            ...updateCreatorDto,
            categories: {
              set: categories,
            },
          },
        });

        return creator;
      }

      const creator = await this.prismaService.creator.update({
        where: { id },
        data: rest,
      });

      return creator;
    } catch (error) {
      console.error('CreatorsService.update: Error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const creator = await this.prismaService.creator.delete({
        where: { id },
      });

      return creator;
    } catch (error) {
      console.error('CreatorsService.remove: Error', error);
      throw error;
    }
  }
}
