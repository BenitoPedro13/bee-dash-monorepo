import { Test, TestingModule } from '@nestjs/testing';
import { PostsPackController } from './posts-pack.controller';
import { PostsPackService } from './posts-pack.service';

describe('PostsPackController', () => {
  let controller: PostsPackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsPackController],
      providers: [PostsPackService],
    }).compile();

    controller = module.get<PostsPackController>(PostsPackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
