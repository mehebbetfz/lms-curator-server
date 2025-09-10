import {
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateCompanyRoleDto {
  @IsString({ message: 'ID_NEED_TO_BE_STRING' })
  company_id: mongoose.Schema.Types.ObjectId;

  @IsString({ message: 'ID_NEED_TO_BE_STRING' })
  role_id: mongoose.Schema.Types.ObjectId;
}

