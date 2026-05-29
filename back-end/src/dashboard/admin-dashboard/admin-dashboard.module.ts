import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AdminDashboardController } from './controller/admin-dashboard.controller';
import { AdminDashboardService } from './service/admin-dashboard.service';
import { UsersModule } from '@/users/users.module';
import { WorkspaceModule } from '@/workspace/workspace.module';
import { SubscriptionsModule } from '@/subscription/subscriptions/subscriptions.module';
import { SubscriptionPlanModule } from '@/subscription/subscription-plan/subscription-plan.module';
import { AppJwtModule } from '@/common/jwt/jwt.module';
import { JwtMiddleware } from '@/common/middleware/jwt.middleware';

@Module({
  imports: [
    UsersModule,
    WorkspaceModule,
    SubscriptionsModule,
    SubscriptionPlanModule,
    AppJwtModule,
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'admin/dashboard/*', method: RequestMethod.GET });
  }
}
