import { Module } from '@nestjs/common';
import { RoleService } from '@/role/service/role.service';
import { RoleController } from '@/role/controller/role.controller';
import { RoleRepository } from '@/role/Repository/RoleRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@/role/Model/role.schema';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    LoggerModule,
  ],
  controllers: [RoleController],
  providers: [
    {
      provide: 'IRoleService',
      useClass: RoleService,
    },
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    },
  ],
  exports: ['IRoleRepository', 'IRoleService'],
})
export class RoleModule {}
