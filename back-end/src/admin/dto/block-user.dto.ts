import { IsString } from 'class-validator';

export class BlockUserDto {
  @IsString()
  userId: string;
}
