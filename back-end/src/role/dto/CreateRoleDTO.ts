import { IsArray, IsString } from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  name: string;

  @IsArray()
  permissions: string[];
}
