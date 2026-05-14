export class InvoiceResponseDto {
  id!: string;
  amount!: number;
  currency!: string;
  status!: string;
  created!: number;
  hostedUrl!: string | null;
  pdf!: string | null;
}
