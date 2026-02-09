import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserServicePRO } from './interfaces/user/IUserService';
import type { IUserRepository } from './interfaces/user.repository.interface';
import { UpdateProfileReqDto } from './dto/ReqDto/UpdateProfileReqDto';
import { UpdateProfileResponseDTO } from './dto/ResDto/UpdateProfileResponseDTO';
import { ChangePasswordDto } from './dto/ReqDto/ChangePasswordDto';
import type { IHashingService } from 'src/common/hashing/interface/hashing.service.interface';
import type { IS3Service } from 'src/common/s3/interfaces/s3.service.interface';
import { UploadAvatarReqDto } from './dto/ReqDto/UploadAvatarReqDto';
import { UploadAvatarResDto } from './dto/ResDto/UploadAvatarResDto';
import {
  GENERAL_MESSAGES,
  USER_MESSAGES,
} from 'src/common/constants/messages.constant';
import { UserMapper } from 'src/users/mapper/user.mapper';

@Injectable()
export class UsersService implements IUserServicePRO {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
    @Inject('IS3Service') private readonly S3Service: IS3Service,
  ) {}
  async updateProfile(
    userId: string,
    dto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }
    await this.userRepository.updateById(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });
    return UserMapper.toUpdateProfileResponse(
      userId,
      dto.firstName,
      dto.lastName,
      dto.phone,
    );
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = dto;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException(USER_MESSAGES.NOT_FOUND);
    }
    const isMatch = await this.hashingService.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException(USER_MESSAGES.CURRENT_PASSWORD_INCORRECT);
    }
    const hashedPassword = await this.hashingService.hashPassword(newPassword);
    const update = await this.userRepository.updateById(userId, {
      password: hashedPassword,
    });
    if (!update) {
      throw new ConflictException(USER_MESSAGES.CURRENT_PASSWORD_INCORRECT);
    }
  }

  async uploadAvatar(
    userId: string,
    dto: UploadAvatarReqDto,
    file: Express.Multer.File,
  ): Promise<UploadAvatarResDto> {
    // console.log('FILE:', file?.originalname);
    if (!file) {
      throw new BadRequestException(GENERAL_MESSAGES.FILE_REQUIRED);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    if (user.avatarKey) {
      await this.S3Service.deleteFile(user.avatarKey);
    }

    const { key } = await this.S3Service.uploadFile(file, userId, 'avatars');

    await this.userRepository.updateById(userId, {
      avatarKey: key,
    });
    const avatarUrl = await this.S3Service.createSignedUrl(key);
    console.log('avatar updated');
    return UserMapper.toUploadAvatarResponse(key, avatarUrl);
  }

  async getProfilePhoto(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }
    console.log('fetching user');
    const avatarUrl = user.avatarKey
      ? await this.S3Service.createSignedUrl(user.avatarKey)
      : null;
    return UserMapper.toProfileResponse(user, avatarUrl);
  }
}
