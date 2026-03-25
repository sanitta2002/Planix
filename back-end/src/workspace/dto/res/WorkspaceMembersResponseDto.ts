import { WorkspaceMemberResponseDto } from './WorkspaceMemberResponseDto';

export class WorkspaceMembersResponseDto {
  workspaceId: string;
  members: WorkspaceMemberResponseDto[];
}
