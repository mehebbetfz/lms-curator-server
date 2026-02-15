import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../../core/guards/auth.guard'
import { CompanyRolesService } from './company-roles.service'
import {
  CompanyRoleFindParamsReqDto
} from './dto/company-role-find-params-req-dto.dto'
import { CreateCompanyRoleDto } from './dto/create-company-role.dto'
import { UpdateCompanyRoleDto } from './dto/update-company-role.dto'

@Controller('company-roles')
@UseGuards(JwtAuthGuard)
export class CompanyRolesController {
  constructor(private readonly companyRolesService: CompanyRolesService) { }

  @Post()
  // @Authorities('')
  async create(@Body() createCompanyRoleDto: CreateCompanyRoleDto, @Req() req: any) {
    return this.companyRolesService.create(createCompanyRoleDto, req.user.currentContext)
  }

  @Get()
  // @Authorities('')
  async find(@Query() query: CompanyRoleFindParamsReqDto) {
    const { page, limit, ...searchParams } = query
    return await this.companyRolesService.find(searchParams, { page, limit })
  }

  @Get(':id')
  // @Authorities('')
  async findById(@Param('id') id: string) {
    return await this.companyRolesService.findById(id)
  }

  @Patch(':id')
  // @Authorities('')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyRoleDto: UpdateCompanyRoleDto,
  ) {
    return await this.companyRolesService.update(id, updateCompanyRoleDto)
  }

  @Delete(':id')
  // @Authorities('')
  async deleteOne(@Param('id') id: string) {
    return await this.companyRolesService.deleteOne({ _id: id })
  }
}

