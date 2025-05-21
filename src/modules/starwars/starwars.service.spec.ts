import { Test, TestingModule } from '@nestjs/testing';
import { StarwarsService } from './starwars.service';

describe('StarwarsService', () => {
  let service: StarwarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarwarsService],
    }).compile();

    service = module.get<StarwarsService>(StarwarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
