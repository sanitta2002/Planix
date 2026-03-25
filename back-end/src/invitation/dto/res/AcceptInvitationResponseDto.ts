export class AcceptInvitationResponseDto {
  accessToken?: string;

  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'USER' | 'ADMIN';
  };

  needsProfileCompletion?: boolean;
  email?: string;
  token?: string;
}
