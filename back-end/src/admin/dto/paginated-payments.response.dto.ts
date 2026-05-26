import { PaymentDto } from '@/payment/dto/PaymentDto';

export class PaginatedPaymentsResponseDto {
  data!: PaymentDto[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
