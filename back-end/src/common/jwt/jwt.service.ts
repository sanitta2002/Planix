import { Injectable } from '@nestjs/common';
import { IJwtService } from './interfaces/jwt.service.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payload/JwtPayload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppJwtService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}
  signAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this._configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '15m',
    });
  }

  signRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this._configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
  }
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this._configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this._configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
