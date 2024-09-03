import { Module } from '@nestjs/common';
import { PostsPackService } from './posts-pack.service';
import { PostsPackController } from './posts-pack.controller';

@Module({
  controllers: [PostsPackController],
  providers: [PostsPackService],
})
export class PostsPackModule {}
