import { LoggerModule } from 'nestjs-pino';

export const AppLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    level: 'info',
    transport: {
      targets: [
        {
          target: 'pino-roll',
          level: 'info',
          options: {
            file: './logs/combined.log',
            frequency: 'daily',
            size: '10m',
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
            size: '5m',
            mkdir: true,
            compress: true,
          },
        },
      ],
    },
  },
});
