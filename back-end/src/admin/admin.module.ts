import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AppJwtModule } from 'src/common/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AppJwtModule, UsersModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
