import {
  Controller,
  Post,
  Body,
  Req, UseGuards, Get, Query, Param, Patch, Delete,
} from '@nestjs/common';
import { AuthoritiesService } from './authorities.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { JwtAuthGuard } from '../../core/guards/auth.guard';
import { AuthorityFindParamsReqDto } from './dto/authority-find-params-req.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';

@Controller('authorities')
@UseGuards(JwtAuthGuard)
export class AuthoritiesController {
  constructor(private readonly authoritiesService: AuthoritiesService) {}
  
  @Post()
  // @Authorities('')
  async create(@Body() createAuthorityDto: CreateAuthorityDto, @Req() req: any) {
    return this.authoritiesService.create(createAuthorityDto, req.user.currentContext);
  }
  
  @Get()
  // @Authorities('')
  async find(@Query() query: AuthorityFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.authoritiesService.find(searchParams, { page, limit });
  }
  
  @Get('/category')
  // @Authorities('')
  async findCategoryAuthorities(@Req() req: any, @Query() query: AuthorityFindParamsReqDto) {
    const context = req.user.currentContext;
    const { page, limit, ...searchParams } = query;
    return await this.authoritiesService.findCategoryAuthorities(context, searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('')
  async findById(@Param('id') id: string) {
    return await this.authoritiesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorityDto: UpdateAuthorityDto,
  ) {
    return await this.authoritiesService.update(id, updateAuthorityDto);
  }
  
  @Delete(':id')
  // @Authorities('')
  async deleteById(@Param('id') id: string) {
    return await this.authoritiesService.deleteOne({ _id: id });
  }
  

}
