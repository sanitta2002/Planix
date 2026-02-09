import { ChangePasswordDto } from 'src/users/dto/ReqDto/ChangePasswordDto';
import { UpdateProfileReqDto } from 'src/users/dto/ReqDto/UpdateProfileReqDto';
import { UploadAvatarReqDto } from 'src/users/dto/ReqDto/UploadAvatarReqDto';
import { UpdateProfileResponseDTO } from 'src/users/dto/ResDto/UpdateProfileResponseDTO';
import { UploadAvatarResDto } from 'src/users/dto/ResDto/UploadAvatarResDto';

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
  getProfilePhoto(userId: string);
}
