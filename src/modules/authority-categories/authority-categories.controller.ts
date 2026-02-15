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
import {
  CreateAuthorityCategoryDto
} from './dto/create-authority-category.dto';
import { AuthorityCategoriesService } from './authority-categories.service';
import { Authorities } from '../../core/decorators/authority.decorator';
import {
  UpdateAuthorityCategoryDto
} from './dto/update-authority-category.dto';
import {
  AuthorityCategoryFindParamsReqDto
} from './dto/authority-category-find-params-req.dto';

@Controller('authority-categories')
export class AuthorityCategoriesController {
  constructor(private readonly authorityCategoriesService: AuthorityCategoriesService) {}
  
  @Post()
  // @Authorities('COURSE_CREATE')
  async create(@Body() createAuthorityCategoryDto: CreateAuthorityCategoryDto, @Req() req: any) {
    return this.authorityCategoriesService.create(createAuthorityCategoryDto, req.user.currentContext);
  }
  
  @Get()
  // @Authorities('COURSE_READ_MANY')
  async find(@Query() query: AuthorityCategoryFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.authorityCategoriesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('COURSE_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.authorityCategoriesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('COURSE_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorityCategoryDto: UpdateAuthorityCategoryDto,
  ) {
    return await this.authorityCategoriesService.update(id, updateAuthorityCategoryDto);
  }
  
  @Delete(':id')
  // @Authorities('COURSE_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    return await this.authorityCategoriesService.deleteOne({ _id: id });
  }
}
