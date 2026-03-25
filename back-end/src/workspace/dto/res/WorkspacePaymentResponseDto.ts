export class WorkspacePaymentResponseDto {
  subscriptionId: string | null;
  workspaceId: string;

  plan: string | null;

  amount: number;

  status: string;

  startDate: Date | null;

  endDate?: Date | null;
}
