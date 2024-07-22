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

  async findAll(userEmail: string) {
    return this.prismaService.attachments.findMany({
      where: {
        userEmail,
      },
    });
  }

  async findAllWithoutAuth({
    start,
    end,
    sort,
    order,
    // name,
    userEmail,
  }: {
    start: number;
    end: number;
    sort: sortFields<Attachments>;
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

    const result = await this.prismaService.attachments.findMany({
      take: pageSize,
      skip: start,
      orderBy: orderBy,
      where: {
        userEmail,
      },
    });

    return {
      result,
      total: await this.prismaService.attachments.count({
        where: {
          userEmail,
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
