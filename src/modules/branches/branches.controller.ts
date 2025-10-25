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
import { Authorities } from '../../core/decorators/authority.decorator';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { BranchFindParamsReqDto } from './dto/branch-find-params-req-dto.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
// @UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}
  
  @Post()
  // @Authorities('COMPANY_CREATE')
  async create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }
  
  @Get()
  // @Authorities('COMPANY_READ_MANY')
  async find(@Query() query: BranchFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.branchesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('COMPANY_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.branchesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('COMPANY_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return await this.branchesService.update(id, updateBranchDto);
  }
  
  @Delete(':id')
  // @Authorities('COMPANY_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    return await this.branchesService.deleteOne({ _id: id });
  }
}
  

