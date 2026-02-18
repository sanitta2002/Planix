import { Module } from '@nestjs/common';
import { AuthService } from './Service/auth.service';
import { AuthController } from './Controller/auth.controller';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { OtpModule } from 'src/common/otp/otp.module';
import { MailModule } from 'src/common/mail/mail.module';
import { AppJwtModule } from 'src/common/jwt/jwt.module';
import { TempStoreUserModule } from 'src/common/temp-store-user/temp-store-user.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    HashingModule,
    OtpModule,
    MailModule,
    AppJwtModule,
    TempStoreUserModule,
    PassportModule,
    UsersModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: 'IuserService',
      useClass: AuthService,
    },
  ],
  exports: ['IuserService'],
  controllers: [AuthController],
})
export class AuthModule {}
