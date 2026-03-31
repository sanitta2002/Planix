import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { ProjectMemberDocument } from '../Model/ProjectMember/projectMember.schema';
import { AddProjectMemberDto } from '../dto/req/AddProjectMemberDTO';
import { PopulatedProjectMember } from 'src/common/type/Populated';

export interface IProjectMemberRepository extends IBaseRepository<ProjectMemberDocument> {
  addMembersToProject(dto: AddProjectMemberDto): Promise<ProjectMemberDocument>;
  getProjectMembers(projectId: string): Promise<PopulatedProjectMember[]>;
  findProjectAndUser(
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberDocument | null>;
  removeMember(projectId: string, userId: string);
}
