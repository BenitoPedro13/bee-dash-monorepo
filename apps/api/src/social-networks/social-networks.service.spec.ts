import { Test, TestingModule } from '@nestjs/testing';
import { SocialNetworksService } from './social-networks.service';

describe('SocialNetworksService', () => {
  let service: SocialNetworksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialNetworksService],
    }).compile();

    service = module.get<SocialNetworksService>(SocialNetworksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
