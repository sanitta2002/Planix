import { Module } from '@nestjs/common';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';
import { RoleRepository } from './Repository/RoleRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './Model/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
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
