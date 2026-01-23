import { JwtPayload } from '../payload/JwtPayload';

export interface IJwtService {
  signAccessToken(payload: JwtPayload): string;
  signRefreshToken(payload: JwtPayload): string;
  verifyAccessToken(token:string):JwtPayload | null;
  verifyRefreshToken(token:string):JwtPayload | null;
}
