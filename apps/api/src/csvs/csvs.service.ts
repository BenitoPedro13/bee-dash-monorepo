import csvParser from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import 'dotenv/config';

import { sortFields, sortOrder } from 'types/queyParams';
import { Performance, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { UpdateCsvDto } from './dto/update-csv.dto';
import { S3Service } from 'src/s3/s3.service';

// import { CreatorService } from '../../externDB/services/CreatorService';
export type MulterFileDTO = {
  uniqueFilename: string;
  buffer: Buffer;
  originalname: string;
  userEmail: string;
  mimetype?: string;
};

@Injectable()
export class CsvsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async processCsv(
    file: MulterFileDTO,
    userEmail: string,
    campaignId: number,
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
      file.mimetype ?? 'text/csv',
    );

    await this.prisma.performance.deleteMany({
      where: {
        campaignId,
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
        campaignId,
      },
    });
  }

  addCPToTable = (creator: any) => {
    const engajamento =
      (Number.parseInt(creator['Interacoes']) /
        Number.parseInt(
          creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
        )) *
      100;

    const engajamentoTiktok =
      (Number.parseInt(creator['Interacoes Tiktok']) /
        Number.parseInt(
          creator['Impressoes Tiktok'] === '0'
            ? '1'
            : creator['Impressoes Tiktok'],
        )) *
      100;

    const engajamentoMedium =
      ((Number.parseInt(creator['Interacoes']) +
        Number.parseInt(creator['Interacoes Tiktok'])) /
        (Number.parseInt(creator['Impressoes']) +
          Number.parseInt(creator['Impressoes Tiktok']))) *
      100;

    const cpe = Number.parseInt(creator['Investimento']) / engajamento;
    const cpeTiktok =
      Number.parseInt(creator['Investimento']) /
      (engajamentoTiktok === 0 ? 1 : engajamentoTiktok);

    const cpeMedium =
      Number.parseInt(creator['Investimento']) / engajamentoMedium;

    const cpc =
      Number.parseInt(creator['Investimento']) /
      Number.parseInt(creator['Cliques'] === '0' ? '1' : creator['Cliques']);

    const cpcTiktok =
      Number.parseInt(creator['Investimento']) /
      Number.parseInt(
        creator['Cliques Tiktok'] === '0' ? '1' : creator['Cliques Tiktok'],
      );

    const cpcMedium =
      Number.parseInt(creator['Investimento']) /
      (Number.parseInt(creator['Cliques Tiktok']) +
        Number.parseInt(creator['Cliques']));

    const ctr =
      (Number.parseInt(creator['Cliques']) /
        Number.parseInt(
          creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
        )) *
      100;

    const ctrTiktok =
      (Number.parseInt(creator['Cliques Tiktok']) /
        Number.parseInt(
          creator['Impressoes Tiktok'] === '0'
            ? '1'
            : creator['Impressoes Tiktok'],
        )) *
      100;

    const cpv =
      Number.parseInt(creator['Investimento']) /
      Number.parseInt(
        creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
      );

    const cpvTiktok =
      Number.parseInt(creator['Investimento']) /
      Number.parseInt(
        creator['Impressoes Tiktok'] === '0'
          ? '1'
          : creator['Impressoes Tiktok'],
      );

    const cpvMedium =
      Number.parseInt(creator['Investimento']) /
      (Number.parseInt(creator['Impressoes Tiktok']) +
        Number.parseInt(creator['Impressoes']));

    const posts =
      Number.parseInt(creator['Reels']) +
      Number.parseInt(creator['Tiktok']) +
      Number.parseInt(creator['Stories']) +
      Number.parseInt(creator['Feed']);

    creator['Posts'] = posts.toString();

    creator['Engajamento'] =
      (engajamento === +creator['Impressoes'] * 100 ? 0 : engajamento).toFixed(
        2,
      ) + '%';
    creator['CPE'] =
      'R$' + (cpe === +creator['Investimento'] ? 0 : cpe).toFixed(2);

    creator['Engajamento Tiktok'] =
      (engajamentoTiktok === +creator['Impressoes Tiktok'] * 100
        ? 0
        : engajamentoTiktok
      ).toFixed(2) + '%';

    creator['Engajamento Media'] =
      (engajamentoMedium === Infinity ? 0 : engajamentoMedium).toFixed(2) + '%';

    creator['CPE Tiktok'] =
      'R$' +
      (cpeTiktok === +creator['Investimento'] ? 0 : cpeTiktok).toFixed(2);

    creator['CPE Media'] =
      'R$' + (cpeMedium === Infinity ? 0 : cpeMedium).toFixed(2);

    creator['CPC'] =
      'R$' + (cpc === +creator['Investimento'] ? 0 : cpc).toFixed(2);
    creator['CPC Tiktok'] =
      'R$' +
      (cpcTiktok === +creator['Investimento'] ? 0 : cpcTiktok).toFixed(2);

    creator['CTR'] =
      (ctr === +creator['Cliques'] * 100 ? 0 : ctr).toFixed(2) + '%';
    creator['CTR Tiktok'] =
      (ctrTiktok === +creator['Cliques Tiktok'] * 100 ? 0 : ctrTiktok).toFixed(
        2,
      ) + '%';

    creator['CPC Media'] =
      'R$' + (cpcMedium === Infinity ? 0 : cpcMedium).toFixed(2);

    creator['CPV'] = 'R$' + cpv.toFixed(2);
    creator['CPV Tiktok'] =
      'R$' +
      (cpvTiktok === +creator['Investimento'] ? 0 : cpvTiktok).toFixed(2);
    creator['CPV Media'] =
      'R$' + (cpvMedium === Infinity ? 0 : cpvMedium).toFixed(2);
  };

  addCPToPostsTable = (creator: any) => {
    const engajamento =
      (Number.parseInt(creator['Interacoes']) /
        Number.parseInt(
          creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
        )) *
      100;

    const engajamentoTiktok =
      (Number.parseInt(creator['Interacoes Tiktok']) /
        Number.parseInt(
          creator['Impressoes Tiktok'] === '0'
            ? '1'
            : creator['Impressoes Tiktok'],
        )) *
      100;

    const engajamentoMedium =
      ((Number.parseInt(creator['Interacoes']) +
        Number.parseInt(creator['Interacoes Tiktok'])) /
        (Number.parseInt(creator['Impressoes']) +
          Number.parseInt(creator['Impressoes Tiktok']))) *
      100;

    const cpe = creator['Investimento Instagram'] / engajamento;
    const cpeTiktok =
      creator['Investimento Tiktok'] /
      (engajamentoTiktok === 0 ? 1 : engajamentoTiktok);

    const cpeMedium =
      Number.parseInt(creator['Investimento']) / engajamentoMedium;

    const cpc =
      creator['Investimento Instagram'] /
      Number.parseInt(creator['Cliques'] === '0' ? '1' : creator['Cliques']);

    const cpcTiktok =
      creator['Investimento Tiktok'] /
      Number.parseInt(
        creator['Cliques Tiktok'] === '0' ? '1' : creator['Cliques Tiktok'],
      );

    const cpcMedium =
      Number.parseInt(creator['Investimento']) /
      (Number.parseInt(creator['Cliques Tiktok']) +
        Number.parseInt(creator['Cliques']));

    const ctr =
      (Number.parseInt(creator['Cliques']) /
        Number.parseInt(
          creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
        )) *
      100;

    const ctrTiktok =
      (Number.parseInt(creator['Cliques Tiktok']) /
        Number.parseInt(
          creator['Impressoes Tiktok'] === '0'
            ? '1'
            : creator['Impressoes Tiktok'],
        )) *
      100;

    const cpv =
      creator['Investimento Instagram'] /
      Number.parseInt(
        creator['Impressoes'] === '0' ? '1' : creator['Impressoes'],
      );

    const cpvTiktok =
      creator['Investimento Tiktok'] /
      Number.parseInt(
        creator['Impressoes Tiktok'] === '0'
          ? '1'
          : creator['Impressoes Tiktok'],
      );

    const cpvMedium =
      Number.parseInt(creator['Investimento']) /
      (Number.parseInt(creator['Impressoes Tiktok']) +
        Number.parseInt(creator['Impressoes']));

    creator['Engajamento'] =
      (engajamento === +creator['Impressoes'] * 100 ? 0 : engajamento).toFixed(
        2,
      ) + '%';
    creator['CPE'] =
      'R$' + (cpe === creator['Investimento Instagram'] ? 0 : cpe).toFixed(2);

    creator['Engajamento Tiktok'] =
      (engajamentoTiktok === +creator['Impressoes Tiktok'] * 100
        ? 0
        : engajamentoTiktok
      ).toFixed(2) + '%';

    creator['Engajamento Media'] =
      (engajamentoMedium === Infinity ? 0 : engajamentoMedium).toFixed(2) + '%';

    creator['CPE Tiktok'] =
      'R$' +
      (cpeTiktok === creator['Investimento Tiktok'] ? 0 : cpeTiktok).toFixed(2);

    creator['CPE Media'] =
      'R$' + (cpeMedium === Infinity ? 0 : cpeMedium).toFixed(2);

    creator['CPC'] =
      'R$' + (cpc === creator['Investimento Instagram'] ? 0 : cpc).toFixed(2);
    creator['CPC Tiktok'] =
      'R$' +
      (cpcTiktok === creator['Investimento Tiktok'] ? 0 : cpcTiktok).toFixed(2);

    creator['CTR'] =
      (ctr === +creator['Cliques'] * 100 ? 0 : ctr).toFixed(2) + '%';
    creator['CTR Tiktok'] =
      (ctrTiktok === +creator['Cliques Tiktok'] * 100 ? 0 : ctrTiktok).toFixed(
        2,
      ) + '%';

    creator['CPC Media'] =
      'R$' + (cpcMedium === Infinity ? 0 : cpcMedium).toFixed(2);

    creator['CPV'] =
      'R$' + (cpv === creator['Investimento Instagram'] ? 0 : cpv).toFixed(2);
    creator['CPV Tiktok'] =
      'R$' +
      (cpvTiktok === creator['Investimento Tiktok'] ? 0 : cpvTiktok).toFixed(2);
    creator['CPV Media'] =
      'R$' + (cpvMedium === Infinity ? 0 : cpvMedium).toFixed(2);
  };

  async getAllData(userEmail: string, campaignId: number) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign.byPosts) {
      const performanceFile = await this.prisma.performance.findFirst({
        where: { campaignId },
      });

      if (!performanceFile) {
        return { updatedAt: null, data: [] };
      }

      try {
        const results: any[] = [];
        const { stream } = await this.s3Service.getObject(
          performanceFile.uniqueFilename,
        );

        const result = await new Promise<any[]>((resolve, reject) => {
          stream
            .pipe(csvParser())
            .on('data', (data) => {
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
        postsPack: { campaignId },
      },
      orderBy: { updatedAt: 'desc' },
      take: 1,
    });

    const posts = await this.prisma.posts.findMany({
      where: {
        postsPack: { campaignId },
      },
      include: {
        socialNetwork: true,
        postsPack: {
          include: {
            creator: {
              include: {
                socialNetworks: true,
              },
            },
          },
        },
      },
    });

    await Promise.all(
      posts.map(async (post) => {
        const creatorId = post.socialNetwork.creatorId;

        post.postsPack.creator.urlProfilePicture =
          await this.s3Service.findPublicUrlBySubstring(
            `-creatorImage-${creatorId}-`,
          );
      }),
    );

    const groupedPosts = posts.reduce((acc, post) => {
      if (!acc[post.socialNetwork.creatorId]) {
        acc[post.socialNetwork.creatorId] = [];
      }
      acc[post.socialNetwork.creatorId].push(post);
      return acc;
    }, {});

    const influencers: any[] = [];

    for (const creatorId in groupedPosts) {
      const posts = groupedPosts[creatorId];
      // const influencerData = await this.getCreatorData(+creatorId, posts);

      const groupedPostsPack = posts.reduce((acc, post) => {
        if (!acc[post.postsPack.id]) {
          acc[post.postsPack.id] = post.postsPack;
        }
        return acc;
      }, {});

      const groupedPostsByPostsPack = posts.reduce((acc, post) => {
        if (!acc[post.postsPack.id]) {
          acc[post.postsPack.id] = [];
        }
        acc[post.postsPack.id].push(post);
        return acc;
      }, {});

      let registrations = 0;

      for (const postsPackId in groupedPostsPack) {
        let mediumPrice = 0;

        const postsPack = groupedPostsPack[postsPackId];
        const posts = groupedPostsByPostsPack[postsPackId];

        registrations += postsPack.registrations;
        mediumPrice = postsPack.price / posts.length;

        groupedPostsByPostsPack[postsPackId].forEach(
          (item) => (item.mediumPrice = mediumPrice),
        );
      }

      let price = 0;

      for (const postsPackId in groupedPostsByPostsPack) {
        const postsOfpostPack = groupedPostsByPostsPack[postsPackId];

        price += postsOfpostPack.reduce((acc, post) => {
          return acc + (post.mediumPrice ?? 0);
        }, 0);
      }

      const { name, urlProfilePicture, city } = posts[0].postsPack.creator;

      const instagram = posts[0].postsPack.creator.socialNetworks.find(
        (item) => item.type === 'INSTAGRAM',
      );

      const tiktok = posts[0].postsPack.creator.socialNetworks.find(
        (item) => item.type === 'TIKTOK',
      );

      const sum = (key, type = null) =>
        posts
          .filter((post) => (type ? post.type === type : true))
          .reduce((acc, post) => acc + post[key], 0);
      const count = (type) => posts.filter((post) => post.type === type).length;

      const feedStoriesPosts = posts.filter(
        (post) =>
          post.type === 'FEED' ||
          post.type === 'STORIES' ||
          post.type === 'REELS',
      );

      const instagramInvestment =
        feedStoriesPosts.length === 0
          ? 0
          : feedStoriesPosts.reduce((acc, item) => acc + item.mediumPrice, 0);

      const tiktokInvestment = price - instagramInvestment;

      const creator = {
        id: +creatorId,
        Influencer: name,
        Username: instagram?.username ?? tiktok?.username,
        Cidade: city ?? '-',
        Investimento: price.toString(),
        Cadastros: registrations.toString(),
        'Investimento Instagram': instagramInvestment,
        'Investimento Tiktok': tiktokInvestment,
        Posts: posts.length.toString(),
        Stories: count('STORIES').toString(),
        Feed: count('FEED').toString(),
        Tiktok: count('TIKTOK').toString(),
        Reels: count('REELS').toString(),
        'Impacto Bruto': instagram?.followers?.toString() ?? '0',
        Impressoes: feedStoriesPosts.length
          ? `${
              sum('impressions', 'REELS') +
              sum('impressions', 'FEED') +
              sum('impressions', 'STORIES')
            }`
          : '0',
        Interacoes: feedStoriesPosts.length
          ? `${
              sum('interactions', 'REELS') +
              sum('interactions', 'FEED') +
              sum('interactions', 'STORIES')
            }`
          : '0',
        Cliques: feedStoriesPosts.length
          ? `${
              sum('clicks', 'REELS') +
              sum('clicks', 'FEED') +
              sum('clicks', 'STORIES')
            }`
          : '0',
        'Impacto Bruto Tiktok': tiktok?.followers?.toString() ?? '0',
        'Impressoes Tiktok': count('TIKTOK')
          ? `${sum('impressions', 'TIKTOK')}`
          : '0',
        'Interacoes Tiktok': count('TIKTOK')
          ? `${sum('interactions', 'TIKTOK')}`
          : '0',
        'Cliques Tiktok': count('TIKTOK') ? `${sum('clicks', 'TIKTOK')}` : '0',
        'Url Foto Perfil': urlProfilePicture,
      };

      this.addCPToPostsTable(creator);

      influencers.push(creator);
    }

    return {
      updatedAt: mostRecentUpdatedPost.updatedAt,
      data: influencers,
      posts: posts,
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
        // take: pageSize,
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
