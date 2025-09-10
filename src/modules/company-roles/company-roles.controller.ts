import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyRolesService } from './company-roles.service';
import { CreateCompanyRoleDto } from './dto/create-company-role.dto';
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto';
import {
  CompanyRoleFindParamsReqDto
} from './dto/company-role-find-params-req-dto.dto';

@Controller('company-roles')
// @UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class CompanyRolesController {
  constructor(private readonly companyRolesService: CompanyRolesService) {}
  
  @Post()
  // @Authorities('USER_ROLE_CREATE')
  async create(@Body() createCompanyRoleDto: CreateCompanyRoleDto) {
    return this.companyRolesService.create(createCompanyRoleDto);
  }
  
  @Get()
  // @Authorities('USER_ROLE_READ_MANY')
  async find(@Query() query: CompanyRoleFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.companyRolesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('USER_ROLE_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.companyRolesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('USER_ROLE_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyRoleDto: UpdateCompanyRoleDto,
  ) {
    return await this.companyRolesService.update(id, updateCompanyRoleDto);
  }
  
  @Delete(':id')
  // @Authorities('USER_ROLE_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    return await this.companyRolesService.deleteOne({ _id: id });
  }
}

