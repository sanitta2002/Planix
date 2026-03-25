import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateCheckoutDto {
  @IsMongoId()
  planId: string;

  @IsMongoId()
  subscriptionId: string;

  @IsNotEmpty()
  @IsMongoId()
  workspaceId: string;
}
