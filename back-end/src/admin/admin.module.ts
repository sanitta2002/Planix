import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AdminService } from '@/admin/admin.service';
import { AdminController } from '@/admin/admin.controller';
import { AppJwtModule } from '@/common/jwt/jwt.module';
import { UsersModule } from '@/users/users.module';
import { JwtMiddleware } from '@/common/middleware/jwt.middleware';
import { S3Service } from '@/common/s3/s3.service';
import { WorkspaceModule } from '@/workspace/workspace.module';
import { SubscriptionsModule } from '@/subscription/subscriptions/subscriptions.module';
import { PaymentModule } from '@/payment/payment.module';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [
    AppJwtModule,
    UsersModule,
    WorkspaceModule,
    SubscriptionsModule,
    PaymentModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: 'IAdminService',
      useClass: AdminService,
    },
    {
      provide: 'IS3Service',
      useClass: S3Service,
    },
  ],
  exports: ['IAdminService', 'IS3Service'],
  controllers: [AdminController],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(
      {
        path: 'admin/users',
        method: RequestMethod.GET,
      },

      {
        path: 'admin/:id/block',
        method: RequestMethod.PATCH,
      },

      {
        path: 'admin/:id/unblock',
        method: RequestMethod.PATCH,
      },
      { path: 'admin/subscriptionPlan', method: RequestMethod.POST },
      { path: 'admin/subscriptionPlan', method: RequestMethod.GET },
      { path: 'admin/workspaces', method: RequestMethod.GET },
    );
  }
}
