import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDTO {
  @IsString()
  roleId: string;

  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
