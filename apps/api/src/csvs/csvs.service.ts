import csvParser from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createReadStream } from 'fs';
import { Influencer } from './dto/create-csv.dto';

import 'dotenv/config';
import fs from 'fs';

import path from 'path';
import { sortFields, sortOrder } from 'types/queyParams';
import { Performance, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { UpdateCsvDto } from './dto/update-csv.dto';
import { getFilePath, getFilesFolderPath } from 'utils';
import { CreatorService } from '../../externDB/services/CreatorService';
export type MulterFileDTO = {
  uniqueFilename: string;
  buffer: Buffer;
  originalname: string;
  userEmail: string;
};

@Injectable()
export class CsvsService {
  constructor(
    private readonly prisma: PrismaService,
    private creatorService: CreatorService,
  ) {}

  async processCsv(file: MulterFileDTO, userEmail: string): Promise<void> {
    const multerFile = {
      uniqueFilename: `${Date.now()}-${file?.originalname ?? ''}`,
      buffer: file.buffer,
      originalname: file.originalname,
      userEmail: userEmail,
    };

    // Ensure the /files directory exists
    const directoryPath = getFilesFolderPath(__dirname);

    fs.mkdirSync(directoryPath, { recursive: true });

    // Write the file to the /files folder
    const filePath = path.join(directoryPath, multerFile.uniqueFilename);

    fs.writeFile(filePath, multerFile.buffer, (error) => {
      if (error) {
        console.error('Error writing file:', error);
      }
    });

    await this.prisma.performance.deleteMany({
      where: {
        userEmail,
      },
    });

    // id               Int      @id @default(autoincrement())
    // uniqueFilename   String
    // originalFilename String
    // fileSize         Int
    // createdAt        DateTime @default(now())
    // updatedAt        DateTime @updatedAt
    // user             User     @relation(fields: [userEmail], references: [email])
    // userEmail        String

    await this.prisma.performance.create({
      data: {
        uniqueFilename: multerFile.uniqueFilename,
        originalFilename: file.originalname,
        fileSize: file.buffer.length,
        userEmail: userEmail,
      },
    });
  }

  addCPToTable = (creator: Influencer) => {
    console.log(creator, 'creator');

    const engajamento =
      Number.parseInt(creator['Impacto Bruto']) /
      Number.parseInt(
        creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
      );

    const engajamentoTiktok =
      Number.parseInt(creator['Impacto Bruto Tiktok']) /
      Number.parseInt(
        creator['Impressoes Tiktok'] === '0'
          ? '1'
          : creator['Impressoes Tiktok'],
      );

    const cpe = Number.parseInt(creator['Investimento']) / engajamentoTiktok;
    const cpeTiktok =
      Number.parseInt(creator['Investimento']) / engajamentoTiktok;

    const cpc =
      Number.parseInt(creator['Investimento']) /
      Number.parseInt(creator['Cliques'] === '0' ? '1' : creator['Cliques']);

    const cpcTiktok =
      Number.parseInt(creator['Investimento']) /
      Number.parseInt(
        creator['Cliques Tiktok'] === '0' ? '1' : creator['Cliques Tiktok'],
      );

    const cpv =
      Number.parseInt(creator['Investimento']) /
      (Number.parseInt(
        creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
      ) /
        1000);

    const cpvTiktok =
      Number.parseInt(creator['Investimento']) /
      (Number.parseInt(
        creator['Impressoes Tiktok'] === '0'
          ? '1'
          : creator['Impressoes Tiktok'],
      ) /
        1000);

    const posts =
      Number.parseInt(creator['Reels']) +
      Number.parseInt(creator['Tiktok']) +
      Number.parseInt(creator['Stories']) +
      Number.parseInt(creator['Feed']);

    creator['Posts'] = posts.toString();

    creator['Engajamento'] = engajamento.toFixed(2) + '%';
    creator['CPE'] = 'R$' + cpe.toFixed(2);

    creator['Engajamento Tiktok'] = engajamento.toFixed(2) + '%';
    creator['CPE Tiktok'] = 'R$' + cpeTiktok.toFixed(2);

    creator['CPC'] = 'R$' + cpc.toFixed(2);
    creator['CPC Tiktok'] = 'R$' + cpcTiktok.toFixed(2);

    creator['CPV'] = 'R$' + cpv.toFixed(2);
    creator['CPV Tiktok'] = 'R$' + cpvTiktok.toFixed(2);
  };

  async getAllData(userEmail: string): Promise<{
    updatedAt: Date;
    data: Influencer[];
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user.byPosts) {
      const performanceFile = await this.prisma.performance.findFirst({
        where: { userEmail: userEmail },
      });

      if (!performanceFile) {
        return { updatedAt: null, data: [] };
      }

      const filePath = getFilePath(__dirname, performanceFile.uniqueFilename);

      try {
        const results: any[] = [];
        const stream = createReadStream(filePath);

        const result = await new Promise<Influencer[]>((resolve, reject) => {
          stream
            .pipe(csvParser())
            .on('data', (data) => {
              console.log('data', this.addCPToTable(data));
              return results.push(data);
            })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
        });

        return {
          updatedAt: performanceFile.updatedAt,
          data: result,
        };
      } catch (error) {
        console.log('error getAllData: ', error);
      }
    }

    const mostRecentUpdatedPost = await this.prisma.posts.findFirst({
      where: {
        user: { email: user.email },
      },
      orderBy: { updatedAt: 'desc' },
      take: 1,
    });

    const posts = await this.prisma.posts.findMany({
      where: { user: { email: user.email } },
    });

    console.log('posts.length', posts.length);

    const creatorsData = await this.processPostsData(posts);

    return {
      updatedAt: mostRecentUpdatedPost.updatedAt,
      data: creatorsData,
    };
  }

  async processPostsData(posts: any[]): Promise<Influencer[]> {
    const groupedPosts = posts.reduce((acc, post) => {
      if (!acc[post.creatorId]) {
        acc[post.creatorId] = [];
      }
      acc[post.creatorId].push(post);
      return acc;
    }, {});

    console.log('groupedPosts', groupedPosts);

    const influencers: Influencer[] = [];

    for (const creatorId in groupedPosts) {
      const posts = groupedPosts[creatorId];
      const influencerData = await this.getCreatorData(creatorId, posts);
      influencers.push(influencerData);
    }

    return influencers;
  }

  async getCreatorData(creatorId: string, posts: any[]): Promise<Influencer> {
    const creatorInfo = await this.creatorService.getCreatorById(creatorId);
    console.log('creatorId', creatorId);

    const { name, profile, city, image, creator_id } = creatorInfo[0];

    const sum = (key, type = null) =>
      posts
        .filter((post) => (type ? post.type === type : true))
        .reduce((acc, post) => acc + post[key], 0);
    const count = (type) => posts.filter((post) => post.type === type).length;

    const feedStoriesPosts = posts.filter(
      (post) => post.type === 'FEED' || post.type === 'STORIES',
    );

    const engagementAvg = feedStoriesPosts.length
      ? sum('engagement', 'FEED') +
        sum('engagement', 'STORIES') / feedStoriesPosts.length
      : 0;

    return {
      id: creator_id,
      Influencer: name,
      Username: profile,
      Cidade: city ?? '-',
      Investimento: sum('price').toString(),
      Posts: posts.length.toString(),
      Stories: count('STORIES').toString(),
      Feed: count('FEED').toString(),
      Tiktok: count('TIKTOK').toString(),
      Impressoes: feedStoriesPosts.length
        ? sum('impressions', 'FEED') + sum('impressions', 'STORIES').toString()
        : '0',
      Interacoes: feedStoriesPosts.length
        ? sum('interactions', 'FEED') +
          sum('interactions', 'STORIES').toString()
        : '0',
      Cliques: feedStoriesPosts.length
        ? sum('clicks', 'FEED') + sum('clicks', 'STORIES').toString()
        : '0',
      'Video Views': sum('isVideo') ? sum('videoViews').toString() : '0',
      CPE: `R$${(sum('price') / (engagementAvg || 1)).toFixed(2)}`,
      CTR: ((sum('clicks') / (sum('impressions') || 1)) * 100).toFixed(2) + '%',
      CPC: `R$${(sum('price') / (sum('clicks') || 1)).toFixed(2)}`,
      CPV: sum('isVideo')
        ? `R$${(sum('price') / (sum('videoViews') || 1)).toFixed(2)}`
        : 'R$0.00',
      Engajamento: feedStoriesPosts.length
        ? (
            sum('engagement', 'FEED') +
            sum('engagement', 'STORIES') / feedStoriesPosts.length
          ).toFixed(2) + '%'
        : '0%',
      'Engajamento Tiktok': count('TIKTOK')
        ? (sum('engagement', 'TIKTOK') / (count('TIKTOK') || 1)).toFixed(2) +
          '%'
        : '0%',
      'Cliques Tiktok': sum('clicks', 'TIKTOK').toString(),
      'Impressoes Tiktok': sum('impressions', 'TIKTOK').toString(),
      'Url Foto Perfil': image,
    };
  }

  async findAll({
    start,
    end,
    sort,
    order,
  }: // name,
  {
    start: number;
    end: number;
    sort: sortFields<Performance>;
    order: sortOrder;
    // name: string | null;
  }) {
    try {
      const orderBy = sort.map((item, index) => {
        return {
          [item]: order[index],
        };
      });

      const pageSize = end - start;

      const findManyPayload: Prisma.PerformanceFindManyArgs<DefaultArgs> = {
        take: pageSize,
        skip: start,
        orderBy: orderBy,
      };

      const result = await this.prisma.performance.findMany(findManyPayload);

      return {
        result,
        total: await this.prisma.performance.count(),
      };
    } catch (error) {
      console.log('CsvsService.findAll: ', error);
    }
  }

  findOne(id: number) {
    try {
      return this.prisma.performance.findUnique({ where: { id } });
    } catch (error) {
      console.log('CsvsService.findOne: ', error);
    }
  }

  // update(id: number, updateCsvDto: UpdateCsvDto) {
  //   return `This action updates a #${id} csv`;
  // }

  async update(
    id: number,
    updateCsvDto: UpdateCsvDto,
  ): Promise<Performance | null> {
    return this.prisma.performance.update({
      where: { id },
      data: updateCsvDto as any,
    });
  }

  async remove(id: number): Promise<Performance | null> {
    return this.prisma.performance.delete({ where: { id } });
  }
}
