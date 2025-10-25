import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponse {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;
  
  @ApiProperty({ example: 'johndoe' })
  username: string;
  
  @ApiProperty({ example: 'john@example.com' })
  email: string;
  
  @ApiProperty({ example: 'John' })
  firstName: string;
  
  @ApiProperty({ example: 'Doe' })
  lastName: string;
  
  @ApiProperty({ example: 'Middle' })
  middleName?: string;
  
  @ApiProperty({ example: '+1234567890' })
  phone?: string;
  
  @ApiProperty({ example: ['course.content.view', 'company.stats.view'] })
  authorities: string[];
  
  @ApiProperty({
    example: {
      companyId: '507f1f77bcf86cd799439011',
      courseId: '507f1f77bcf86cd799439012'
    }
  })
  currentContext: {
    companyId?: string;
    courseId?: string;
    branchId?: string;
  };
}
