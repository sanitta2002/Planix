import { ChangePasswordDto } from 'src/users/dto/ReqDto/ChangePasswordDto';
import { UpdateProfileReqDto } from 'src/users/dto/ReqDto/UpdateProfileReqDto';
import { UpdateProfileResponseDTO } from 'src/users/dto/ResDto/UpdateProfileResponseDTO';

export interface IUserServicePRO {
  updateProfile(
    userId: string,
    dto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResponseDTO>;
  changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
}
