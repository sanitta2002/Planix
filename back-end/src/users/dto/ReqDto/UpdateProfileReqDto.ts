import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateProfileReqDto {
  @IsString()
  userId: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  phone: string;
}
