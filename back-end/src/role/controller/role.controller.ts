import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IRoleService } from '../interface/IRoleService';
import { CreateRoleDTO } from '../dto/CreateRoleDTO';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { ROLE_MESSAGE } from 'src/common/constants/messages.constant';
import { UpdateRoleDTO } from '../dto/UpdateRoleDTO';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
interface AuthRequest extends Request {
  user: {
    id: string;
  };
}
@UseGuards(JwtAuthGuard)
@Controller('role')
export class RoleController {
  constructor(
    @Inject('IRoleService') private readonly _roleService: IRoleService,
  ) {}
  @Post('role')
  async createRole(@Body() dto: CreateRoleDTO, @Req() req: AuthRequest) {
    const userId = req.user.id;
    const role = await this._roleService.createRole(dto, userId);
    return ApiResponse.success(
      HttpStatus.CREATED,
      ROLE_MESSAGE.ROLE_CREATED,
      role,
    );
  }
  @Get('roles')
  async getAllRoles() {
    const roles = await this._roleService.getAllRole();
    return ApiResponse.success(HttpStatus.OK, ROLE_MESSAGE.ROLE_FETCHED, roles);
  }
  @Patch(':roleId')
  async updateRole(
    @Param('roleId') roleId: string,
    @Body() dto: UpdateRoleDTO,
  ) {
    dto.roleId = roleId;
    const updatedRole = await this._roleService.updateRole(dto);
    return ApiResponse.success(
      HttpStatus.OK,
      ROLE_MESSAGE.ROLE_UPDATED,
      updatedRole,
    );
  }
  @Delete(':roleId')
  async deleteRole(@Param('roleId') roleId: string) {
    await this._roleService.deleteRole(roleId);
    return ApiResponse.success(HttpStatus.OK, ROLE_MESSAGE.ROLE_DELETED);
  }
}
