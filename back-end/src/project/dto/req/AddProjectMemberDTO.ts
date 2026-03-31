import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class AddProjectMemberDto {
  @IsOptional()
  @IsMongoId()
  projectId: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  roleId: string;
}
