import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AddProjectMemberDto } from './AddProjectMemberDTO';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectName: string;
  @IsString()
  @IsNotEmpty()
  key: string;
  @IsString()
  workspaceId: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddProjectMemberDto)
  members?: AddProjectMemberDto[];
}
