import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HashingModule } from './common/hashing/hashing.module';
import { OtpService } from './common/otp/otp.service';
import { OtpModule } from './common/otp/otp.module';
import { RedisProvider } from './common/redis/redis.provider';
import { MailModule } from './common/mail/mail.module';
import { AppJwtModule } from './common/jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    HashingModule,
    OtpModule,
    MailModule,
    AppJwtModule,
  ],

  controllers: [AppController],
  providers: [AppService, OtpService, RedisProvider],
})
export class AppModule {}
