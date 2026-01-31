import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AppJwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [AppJwtModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
