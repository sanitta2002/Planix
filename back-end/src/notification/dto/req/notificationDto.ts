import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { NotificationType } from 'src/common/type/NotificationType';

export class CreateNotificationDto {
  @IsMongoId()
  sender!: string;

  @IsMongoId()
  receiver!: string;

  @IsEnum(NotificationType)
  notificationType!: NotificationType;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsMongoId()
  referenceId?: string;
}
