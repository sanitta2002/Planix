import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import type { ISubscriptionRepository } from 'src/subscription/interface/ISubscriptionRepository';
import { SubscriptionStatus } from 'src/subscription/Model/subscription.schema';

@Injectable()
export class SubscriptionGuardGuard implements CanActivate {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepo: ISubscriptionRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const workspaceIdRaw = request.params.workspaceId;
    const workspaceId = Array.isArray(workspaceIdRaw)
      ? workspaceIdRaw[0]
      : workspaceIdRaw;
    if (!workspaceId) {
      throw new ForbiddenException('Workspace ID required');
    }
    const subscription =
      await this._subscriptionRepo.findActiveByWorkspace(workspaceId);
    if (subscription?.status !== SubscriptionStatus.ACTIVE) {
      throw new ForbiddenException('Subscription not active');
    }
    if (!subscription) {
      throw new ForbiddenException('No active subscription');
    }
    return true;
  }
}
