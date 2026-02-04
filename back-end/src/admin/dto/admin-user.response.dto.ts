import { Expose } from 'class-transformer';

export class AdminUserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phone?: string;

  @Expose()
  isBlocked: boolean;

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  avatarUrl?: string;
}
