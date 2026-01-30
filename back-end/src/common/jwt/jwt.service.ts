import { Injectable } from '@nestjs/common';
import { IJwtService } from './interfaces/jwt.service.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payload/JwtPayload';

@Injectable()
export class AppJwtService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}
  signAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  signRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
