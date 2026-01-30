import { Module } from '@nestjs/common';
import { AuthService } from './Service/auth.service';
import { AuthController } from './Controller/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { OtpModule } from 'src/common/otp/otp.module';
import { MailModule } from 'src/common/mail/mail.module';
import { AppJwtModule } from 'src/common/jwt/jwt.module';
import { TempStoreUserModule } from 'src/common/temp-store-user/temp-store-user.module';

@Module({
  imports: [
    UsersModule,
    HashingModule,
    OtpModule,
    MailModule,
    AppJwtModule,
    TempStoreUserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
