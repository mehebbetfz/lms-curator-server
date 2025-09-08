import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { RoleFindParamsReqDto } from './dto/role-find-params-req-dto.dto';

@Controller('roles')
// @UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
  
    @Post()
    // @Authorities('ROLE_CREATE')
    async create(@Body() createRoleDto: CreateRoleDto) {
      return this.rolesService.create(createRoleDto);
    }
  
    @Get()
    // @Authorities('ROLE_READ_MANY')
    async find(@Query() query: RoleFindParamsReqDto) {
      const { page, limit, ...searchParams } = query;
      return await this.rolesService.find(searchParams, { page, limit });
    }
  
    @Get(':id')
    // @Authorities('ROLE_READ_ONE')
    async findById(@Param('id') id: string) {
      return await this.rolesService.findById(id);
    }
  
    @Patch(':id')
    // @Authorities('ROLE_UPDATE')
    async update(
      @Param('id') id: string,
      @Body() updateRoleDto: UpdateRoleDto,
    ) {
      return await this.rolesService.update(id, updateRoleDto);
    }
  
    @Delete(':id')
    // @Authorities('ROLE_DELETE_ONE')
    async deleteOne(@Param('id') id: string) {
      return await this.rolesService.deleteOne({ _id: id });
    }
  }
  
