import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CsvsModule } from './csvs/csvs.module';
// import { MulterModule } from '@nestjs/platform-express';
import { AttachmentsModule } from './attachments/attachments.module';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CreatorsModule } from './creators/creators.module';
import { SocialNetworksModule } from './social-networks/social-networks.module';
import { PostsPackModule } from './posts-pack/posts-pack.module';
import { CategoriesModule } from './categories/categories.module';
import { InsightsExtractionModule } from './insights-extraction/insights-extraction.module';

@Module({
  imports: [
    PrismaModule,
    CsvsModule,
    AttachmentsModule,
    S3Module,
    AuthModule,
    UsersModule,
    PostsModule,
    CampaignsModule,
    CreatorsModule,
    SocialNetworksModule,
    PostsPackModule,
    CategoriesModule,
    InsightsExtractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
