import {
  Controller,
  Post,
  Body,
  Req, UseGuards, Delete, Get, Param, Patch, Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthoritiesGuard } from '../../core/guards/authorities.guard';
import { JwtAuthGuard } from '../../core/guards/auth.guard';
import { Authorities } from '../../core/decorators/authority.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFindParamsReqDto } from './dto/user-find-params-req-dto.dto';

@Controller('users')
// @UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Authorities('')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  // @Authorities('')
  async find(@Query() query: UserFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.usersService.find(searchParams, { page, limit });
  }

  @Get(':id')
  // @Authorities('')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  // @Authorities('')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Authorities('')
  async deleteOne(@Param('id') id: string) {
    return await this.usersService.deleteOne({ _id: id });
  }
}
