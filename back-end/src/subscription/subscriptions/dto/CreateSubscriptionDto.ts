import { IsMongoId } from 'class-validator';

export class CreateSubscriptionDto {
  @IsMongoId()
  workspaceId: string;

  @IsMongoId()
  planId: string;
}
