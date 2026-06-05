import { ChangePasswordDto } from '@/users/dto/ReqDto/ChangePasswordDto';
import { UpdateProfileReqDto } from '@/users/dto/ReqDto/UpdateProfileReqDto';
import { UploadAvatarReqDto } from '@/users/dto/ReqDto/UploadAvatarReqDto';
import { UpdateProfileResponseDTO } from '@/users/dto/ResDto/UpdateProfileResponseDTO';
import { UploadAvatarResDto } from '@/users/dto/ResDto/UploadAvatarResDto';

export interface IUserServicePRO {
  updateProfile(
    userId: string,
    dto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResponseDTO>;
  changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
  uploadAvatar(
    userId: string,
    dto: UploadAvatarReqDto,
    file: Express.Multer.File,
  ): Promise<UploadAvatarResDto>;
  getProfilePhoto(userId: string): Promise<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
    hasPassword: boolean;
  }>;
}
