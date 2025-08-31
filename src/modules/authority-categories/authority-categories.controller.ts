import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  CreateAuthorityCategoryDto
} from './dto/create-authority-category.dto';
import { AuthorityCategoriesService } from './authority-categories.service';
import { Authorities } from '../../core/decorators/authority.decorator';

@Controller('authority-categories')
export class AuthorityCategoriesController {
  constructor(private readonly authorityCategoriesService: AuthorityCategoriesService) {}
  
  @Post()
  @Authorities('AUTHORITY_CATEGORY_CREATE')
  async create(@Req() req: any, @Body() createAuthorityCategoryDto: CreateAuthorityCategoryDto) {
    const userId = req.user['userId'];
    return this.authorityCategoriesService.create(userId, createAuthorityCategoryDto);
  }
}
