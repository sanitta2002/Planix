import { PinoLogger } from 'nestjs-pino';
import { ILogger } from './ILogger';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PinoLoggerAdapter implements ILogger {
  constructor(private readonly logger: PinoLogger) {}

  info(message: unknown): void {
    this.logger.info(message);
  }

  error(message: string, trace?: unknown): void {
    this.logger.error(trace, message);
  }

  warn(message: unknown): void {
    this.logger.warn(message);
  }

  debug(message: unknown): void {
    this.logger.debug(message);
  }
}
