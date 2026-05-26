import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from '@/workspace/service/workspace.service';
import { WorkspaceController } from '@/workspace/controller/workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from '@/workspace/Model/workspace.schema';
import { WorkspaceRepository } from '@/workspace/Repository/workspace.repository';
import { S3Module } from '@/common/s3/s3.module';
import { SubscriptionsModule } from '@/subscription/subscriptions/subscriptions.module';
import { SubscriptionPlanModule } from '@/subscription/subscription-plan/subscription-plan.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
    S3Module,
    forwardRef(() => SubscriptionsModule),
    SubscriptionPlanModule,
  ],
  providers: [
    {
      provide: 'IWorkspaceRepository',
      useClass: WorkspaceRepository,
    },

    {
      provide: 'IWorkspaceService',
      useClass: WorkspaceService,
    },
  ],
  controllers: [WorkspaceController],
  exports: ['IWorkspaceRepository', 'IWorkspaceService'],
})
export class WorkspaceModule {}
