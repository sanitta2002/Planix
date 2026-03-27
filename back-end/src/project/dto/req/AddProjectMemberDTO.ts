import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class AddProjectMemberDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  projectId: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  roleId: string;
}
