import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAdminService } from './interface/admin.service.interface';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminResponseDto } from './dto/Admin.login.res.dto';
import type { IJwtService } from 'src/common/jwt/interfaces/jwt.service.interface';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject('IJwtService') private readonly jwtService: IJwtService,
  ) {}
  async login(dto: AdminLoginDto): Promise<AdminResponseDto> {
    const { email, password } = dto;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    const payload = {
      userId: 'ADMIN',
      email: process.env.ADMIN_EMAIL,
      role: 'admin',
    };
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
      admin: { id: 'ADMIN', email: process.env.ADMIN_EMAIL },
    };
  }
}
