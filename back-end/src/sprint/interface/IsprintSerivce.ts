import { CreateSprintDto } from '@/sprint/dto/req/CreateSprintDto';
import { UpdateSprintDto } from '@/sprint/dto/req/UpdateSprintDto ';
import { SprintResponse } from '@/sprint/dto/res/SprintResponse';
import { BurndownResponse } from '../dto/res/BurndownResponse';

export interface ISprintservice {
  createSprint(dto: CreateSprintDto, userId: string): Promise<SprintResponse>;
  getSprintsByProject(projectId: string): Promise<SprintResponse[]>;
  startSprint(
    dto: UpdateSprintDto,
    sprintId: string,
    userId: string,
  ): Promise<SprintResponse>;
  completeSprint(
    dto: UpdateSprintDto,
    sprintId: string,
    userId: string,
  ): Promise<SprintResponse>;
  getBurndownData(sprintId: string): Promise<BurndownResponse>;
}
