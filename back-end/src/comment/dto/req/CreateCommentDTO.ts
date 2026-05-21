import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsMongoId()
  issueId!: string;
}
