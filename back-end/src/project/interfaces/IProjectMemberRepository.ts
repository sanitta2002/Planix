import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { ProjectMemberDocument } from '@/project/Model/ProjectMember/projectMember.schema';
import { AddProjectMemberDto } from '@/project/dto/req/AddProjectMemberDTO';
import { PopulatedProjectMember } from '@/common/type/Populated';

export interface IProjectMemberRepository extends IBaseRepository<ProjectMemberDocument> {
  addMembersToProject(dto: AddProjectMemberDto): Promise<ProjectMemberDocument>;
  getProjectMembers(projectId: string): Promise<PopulatedProjectMember[]>;
  findProjectAndUser(
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberDocument | null>;
  removeMember(projectId: string, userId: string);
}
