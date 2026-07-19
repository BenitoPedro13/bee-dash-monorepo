import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sortFields, sortOrder } from 'types/queyParams';
import { Attachments, Prisma, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { MulterFileDTO } from 'src/csvs/csvs.service';
import { CreatorsService } from 'src/creators/creators.service';
import { CampaignsService } from 'src/campaigns/campaigns.service';
import { S3Service } from 'src/s3/s3.service';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly creatorsService: CreatorsService,
    private readonly campaignsService: CampaignsService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({
      data: createUserDto as Prisma.UserCreateInput,
    });
  }

  async processProfileImage(
    file: MulterFileDTO,
    userEmail: string,
    // campaignId: number,
  ) {
    const nameToSaveOnDB = `${Date.now()}-${userEmail}-${
      file?.originalname ?? ''
    }`;
    // console.log('processProfileImage', file);

    const multerFile = {
      uniqueFilename: nameToSaveOnDB,
      buffer: file.buffer,
      originalname: file.originalname,
      userEmail: userEmail,
    };

    await this.s3Service.upload(
      nameToSaveOnDB,
      multerFile.buffer,
      file.mimetype,
    );

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: userEmail,
        },
      },
    });

    // return await this.prisma.user.update({
    //   data: {
    //     urlProfilePicture: `/public/${nameToSaveOnDB}`,
    //   },
    //   where: { email: userEmail },
    // });

    const a = await this.updateByEmail(userEmail, {
      urlProfilePicture: `/public/${nameToSaveOnDB}`,
    });

    console.log('processProfileImage', a);

    this.s3Service.invalidateKeyList();

    return a;
  }

  async processCreatorImage(file: MulterFileDTO, creatorId: number) {
    const nameToSaveOnDB = `${Date.now()}-creatorImage-${creatorId}-${
      file?.originalname ?? ''
    }`;

    const multerFile = {
      uniqueFilename: nameToSaveOnDB,
      buffer: file.buffer,
      originalname: file.originalname,
    };

    await this.s3Service.upload(
      nameToSaveOnDB,
      multerFile.buffer,
      file.mimetype,
    );

    // console.log(multerFile, `/public/${multerFile.uniqueFilename}`);

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: `-creatorImage-${creatorId}`,
        },
      },
    });

    await this.prisma.attachments.create({
      data: {
        uniqueFilename: nameToSaveOnDB,
        originalFilename: file.originalname,
        fileSize: file.buffer.length,
      },
    });

    const a = await this.creatorsService.update(creatorId, {
      urlProfilePicture: `/public/${nameToSaveOnDB}`,
    });

    // const a = await this.prisma.creator.update({
    //   data: {
    //     urlProfilePicture: `/public/${nameToSaveOnDB}`,
    //   },
    //   where: { id: creatorId },
    // });

    console.log('processCreatorImage', a);

    this.s3Service.invalidateKeyList();

    return a;
  }

  async processCampaignImage(file: MulterFileDTO, campaignId: number) {
    const nameToSaveOnDB = `${Date.now()}-campaignImage-${campaignId}-${
      file?.originalname ?? ''
    }`;
    // console.log('processCampaignImage', file);

    const multerFile = {
      uniqueFilename: nameToSaveOnDB,
      buffer: file.buffer,
      originalname: file.originalname,
    };
    console.log(multerFile);

    await this.s3Service.upload(
      nameToSaveOnDB,
      multerFile.buffer,
      file.mimetype,
    );

    // console.log(multerFile, `/public/${multerFile.uniqueFilename}`);

    await this.prisma.attachments.deleteMany({
      where: {
        uniqueFilename: {
          contains: `-campaignImage-${campaignId}`,
        },
      },
    });

    await this.prisma.attachments.create({
      data: {
        uniqueFilename: nameToSaveOnDB,
        originalFilename: file.originalname,
        fileSize: file.buffer.length,
      },
    });

    const a = await this.campaignsService.update(campaignId, {
      imageUrl: `/public/${nameToSaveOnDB}`,
    });

    console.log('processCampaignImage', a);

    this.s3Service.invalidateKeyList();

    return a;
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

    await this.s3Service.upload(
      multerFile.uniqueFilename,
      multerFile.buffer,
      file.mimetype,
    );

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
    email,
  }: {
    start: number;
    end: number;
    sort: sortFields<User>;
    order: sortOrder;
    name: string | null;
    email: string | null;
  }) {
    try {
      const orderBy = sort.map((item, index) => {
        return {
          [item]: order[index],
        };
      });

      const pageSize = end - start;

      const andConditions: Prisma.UserWhereInput[] = [];
      if (name) {
        andConditions.push({ name: { contains: name, mode: 'insensitive' } });
      }
      if (email) {
        andConditions.push({
          email: { contains: email, mode: 'insensitive' },
        });
      }

      const where: Prisma.UserWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : undefined;

      const findManyPayload: Prisma.UserFindManyArgs<DefaultArgs> = {
        take: pageSize,
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
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { campaign: true },
    });

    user.urlProfilePicture = await this.s3Service.findPublicUrlBySubstring(
      `-${user.email}-`,
    );

    return user;
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

  async updateByEmail(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return await this.prisma.user.update({
      where: { email },
      data: updateUserDto as Prisma.PostsUpdateInput,
    });
  }

  async remove(id: number): Promise<User | null> {
    return await this.prisma.user.delete({ where: { id } });
  }
}
