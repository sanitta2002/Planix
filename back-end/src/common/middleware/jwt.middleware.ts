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

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtMiddleware.name);

  constructor(
    @Inject('IJwtService')
    private readonly jwtService: IJwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Middleware started');

    if (req.originalUrl.startsWith('/auth/refresh')) {
      return next();
    }
    const authHeader = req.headers.authorization;

    this.logger.log(`Authorization header: ${authHeader}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
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

      next();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
