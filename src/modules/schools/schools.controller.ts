import { Body, Controller, Post, Req } from '@nestjs/common';
import { Authorities } from '../../core/decorators/authority.decorator';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}
  
  @Post()
  @Authorities('SCHOOL_CREATE')
  async create(@Req() req: any, @Body() createSchoolDto: CreateSchoolDto) {
    const userId = req.user['userId'];
    return this.schoolsService.create(userId, createSchoolDto);
  }
}
