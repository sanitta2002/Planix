import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Models/user.schema';
import { UserRepository } from './repository/user.Repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashingService } from 'src/common/hashing/Service/hashing.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IHashingService', useClass: HashingService },
    UsersService,
  ],
  exports: ['IUserRepository'],
})
export class UsersModule {}
