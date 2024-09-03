import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CsvsModule } from './csvs/csvs.module';
// import { MulterModule } from '@nestjs/platform-express';
import { AttachmentsModule } from './attachments/attachments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CreatorsModule } from './creators/creators.module';
import { SocialNetworksModule } from './social-networks/social-networks.module';
import { PostsPackModule } from './posts-pack/posts-pack.module';

@Module({
  imports: [
    PrismaModule,
    CsvsModule,
    AttachmentsModule,
    ServeStaticModule.forRoot({
      serveRoot: 'public',
      rootPath: join(__dirname, '..', '..', 'files'),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CampaignsModule,
    CreatorsModule,
    SocialNetworksModule,
    PostsPackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
