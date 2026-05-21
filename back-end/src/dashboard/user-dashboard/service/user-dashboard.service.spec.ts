import { Test, TestingModule } from '@nestjs/testing';
import { UserDashboardService } from './user-dashboard.service';

const mockProjectRepository = {};
const mockProjectMemberRepository = {};
const mockIssueRepository = {};
const mockSprintRepository = {};
const mockUserRepository = {};
const mockS3Service = {};

describe('UserDashboardService', () => {
  let service: UserDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDashboardService,
        {
          provide: 'IprojectRepository',
          useValue: mockProjectRepository,
        },
        {
          provide: 'IProjectMemberRepository',
          useValue: mockProjectMemberRepository,
        },
        {
          provide: 'IIssueRepository',
          useValue: mockIssueRepository,
        },
        {
          provide: 'IsprintRepository',
          useValue: mockSprintRepository,
        },
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'IS3Service',
          useValue: mockS3Service,
        },
      ],
    }).compile();

    service = module.get<UserDashboardService>(UserDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
