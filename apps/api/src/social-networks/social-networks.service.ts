import { Injectable } from '@nestjs/common';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { sortFields, sortOrder } from 'types/queyParams';
import { Prisma, SocialNetworks } from '@prisma/client';

@Injectable()
export class SocialNetworksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSocialNetworkDto: CreateSocialNetworkDto) {
    try {
      const socialNetwork = await this.prismaService.socialNetworks.create({
        data: createSocialNetworkDto,
      });

      return socialNetwork;
    } catch (error) {
      console.error('SocialNetworksService.create: Error', error);
      throw error;
    }
  }

  async findAll({
    start,
    end,
    sort,
    order,
    username,
  }: {
    start: number;
    end: number;
    sort: sortFields<SocialNetworks>;
    order: sortOrder;
    username: string | null;
  }) {
    try {
      const orderBy = sort.map((item, index) => {
        return {
          [item]: order[index],
        };
      });

      const pageSize = end - start;

      const where: Prisma.SocialNetworksWhereInput = username
        ? {
            username: {
              contains: username,
              mode: 'insensitive',
            },
          }
        : undefined;

      const result = await this.prismaService.socialNetworks.findMany({
        take: pageSize,
        skip: start,
        orderBy: orderBy,
        where,
        include: { creator: true, posts: true },
      });

      return {
        result,
        total:
          where !== undefined
            ? await this.prismaService.socialNetworks.count({ where })
            : await this.prismaService.socialNetworks.count(),
      };
    } catch (error) {
      console.error('SocialNetworksService.findAll: Error', error);
      throw error;
    }
  }

  async findAllByCreatorId(creatorId: number) {
    try {
      const socialNetworks = await this.prismaService.socialNetworks.findMany({
        where: {
          creatorId,
        },
        include: {
          creator: true,
          posts: true,
        },
      });

      return socialNetworks;
    } catch (error) {
      console.error('SocialNetworksService.findAllByCreatorId: Error', error);
      throw error;
    }
  }

  async findOne(socialNetorkId: number) {
    try {
      const socialNetwork = await this.prismaService.socialNetworks.findUnique({
        where: {
          id: socialNetorkId,
        },
        include: {
          creator: true,
          posts: true,
        },
      });

      return socialNetwork;
    } catch (error) {
      console.error('SocialNetworksService.findOne: Error', error);
      throw error;
    }
  }

  async update(id: number, updateSocialNetworkDto: UpdateSocialNetworkDto) {
    try {
      const socialNetwork = await this.prismaService.socialNetworks.update({
        where: { id },
        data: updateSocialNetworkDto,
      });

      return socialNetwork;
    } catch (error) {
      console.error('SocialNetworksService.update: Error', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const socialNetwork = await this.prismaService.socialNetworks.delete({
        where: { id },
      });

      return socialNetwork;
    } catch (error) {
      console.error('SocialNetworksService.remove: Error', error);
      throw error;
    }
  }
}
