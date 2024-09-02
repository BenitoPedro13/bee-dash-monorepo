import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { sortFields, sortOrder } from 'types/queyParams';
import { Campaign, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class CampaignsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCampaignDto: CreateCampaignDto) {
    try {
      const campaign = await this.prismaService.campaign.create({
        data: createCampaignDto,
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
  }: {
    start: number;
    end: number;
    sort: sortFields<Campaign>;
    order: sortOrder;
  }) {
    try {
      const orderBy = sort.map((item, index) => {
        return {
          [item]: order[index],
        };
      });

      const pageSize = end - start;

      const result = await this.prismaService.campaign.findMany({
        take: pageSize,
        skip: start,
        orderBy: orderBy,
        include: { postsPack: true, user: true },
      });

      return {
        result,
        total: await this.prismaService.campaign.count(),
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
      });

      return campaigns;
    } catch (error) {
      console.error('CampaignsService.findAll: Error', error);
      throw error;
    }
  }

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
        },
      });

      return campaign;
    } catch (error) {
      console.error('CampaignsService.findOne: Error', error);
      throw error;
    }
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    try {
      const campaign = await this.prismaService.campaign.update({
        where: { id },
        data: updateCampaignDto,
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
