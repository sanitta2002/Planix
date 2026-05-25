import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/Service/auth.service';
import { AuthController } from '@/auth/Controller/auth.controller';
import { HashingModule } from '@/common/hashing/hashing.module';
import { OtpModule } from '@/common/otp/otp.module';
import { MailModule } from '@/common/mail/mail.module';
import { AppJwtModule } from '@/common/jwt/jwt.module';
import { TempStoreUserModule } from '@/common/temp-store-user/temp-store-user.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';

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
