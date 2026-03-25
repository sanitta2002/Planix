import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UpdateProfileReqDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, {
    message: 'Phone number must be exactly 10 digits',
  })
  phone: string;
}
