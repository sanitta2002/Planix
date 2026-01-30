import { Test, TestingModule } from '@nestjs/testing';
import { AppJwtService } from './jwt.service';

describe('JwtService', () => {
  let service: AppJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppJwtService],
    }).compile();

    service = module.get<AppJwtService>(AppJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
