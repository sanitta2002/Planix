export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isEmailVerified: boolean;
    avatarUrl?: string;
  };
}
