import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import {
  UserRoleFindParamsReqDto
} from './dto/user-role-find-params-req-dto.dto';

@Controller('user-roles')
// @UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}
  
  @Post()
  // @Authorities('USER_ROLE_CREATE')
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }
  
  @Get()
  // @Authorities('USER_ROLE_READ_MANY')
  async find(@Query() query: UserRoleFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.userRolesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('USER_ROLE_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.userRolesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('USER_ROLE_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return await this.userRolesService.update(id, updateUserRoleDto);
  }
  
  @Delete(':id')
  // @Authorities('USER_ROLE_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    return await this.userRolesService.deleteOne({ _id: id });
  }
}

