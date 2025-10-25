import { IsString, MaxLength } from 'class-validator';
import mongoose from 'mongoose';

export class CreateBranchDto {
  @IsString({ message: 'NAME_IS_INVALID' })
  @MaxLength(100, { message: 'NAME_IS_TOO_LONG' })
  name: string;
  
  @IsString({ message: 'DESCRIPTION_IS_INVALID' })
  @MaxLength(300, { message: 'DESCRIPTION_IS_TOO_LONG' })
  description: string;
  
  @IsString({ message: 'COMPANY_ID_NEED_TO_BE_STRING' })
  company_id: mongoose.Schema.Types.ObjectId;
  
  @IsString({ message: 'COURSE_ID_NEED_TO_BE_STRING' })
  course_id: mongoose.Schema.Types.ObjectId;
}
