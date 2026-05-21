import { USER_MESSAGES } from '@/common/constants/messages.constant';
import { UpdateProfileResponseDTO } from '@/users/dto/ResDto/UpdateProfileResponseDTO';
import { UploadAvatarResDto } from '@/users/dto/ResDto/UploadAvatarResDto';
import { User } from '@/users/Models/user.schema';

export class UserMapper {
  static toUpdateProfileResponse(
    userId: string,
    firstName: string,
    lastName: string,
    phone: string,
  ): UpdateProfileResponseDTO {
    return {
      message: USER_MESSAGES.PROFILE_UPDATED,
      data: {
        userId,
        firstName,
        lastName,
        phone,
      },
    };
  }
  static toUploadAvatarResponse(
    key: string,
    avatarUrl: string,
  ): UploadAvatarResDto {
    return {
      message: USER_MESSAGES.AVATAR_UPLOADED,
      avatarKey: key,
      avatarUrl,
    };
  }
  static toProfileResponse(user: User, avatarUrl: string | null) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatarUrl: avatarUrl,
    };
  }
}
