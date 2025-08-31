import {
  Controller,
  Post,
  Body,
  Req, UseGuards,
} from '@nestjs/common';
import { AuthoritiesService } from './authorities.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { JwtAuthGuard } from '../../core/guards/auth.guard';
import { AuthoritiesGuard } from '../../core/guards/authorities.guard';
import { Authorities } from '../../core/decorators/authority.decorator';

@Controller('authorities')
@UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class AuthoritiesController {
  constructor(private readonly authoritiesService: AuthoritiesService) {}
  
  @Post()
  @Authorities('AUTHORITY_CREATE')
  async create(@Req() req: any, @Body() createAuthorityDto: CreateAuthorityDto) {
    const userId = req.user['userId'];
    return this.authoritiesService.create(userId, createAuthorityDto);
  }
}
