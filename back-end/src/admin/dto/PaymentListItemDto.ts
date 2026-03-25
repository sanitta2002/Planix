import { ApiProperty } from '@nestjs/swagger';

export class PaymentListItemDto {
  @ApiProperty()
  userName: string;

  @ApiProperty()
  workspaceName: string;

  @ApiProperty()
  planName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty()
  invoiceUrl: string;
}
