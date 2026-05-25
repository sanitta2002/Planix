import { WorkspaceMemberResponseDto } from '@/workspace/dto/res/WorkspaceMemberResponseDto';

export class WorkspaceMembersResponseDto {
  workspaceId: string;
  members: WorkspaceMemberResponseDto[];
}
