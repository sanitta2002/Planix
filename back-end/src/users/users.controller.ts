import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import type { Request } from 'express';
import { UpdateProfileReqDto } from './dto/ReqDto/UpdateProfileReqDto';
import { ChangePasswordDto } from './dto/ReqDto/ChangePasswordDto';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    email?: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Patch('profile')
  updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateProfileReqDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }
  @Patch('change-password')
  changePassword(@Req() req: AuthRequest, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto);
  }
}
