import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompaniesService } from './companies.service';
import { CompanyFindParamsReqDto } from './dto/company-find-params-req-dto.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
// @UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  
  @Post()
  // @Authorities('COMPANY_CREATE')
  async create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: any) {
    return this.companiesService.create(createCompanyDto, req.user.currentContext);
  }
  
  @Get()
  // @Authorities('COMPANY_READ_MANY')
  async find(@Query() query: CompanyFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.companiesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('COMPANY_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.companiesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('COMPANY_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companiesService.update(id, updateCompanyDto);
  }
  
  @Delete(':id')
  // @Authorities('COMPANY_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    return await this.companiesService.deleteOne({ _id: id });
  }
}
  
