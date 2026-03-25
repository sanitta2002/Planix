import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (config: ConfigService) => {
        const logger = new Logger('mongodb');

        logger.log('connecting to mongoDB.');
        return {
          uri: config.get<string>('DATABASE_URL'),
          onConnectionCreate: (connetion: Connection) => {
            connetion.on('connected', () => {
              logger.log('successfully connected to mongoDB');
            });
            connetion.on('error', (error) => {
              if (error instanceof Error) {
                logger.error(`mongoDB connection error , ${error.message}`);
              }
            });
            connetion.on('disconnected', () => {
              logger.warn('mongoDB disconnected');
            });
            return connetion;
          },
        };
      },

      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
