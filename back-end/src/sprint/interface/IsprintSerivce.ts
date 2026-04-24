import { CreateSprintDto } from '../dto/req/CreateSprintDto';
import { UpdateSprintDto } from '../dto/req/UpdateSprintDto ';
import { SprintResponse } from '../dto/res/SprintResponse';

export interface ISprintservice {
  createSprint(dto: CreateSprintDto, userId: string): Promise<SprintResponse>;
  getSprintsByProject(projectId: string): Promise<SprintResponse[]>;
  startSprint(dto: UpdateSprintDto, sprintId: string): Promise<SprintResponse>;
  completeSprint(
    dto: UpdateSprintDto,
    sprintId: string,
  ): Promise<SprintResponse>;
}
