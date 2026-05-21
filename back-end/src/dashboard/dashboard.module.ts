import { Module } from '@nestjs/common';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';

@Module({
  imports: [UserDashboardModule, AdminDashboardModule],
})
export class DashboardModule {}
