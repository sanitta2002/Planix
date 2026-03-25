import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { UpdateProfileReqDto } from './dto/ReqDto/UpdateProfileReqDto';
import { ChangePasswordDto } from './dto/ReqDto/ChangePasswordDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarReqDto } from './dto/ReqDto/UploadAvatarReqDto';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { USER_MESSAGES } from 'src/common/constants/messages.constant';
import type { IUserServicePRO } from './interfaces/user/IUserService';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    email?: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @Inject('IUserServicePRO') private readonly _usersService: IUserServicePRO,
  ) {}
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateProfileReqDto) {
    const updatedProfile = this._usersService.updateProfile(
      req.user.userId,
      dto,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      USER_MESSAGES.PROFILE_UPDATED,
      updatedProfile,
    );
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Req() req: AuthRequest, @Body() dto: ChangePasswordDto) {
    const result = this._usersService.changePassword(req.user.userId, dto);
    return ApiResponse.success(
      HttpStatus.OK,
      USER_MESSAGES.PASSWORD_CHANGED,
      result,
    );
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadAvatar(
    @Req() req: AuthRequest,
    @Body() dto: UploadAvatarReqDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarResponse = await this._usersService.uploadAvatar(
      req.user.userId,
      dto,
      file,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      USER_MESSAGES.AVATAR_UPLOADED,
      avatarResponse,
    );
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: AuthRequest) {
    const profileResponse = await this._usersService.getProfilePhoto(
      req.user.userId,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      'Profile fetched successfully',
      profileResponse,
    );
  }
}
