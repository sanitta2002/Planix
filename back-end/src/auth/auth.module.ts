import { Module } from '@nestjs/common';
import { AuthService } from './Service/auth.service';
import { AuthController } from './Controller/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { HashingModule } from 'src/common/hashing/hashing.module';

@Module({
  imports: [UsersModule, HashingModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
