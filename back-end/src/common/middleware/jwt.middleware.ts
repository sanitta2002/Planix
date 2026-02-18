import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

import type { IJwtService } from '../jwt/interfaces/jwt.service.interface';
import type { IUserRepository } from 'src/users/interfaces/user.repository.interface';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtMiddleware.name);

  constructor(
    @Inject('IJwtService')
    private readonly jwtService: IJwtService,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Middleware started');

    if (req.originalUrl.startsWith('/auth/refresh')) {
      return next();
    }
    const authHeader = req.headers.authorization;

    this.logger.log(`Authorization header: ${authHeader}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const token = authHeader.split(' ')[1];
    console.log('token', token);
    try {
      const payload = this.jwtService.verifyAccessToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      req['user'] = payload;

      if (req.originalUrl.startsWith('/admin') && payload.role !== 'admin') {
        throw new ForbiddenException('Admin only');
      }

      if (payload.role !== 'admin') {
        const user = await this.userRepository.findById(payload.userId);

        if (!user || user.isBlocked) {
          console.log('throwing');
          throw new UnauthorizedException('User is blocked');
        }
      }

      next();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
