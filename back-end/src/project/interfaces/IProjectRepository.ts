import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { ProjectDocument } from '../Model/project.schema';

export interface IprojectRepository extends IBaseRepository<ProjectDocument> {
  getProjectByKey(
    workspaceId: string,
    key: string,
  ): Promise<ProjectDocument | null>;
  getAllProject(): Promise<ProjectDocument[]>;
}
