import { Test, TestingModule } from '@nestjs/testing';
import { SubPlanController } from './sub-plan.controller';

describe('SubPlanController', () => {
  let controller: SubPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubPlanController],
    }).compile();

    controller = module.get<SubPlanController>(SubPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
