import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Models/user.schema';
import { UserRepository } from './repository/user.Repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [{ provide: 'IUserRepository', useClass: UserRepository }],
  exports: ['IUserRepository'],
})
export class UsersModule {}
