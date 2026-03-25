export class WorkspaceMemberResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'owner' | 'member';
  avatarUrl: string | null;
  joinedAt: Date;
}
