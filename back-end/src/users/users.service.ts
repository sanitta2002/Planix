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

@Injectable()
export class UsersService implements IUserServicePRO {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
  ) {}
  async updateProfile(
    userId: string,
    dto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.updateById(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });
    return {
      message: 'Profile updated successfully',
      data: {
        userId: dto.userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    };
  }
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = dto;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await this.hashingService.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }
    const hashedPassword = await this.hashingService.hashPassword(newPassword);
    const update = await this.userRepository.updateById(userId, {
      password: hashedPassword,
    });
    if (!update) {
      throw new ConflictException('Failed to change password');
    }
  }
}
