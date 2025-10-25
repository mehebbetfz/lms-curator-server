import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyRoleAuthoritiesService } from './company-role-authorities.service';
import { CreateCompanyRoleAuthorityDto } from './dto/create-company-role-authority.dto';
import { UpdateCompanyRoleAuthorityDto } from './dto/update-company-role-authority.dto';
import {
  CompanyRoleAuthorityFindParamsReqDto
} from './dto/company-role-authority-req.dto';
import {
  DeleteCompanyRoleAuthorityParamsReqDto
} from './dto/delete-company-role-authority-params-req.dto';

@Controller('company-role-authorities')
export class CompanyRoleAuthoritiesController {
  constructor(private readonly companyRoleAuthoritiesService: CompanyRoleAuthoritiesService) {}
  
  @Post()
  // @Authorities('COMPANY_ROLE_AUTHORITY_CREATE')
  async create(@Body() createCompanyRoleAuthorityDto: CreateCompanyRoleAuthorityDto) {
    return this.companyRoleAuthoritiesService.create(createCompanyRoleAuthorityDto);
  }
  
  @Get()
  // @Authorities('COMPANY_ROLE_AUTHORITY_READ_MANY')
  async find(@Query() query: CompanyRoleAuthorityFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.companyRoleAuthoritiesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('COMPANY_ROLE_AUTHORITY_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.companyRoleAuthoritiesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('COMPANY_ROLE_AUTHORITY_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyRoleAuthorityDto: UpdateCompanyRoleAuthorityDto,
  ) {
    return await this.companyRoleAuthoritiesService.update(id, updateCompanyRoleAuthorityDto);
  }
  
  @Delete(':id')
  // @Authorities('COMPANY_ROLE_AUTHORITY_DELETE_ONE')
  async deleteById(@Param('id') id: string) {
    return await this.companyRoleAuthoritiesService.deleteOne({ _id: id });
  }
  
  @Delete()
  // @Authorities('AUTHORITY_DELETE_ONE')
  async deleteOne(
    @Query() query: DeleteCompanyRoleAuthorityParamsReqDto
  ) {
    return await this.companyRoleAuthoritiesService.deleteOne(query);
  }
}
