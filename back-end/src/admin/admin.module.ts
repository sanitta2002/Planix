import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AppJwtModule } from 'src/common/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { JwtMiddleware } from 'src/common/middleware/jwt.middleware';
import { S3Service } from 'src/common/s3/s3.service';

@Module({
  imports: [AppJwtModule, UsersModule],
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
    );
  }
}
