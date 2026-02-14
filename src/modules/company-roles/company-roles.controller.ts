import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../../core/guards/auth.guard'
import { RolePriorityGuard } from '../../core/guards/role-priority.guard'
import { CompanyRolesService } from './company-roles.service'
import {
  CompanyRoleFindParamsReqDto
} from './dto/company-role-find-params-req-dto.dto'
import { CreateCompanyRoleDto } from './dto/create-company-role.dto'
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto'

@Controller('company-roles')
@UseGuards(JwtAuthGuard, RolePriorityGuard)
export class CompanyRolesController {
  constructor(private readonly companyRolesService: CompanyRolesService) { }

  @Post()
  // @Authorities('COMPANY_ROLE_CREATE')
  async create(@Body() createCompanyRoleDto: CreateCompanyRoleDto) {
    return this.companyRolesService.create(createCompanyRoleDto)
  }

  @Get()
  // @Authorities('COMPANY_ROLE_READ_MANY')
  async find(@Query() query: CompanyRoleFindParamsReqDto) {
    const { page, limit, ...searchParams } = query
    return await this.companyRolesService.find(searchParams, { page, limit })
  }

  @Get(':id')
  // @Authorities('COMPANY_ROLE_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.companyRolesService.findById(id)
  }

  @Patch(':id')
  // @Authorities('COMPANY_ROLE_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyRoleDto: UpdateCompanyRoleDto,
  ) {
    return await this.companyRolesService.update(id, updateCompanyRoleDto)
  }

  @Delete(':id')
  // @Authorities('COMPANY_ROLE_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    return await this.companyRolesService.deleteOne({ _id: id })
  }
}

