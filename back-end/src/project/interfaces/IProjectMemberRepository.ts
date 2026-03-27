import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { ProjectMemberDocument } from '../Model/ProjectMember/projectMember.schema';
import { AddProjectMemberDto } from '../dto/req/AddProjectMemberDTO';

export interface IProjectMemberRepository extends IBaseRepository<ProjectMemberDocument> {
  addMembersToProject(dto: AddProjectMemberDto): Promise<ProjectMemberDocument>;
  getProjectMembers(projectId: string): Promise<ProjectMemberDocument[]>;
  findProjectAndUser(
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberDocument | null>;
}
