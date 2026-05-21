import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const AppLoggerModule = LoggerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (_configService: ConfigService) => ({
    pinoHttp: {
      level: _configService.get<string>('LOG_LEVEL') || 'info',

      transport: {
        targets: [
          {
            target: 'pino-roll',
            level: 'info',
            options: {
              file: './logs/combined.log',
              frequency: 'daily',
              size: _configService.get<string>('LOG_COMBINED_SIZE'),
              mkdir: true,
              compress: true,
            },
          },
          {
            target: 'pino-roll',
            level: 'error',
            options: {
              file: './logs/error.log',
              frequency: 'daily',
              size: _configService.get<string>('LOG_ERROR_SIZE'),
              mkdir: true,
              compress: true,
            },
          },
        ],
      },
    },
  }),
});
