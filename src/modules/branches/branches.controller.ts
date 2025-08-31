import { Body, Controller, Post, Req } from '@nestjs/common';
import { Authorities } from '../../core/decorators/authority.decorator';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Authorities('BRANCH_CREATE')
  async create(@Req() req: any, @Body() createBranchDto: CreateBranchDto) {
    const userId = req.user['userId'];
    return this.branchesService.create(userId, createBranchDto);
  }
}
