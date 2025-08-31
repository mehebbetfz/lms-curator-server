import { Body, Controller, Post, Req } from '@nestjs/common';
import { Authorities } from '../../core/decorators/authority.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  
  @Post()
  @Authorities('COMPANY_CREATE')
  async create(@Req() req: any, @Body() createCompanyDto: CreateCompanyDto) {
    const userId = req.user['userId'];
    return this.companiesService.create(userId, createCompanyDto);
  }
}
