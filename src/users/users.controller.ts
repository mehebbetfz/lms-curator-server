import {
  Controller,
  Post,
  Body,
  Req, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Authorities } from '../core/decorators/authority.decorator';
import { JwtAuthGuard } from '../core/guards/auth.guard';
import { AuthoritiesGuard } from '../core/guards/authorities.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Authorities('USER_CREATE')
  async create(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    const userId = req.user['userId'];
    return this.usersService.create(userId, createUserDto);
  }
}
