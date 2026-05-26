import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageDTO {
  @IsString()
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  content!: string;
}
