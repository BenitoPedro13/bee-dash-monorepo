import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Attachments, User } from '.prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sortFields, sortOrder } from 'types/queyParams';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { MulterFileDTO } from 'src/csvs/csvs.service';
import path from 'path';
import fs from 'fs';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({
      data: createUserDto as Prisma.UserCreateInput,
    });
  }

  async processProfileImage(
    file: MulterFileDTO,
    userEmail: string,
    // campaignId: number,
  ): Promise<void> {
    console.log('processProfileImage', file);

    const multerFile = {
      uniqueFilename: `${Date.now()}-${userEmail}-${file?.originalname ?? ''}`,
      buffer: file.buffer,
      originalname: file.originalname,
      userEmail: userEmail,
    };

    // Ensure the /files directory exists
    const directoryPath = path.join(__dirname, '..', '..', '..', 'files');
    fs.mkdirSync(directoryPath, { recursive: true });

    // Write the file to the /files folder
    const filePath = path.join(directoryPath, multerFile.uniqueFilename);

    fs.writeFile(filePath, multerFile.buffer, (error) => {
      if (error) {
        console.error('Error writing file:', error);
      }
    });

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: userEmail,
        },
      },
    });

    await this.prisma.user.update({
      data: {
        urlProfilePicture: `/public/${multerFile.uniqueFilename}`,
      },
      where: { email: userEmail },
    });
  }

  async processCreatorImage(
    file: MulterFileDTO,
    creatorId: number,
  ): Promise<Attachments> {
    console.log('processCreatorImage', file);

    const multerFile = {
      uniqueFilename: `${Date.now()}-creatorImage-${creatorId}-${
        file?.originalname ?? ''
      }`,
      buffer: file.buffer,
      originalname: file.originalname,
    };

    // Ensure the /files directory exists
    const directoryPath = path.join(__dirname, '..', '..', '..', 'files');
    fs.mkdirSync(directoryPath, { recursive: true });

    // Write the file to the /files folder
    const filePath = path.join(directoryPath, multerFile.uniqueFilename);

    fs.writeFile(filePath, multerFile.buffer, (error) => {
      if (error) {
        console.error('Error writing file:', error);
      }
    });

    // console.log(multerFile, `/public/${multerFile.uniqueFilename}`);

    const a = await this.prisma.creator.update({
      data: {
        urlProfilePicture: `/public/${multerFile.uniqueFilename}`,
      },
      where: { id: creatorId },
    });

    console.log(a);

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: `-creatorImage-${creatorId}`,
        },
      },
    });

    return await this.prisma.attachments.create({
      data: {
        uniqueFilename: multerFile.uniqueFilename,
        originalFilename: file.originalname,
        fileSize: file.buffer.length,
      },
    });
  }

  async processCampaignImage(
    file: MulterFileDTO,
    campaignId: number,
  ): Promise<Attachments> {
    console.log('processCampaignImage', file);

    const multerFile = {
      uniqueFilename: `${Date.now()}-campaignImage-${campaignId}-${
        file?.originalname ?? ''
      }`,
      buffer: file.buffer,
      originalname: file.originalname,
    };
    console.log(multerFile);
    // Ensure the /files directory exists
    const directoryPath = path.join(__dirname, '..', '..', '..', 'files');
    fs.mkdirSync(directoryPath, { recursive: true });

    // Write the file to the /files folder
    const filePath = path.join(directoryPath, multerFile.uniqueFilename);

    fs.writeFile(filePath, multerFile.buffer, (error) => {
      if (error) {
        console.error('Error writing file:', error);
      }
    });

    // console.log(multerFile, `/public/${multerFile.uniqueFilename}`);

    const a = await this.prisma.campaign.update({
      data: {
        imageUrl: `/public/${multerFile.uniqueFilename}`,
      },
      where: { id: campaignId },
    });

    console.log(a);

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: `-campaignImage-${campaignId}`,
        },
      },
    });

    return await this.prisma.attachments.create({
      data: {
        uniqueFilename: multerFile.uniqueFilename,
        originalFilename: file.originalname,
        fileSize: file.buffer.length,
      },
    });
  }

  async processAttachment(
    file: MulterFileDTO,
    userEmail: string,
    // campaignId: number,
  ): Promise<void> {
    const multerFile = {
      uniqueFilename: `${Date.now()}-${file?.originalname ?? ''}`,
      buffer: file.buffer,
      originalname: file.originalname,
      userEmail: userEmail,
    };

    // Ensure the /files directory exists
    const directoryPath = path.join(__dirname, '..', '..', '..', 'files');
    fs.mkdirSync(directoryPath, { recursive: true });

    // Write the file to the /files folder
    const filePath = path.join(directoryPath, multerFile.uniqueFilename);

    fs.writeFile(filePath, multerFile.buffer, (error) => {
      if (error) {
        console.error('Error writing file:', error);
      }
    });

    // await this.prisma.attachments.deleteMany({
    //   where: {
    //     uniqueFilename: {
    //       contains: userEmail,
    //     },
    //     userEmail,
    //   },
    // });

    // id               Int      @id @default(autoincrement())
    // uniqueFilename   String
    // originalFilename String
    // fileSize         Int
    // createdAt        DateTime @default(now())
    // updatedAt        DateTime @updatedAt
    // user             User     @relation(fields: [userEmail], references: [email])
    // userEmail        String

    await this.prisma.attachments.create({
      data: {
        uniqueFilename: multerFile.uniqueFilename,
        originalFilename: file.originalname,
        fileSize: file.buffer.length,
        // campaignId,
      },
    });

    // await this.prisma.user.update({
    //   data: {
    //     urlProfilePicture: `/public/${multerFile.uniqueFilename}`,
    //   },
    //   where: { email: userEmail },
    // });
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
    sort: sortFields<User>;
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

      const where: Prisma.UserWhereInput = name
        ? {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          }
        : undefined;

      const findManyPayload: Prisma.UserFindManyArgs<DefaultArgs> = {
        // take: pageSize,
        skip: start,
        orderBy: orderBy,
        include: { campaign: true },
      };

      if (where !== undefined) {
        findManyPayload.where = where;
      }

      const result = await this.prisma.user.findMany(findManyPayload);

      return {
        result,
        total:
          where !== undefined
            ? await this.prisma.user.count({ where })
            : await this.prisma.user.count(),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { campaign: true },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto as Prisma.PostsUpdateInput,
    });
  }

  async remove(id: number): Promise<User | null> {
    return await this.prisma.user.delete({ where: { id } });
  }
}
