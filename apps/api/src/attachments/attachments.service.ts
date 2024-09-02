import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { sortFields, sortOrder } from 'types/queyParams';
import { Attachments } from '@prisma/client';
import { MulterFileDTO } from 'src/csvs/csvs.service';
import path from 'path';
import fs from 'fs';
@Injectable()
export class AttachmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    return this.prismaService.attachments.create({
      data: createAttachmentDto,
    });
  }

  async findAll(campaignId: number) {
    return this.prismaService.attachments.findMany({
      where: {
        campaignId,
      },
    });
  }

  async findAllWithoutAuth({
    start,
    end,
    sort,
    order,
    // name,
    campaignId,
  }: {
    start: number;
    end: number;
    sort: sortFields<Attachments>;
    order: sortOrder;
    // name: string | null;
    campaignId: number;
  }) {
    const orderBy = sort.map((item, index) => {
      return {
        [item]: order[index],
      };
    });

    const pageSize = end - start;

    const result = await this.prismaService.attachments.findMany({
      take: pageSize,
      skip: start,
      orderBy: orderBy,
      where: {
        campaignId,
      },
    });

    return {
      result,
      total: await this.prismaService.attachments.count({
        where: {
          campaignId,
        },
      }),
    };
  }

  findOne(id: number) {
    return this.prismaService.attachments.findUnique({
      where: { id },
    });
  }

  update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    return this.prismaService.attachments.update({
      where: { id },
      data: updateAttachmentDto,
    });
  }

  remove(id: number) {
    return this.prismaService.attachments.delete({
      where: { id },
    });
  }
}
