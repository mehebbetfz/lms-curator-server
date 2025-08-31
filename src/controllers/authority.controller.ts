import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthorityDTO, AuthorityUpdateDTO } from '../dtos/authority.dto';

@ApiTags('authority')
@Controller('authority')
export class AuthorityController {
  @Get()
  @ApiOkResponse({ type: [AuthorityDTO] }) // указываем DTO для Swagger
  getAll(): AuthorityDTO[] {
    return [];
  }

  @Get('/all')
  @ApiOkResponse({ type: [AuthorityUpdateDTO] }) // указываем DTO для Swagger
  getAllDto(): AuthorityUpdateDTO[] {
    return [];
  }
}
