import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppJwtService } from './jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'IJwtService',
      useClass: AppJwtService,
    },
  ],
  exports: ['IJwtService'],
})
export class AppJwtModule {}
