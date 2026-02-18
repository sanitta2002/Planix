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
import { TempStoreUserService } from './common/temp-store-user/temp-store-user.service';
import { TempStoreUserModule } from './common/temp-store-user/temp-store-user.module';
import { AdminModule } from './admin/admin.module';
import { S3Module } from './common/s3/s3.module';
import { SubscriptionPlanModule } from './subscription/subscription-plan/subscription-plan.module';
import { SubscriptionsModule } from './subscription/subscriptions/subscriptions.module';

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
    TempStoreUserModule,
    AdminModule,
    S3Module,
    SubscriptionPlanModule,
    SubscriptionsModule,
  ],

  controllers: [AppController],
  providers: [AppService, OtpService, RedisProvider, TempStoreUserService],
})
export class AppModule {}
