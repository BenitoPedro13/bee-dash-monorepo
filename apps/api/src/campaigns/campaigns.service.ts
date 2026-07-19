import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { sortFields, sortOrder } from 'types/queyParams';
import { Campaign, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    let { categories, ...rest } = createCampaignDto;

    try {
      const campaign = await this.prismaService.campaign.create({
        data: rest,
      });

      return campaign;
    } catch (error) {
      console.error('CampaignsService.create: Error', error);
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
    sort: sortFields<Campaign>;
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

      const where: Prisma.CampaignWhereInput = name
        ? {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          }
        : undefined;

      const result = await this.prismaService.campaign.findMany({
        take: pageSize,
        skip: start,
        orderBy: orderBy,
        where,
        include: { postsPack: true, user: true, categories: true },
      });

      return {
        result,
        total:
          where !== undefined
            ? await this.prismaService.campaign.count({ where })
            : await this.prismaService.campaign.count(),
      };
    } catch (error) {
      console.error('CampaignsService.findAll: Error', error);
      throw error;
    }
  }

  async findAllByUserId(userId: number) {
    try {
      const campaigns = await this.prismaService.campaign.findMany({
        where: {
          userId,
        },
        include: {
          postsPack: {
            include: {
              creator: {
                include: { socialNetworks: true },
              },
              posts: true,
            },
          },
          attachments: true,
          categories: true,
        },
      });

      const campaignsWithFollowers = await Promise.all(
        campaigns.map(async (campaign) => {
          campaign.imageUrl = await this.s3Service.findPublicUrlBySubstring(
            `-campaignImage-${campaign.id}-`,
          );

          const uniqueSocialNetworks = new Set<number>();
          let totalFollowers = 0;

          let totalInteractions = 0;
          let totalImpressions = 0;

          await Promise.all(
            campaign.postsPack.map(async (postPack) => {
              postPack.creator.urlProfilePicture =
                await this.s3Service.findPublicUrlBySubstring(
                  `-creatorImage-${postPack.creatorId}-`,
                );

              postPack.creator.socialNetworks.forEach((network) => {
                if (!uniqueSocialNetworks.has(network.id)) {
                  totalFollowers += network.followers || 0;
                  uniqueSocialNetworks.add(network.id);
                }
              });

              postPack.posts.forEach((post) => {
                totalImpressions += post.impressions;
                totalInteractions += post.interactions;
              });
            }),
          );

          const mediumEngagement =
            totalImpressions === 0
              ? 0
              : (totalInteractions / totalImpressions) * 100;

          return {
            ...campaign,
            totalFollowers,
            mediumEngagement: +mediumEngagement.toFixed(2),
          };
        }),
      );

      return campaignsWithFollowers;
    } catch (error) {
      console.error('CampaignsService.findAll: Error', error);
      throw error;
    }
  }
  // campaigns[0].postsPack[0].creator.socialNetworks[0].followers

  async findOne(campaignId: number) {
    try {
      const campaign = await this.prismaService.campaign.findUnique({
        where: {
          id: campaignId,
        },
        include: {
          user: true,
          attachments: true,
          performances: true,
          postsPack: true,
          categories: true,
        },
      });

      campaign.imageUrl = await this.s3Service.findPublicUrlBySubstring(
        `-campaignImage-${campaign.id}-`,
      );

      return campaign;
    } catch (error) {
      console.error('CampaignsService.findOne: Error', error);
      throw error;
    }
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    let { categories, ...rest } = updateCampaignDto;

    try {
      if (
        Object.keys(updateCampaignDto).includes('categories') &&
        categories &&
        Array.isArray(categories)
      ) {
        delete updateCampaignDto.categories;

        const creator = await this.prismaService.campaign.update({
          where: { id },
          data: {
            ...updateCampaignDto,
            categories: {
              set: categories,
            },
          },
        });

        return creator;
      }

      const campaign = await this.prismaService.campaign.update({
        where: { id },
        data: rest,
      });

      return campaign;
    } catch (error) {
      console.error('CampaignsService.update: Error', error);
      throw error;
    }
    return;
  }

  async remove(id: number) {
    try {
      const campaign = await this.prismaService.campaign.delete({
        where: { id },
      });

      return campaign;
    } catch (error) {
      console.error('CampaignsService.remove: Error', error);
      throw error;
    }
  }
}
