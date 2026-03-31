import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

class MemberDto {
  @IsString()
  userId: string;

  @IsString()
  roleId: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @Type(() => MemberDto)
  members?: MemberDto[];
}
