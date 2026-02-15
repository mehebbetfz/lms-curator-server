import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/core/guards/auth.guard'
import { CreateUserCompanyRoleDto } from './dto/create-user-company-role.dto'
import { UpdateUserCompanyRoleDto } from './dto/update-user-company-role.dto'
import {
  UserCompanyRoleFindParamsReqDto
} from './dto/user-company-role-find-params-req-dto.dto'
import { UserCompanyRolesService } from './user-company-roles.service'

@Controller('user-company-roles')
@UseGuards(JwtAuthGuard)
export class UserCompanyRolesController {
  constructor(private readonly userCompanyRolesService: UserCompanyRolesService) { }

  @Post()
  // @Authorities('USER_COMPANY_ROLE_CREATE')
  async create(@Body() createUserCompanyRoleDto: CreateUserCompanyRoleDto, @Req() req: any) {
    return this.userCompanyRolesService.create(createUserCompanyRoleDto, req.user.currentContext)
  }

  @Get()
  // @Authorities('USER_COMPANY_ROLE_READ_MANY')
  async find(@Query() query: UserCompanyRoleFindParamsReqDto) {
    const { page, limit, ...searchParams } = query
    return await this.userCompanyRolesService.find(searchParams, { page, limit })
  }

  @Get('/company-roles-for-user')
  async findCompanyRolesForUser(@Query() query: UserCompanyRoleFindParamsReqDto) {
      const { page, limit, ...searchParams } = query
    return this.userCompanyRolesService.findCompanyRolesForUser(searchParams, { page, limit })
  }

  @Get(':id')
  // @Authorities('USER_COMPANY_ROLE_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.userCompanyRolesService.findById(id)
  }

  @Patch(':id')
  // @Authorities('USER_COMPANY_ROLE_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateUserCompanyRoleDto: UpdateUserCompanyRoleDto,
  ) {
    return await this.userCompanyRolesService.update(id, updateUserCompanyRoleDto)
  }

  @Delete(':id')
  // @Authorities('USER_COMPANY_ROLE_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    console.log("id to delete:", id)
    return await this.userCompanyRolesService.deleteOne({ _id: id })
  }
}

