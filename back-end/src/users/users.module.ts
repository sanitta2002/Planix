import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Models/user.schema';
import { UserRepository } from './repository/user.Repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashingService } from 'src/common/hashing/Service/hashing.service';
import { S3Module } from 'src/common/s3/s3.module';
import { JwtMiddleware } from 'src/common/middleware/jwt.middleware';
import { AppJwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    S3Module,
    AppJwtModule,
  ],
  controllers: [UsersController],
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IHashingService', useClass: HashingService },
    { provide: 'IUserServicePRO', useClass: UsersService },
  ],
  exports: ['IUserRepository'],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('users');
  }
}
