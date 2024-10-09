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
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UsersService {
  private s3Client: S3Client;

  constructor(private readonly prisma: PrismaService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION, // e.g., 'us-east-1'
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({
      data: createUserDto as Prisma.UserCreateInput,
    });
  }

  private async uploadToS3(
    fileBuffer: Buffer,
    fileName: string,
    bucketName: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName, // S3 object key (file name)
      Body: fileBuffer, // File content
      ContentType: 'image/jpeg', // Adjust based on file type
    });

    const response = await this.s3Client.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } else {
      throw new Error('Failed to upload file to S3');
    }
  }

  async processProfileImage(file: MulterFileDTO, userEmail: string) {
    const nameToSaveOnDB = `${Date.now()}-${userEmail}-${
      file?.originalname ?? ''
    }`;

    // Upload to S3 instead of saving locally
    const fileUrl = await this.uploadToS3(
      file.buffer,
      nameToSaveOnDB,
      process.env.AWS_BUCKET_NAME, // S3 bucket name from env
    );

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: userEmail,
        },
      },
    });

    return await this.prisma.user.update({
      data: {
        urlProfilePicture: fileUrl, // Save S3 URL in DB
      },
      where: { email: userEmail },
    });
  }

  async processCreatorImage(
    file: MulterFileDTO,
    creatorId: number,
  ): Promise<Attachments> {
    const nameToSaveOnDB = `${Date.now()}-creatorImage-${creatorId}-${
      file?.originalname ?? ''
    }`;

    // Upload to S3
    const fileUrl = await this.uploadToS3(
      file.buffer,
      nameToSaveOnDB,
      process.env.AWS_BUCKET_NAME,
    );

    await this.prisma.creator.update({
      data: {
        urlProfilePicture: fileUrl, // Save S3 URL in DB
      },
      where: { id: creatorId },
    });

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: `-creatorImage-${creatorId}`,
        },
      },
    });

    return await this.prisma.attachments.create({
      data: {
        uniqueFilename: nameToSaveOnDB,
        originalFilename: file.originalname,
        fileSize: file.buffer.length,
      },
    });
  }

  async processCampaignImage(
    file: MulterFileDTO,
    campaignId: number,
  ): Promise<Attachments> {
    const nameToSaveOnDB = `${Date.now()}-campaignImage-${campaignId}-${
      file?.originalname ?? ''
    }`;

    // Upload to S3
    const fileUrl = await this.uploadToS3(
      file.buffer,
      nameToSaveOnDB,
      process.env.AWS_BUCKET_NAME,
    );

    console.log('fileUrl', fileUrl);

    await this.prisma.campaign.update({
      data: {
        imageUrl: fileUrl, // Save S3 URL in DB
      },
      where: { id: campaignId },
    });

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: `-campaignImage-${campaignId}`,
        },
      },
    });

    return await this.prisma.attachments.create({
      data: {
        uniqueFilename: nameToSaveOnDB,
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
