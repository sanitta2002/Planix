import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { SprintDocument } from '../Model/sprint.schema';

export interface IsprintRepository extends IBaseRepository<SprintDocument> {
  findByProject(projectId: string): Promise<SprintDocument[]>;
  findActiveSprint(projectId: string): Promise<SprintDocument | null>;
  findPlannedSprint(projectId: string): Promise<SprintDocument | null>;
}
