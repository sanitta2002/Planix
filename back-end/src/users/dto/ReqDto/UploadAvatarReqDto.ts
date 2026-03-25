import { IsString } from 'class-validator';

export class UploadAvatarReqDto {
  @IsString()
  source?: string;
}
