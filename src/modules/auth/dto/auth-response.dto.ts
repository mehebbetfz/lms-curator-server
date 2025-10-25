import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
  
  @ApiProperty({ example: 'refresh_token_string_here' })
  refreshToken: string;
  
  @ApiProperty({ example: 3600 })
  expiresIn: number;
  
  @ApiProperty({
    example: {
      id: '507f1f77bcf86cd799439011',
      username: 'johndoe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe'
    }
  })
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  
  @ApiProperty({
    required: false,
    example: {
      companyId: '507f1f77bcf86cd799439011',
      courseId: '507f1f77bcf86cd799439012',
      branchId: '507f1f77bcf86cd799439013'
    }
  })
  context?: {
    companyId?: string;
    courseId?: string;
    branchId?: string;
  };
}
