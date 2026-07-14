import { Test, TestingModule } from '@nestjs/testing';
import { PostsPackService } from './posts-pack.service';

describe('PostsPackService', () => {
  let service: PostsPackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsPackService],
    }).compile();

    service = module.get<PostsPackService>(PostsPackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
