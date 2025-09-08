import { IsString, MaxLength } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCourseDto {
  @IsString({ message: 'NAME_NEED_TO_BE_STRING' })
  @MaxLength(100, { message: 'NAME_IS_TOO_LONG' })
  name: string;
  
  @IsString({ message: 'DESCRIPTION_NEED_TO_BE_STRING' })
  @MaxLength(300, { message: 'DESCRIPTION_IS_TOO_LONG' })
  description: string;
  
  @IsString({ message: 'COURSE_ID_NEED_TO_BE_STRING' })
  company_id: mongoose.Schema.Types.ObjectId;
}
