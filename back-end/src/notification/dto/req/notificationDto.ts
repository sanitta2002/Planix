import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { NotificationEventType } from 'src/common/type/NotificationType';

export class CreateNotificationDto {
  @IsMongoId()
  sender!: string;

  @IsMongoId()
  receiver!: string;

  @IsEnum(NotificationEventType)
  notificationType!: NotificationEventType;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsMongoId()
  referenceId?: string;
}
