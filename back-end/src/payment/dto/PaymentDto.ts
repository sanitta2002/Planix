export interface PaymentDto {
  id: string;
  user: string;
  plan: string;
  amount: number;
  status: string;
  startDate: Date;
}
