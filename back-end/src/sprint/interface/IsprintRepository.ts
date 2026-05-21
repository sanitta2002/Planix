import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { SprintDocument } from '@/sprint/Model/sprint.schema';

export interface IsprintRepository extends IBaseRepository<SprintDocument> {
  findByProject(projectId: string): Promise<SprintDocument[]>;
  findActiveSprint(projectId: string): Promise<SprintDocument | null>;
  findPlannedSprint(projectId: string): Promise<SprintDocument | null>;
}
