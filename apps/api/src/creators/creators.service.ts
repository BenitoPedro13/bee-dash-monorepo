import { Injectable } from '@nestjs/common';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { sortFields, sortOrder } from 'types/queyParams';
import { Creator } from '@prisma/client';

@Injectable()
export class CreatorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCreatorDto: CreateCreatorDto) {
    try {
      const creator = await this.prismaService.creator.create({
        data: {
          ...createCreatorDto,
          urlProfilePicture: createCreatorDto?.urlProfilePicture ?? '',
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
  }: {
    start: number;
    end: number;
    sort: sortFields<Creator>;
    order: sortOrder;
  }) {
    try {
      const orderBy = sort.map((item, index) => {
        return {
          [item]: order[index],
        };
      });

      const pageSize = end - start;

      const result = await this.prismaService.creator.findMany({
        take: pageSize,
        skip: start,
        orderBy: orderBy,
        include: { categories: true, socialNetworks: true },
      });

      return {
        result,
        total: await this.prismaService.creator.count(),
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
          id: campaignId,
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

      return creator;
    } catch (error) {
      console.error('CreatorsService.findOne: Error', error);
      throw error;
    }
  }

  async update(id: number, updateCreatorDto: UpdateCreatorDto) {
    try {
      const creator = await this.prismaService.creator.update({
        where: { id },
        data: updateCreatorDto,
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
