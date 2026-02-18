import { User } from 'src/users/Models/user.schema';
import { LoginResponseDto } from '../dto/ResponseDTO/login.res.dto';
import { RefreshTokenResponseDto } from '../dto/ResponseDTO/RefreshTokenResponseDto';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';

export interface TempUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export class AuthMapper {
  static toTempUser(dto: RegisterUserDto, hashedPassword: string): TempUser {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    };
  }

  static toUserEntity(tempUser: TempUser) {
    return {
      ...tempUser,
      isEmailVerified: true,
    };
  }

  static toLoginResponse(
    accessToken: string,
    refreshToken: string,
    user: User,
  ): LoginResponseDto {
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ?? null,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarKey,
      },
    };
  }

  static toRefreshTokenResponse(
    accessToken: string,
    // user: User,
  ): RefreshTokenResponseDto {
    return {
      accessToken,
    };
  }
}
