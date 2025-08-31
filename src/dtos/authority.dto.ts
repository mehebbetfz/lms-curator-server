import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '../enums/status.enum';

export class AuthorityDTO {
  @ApiProperty({ example: '123' })
  id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ enum: StatusEnum })
  status: StatusEnum;

  @ApiProperty()
  car_id: string;
}

export class AuthorityUpdateDTO {
  @ApiProperty({ example: '123' })
  id: string;
  
  @ApiProperty({ example: 'Admin' })
  name: string;
  
  @ApiProperty({ enum: StatusEnum })
  status: StatusEnum;
  
  @ApiProperty()
  car_id: string;
}
