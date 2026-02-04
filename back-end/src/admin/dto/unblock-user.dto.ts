import { IsString } from 'class-validator';

export class UnblockUserDto {
  @IsString()
  userId: string;
}
