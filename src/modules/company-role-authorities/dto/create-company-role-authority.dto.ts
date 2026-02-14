import { IsString } from 'class-validator'
import mongoose from 'mongoose'

export class CreateCompanyRoleAuthorityDto {
  @IsString({ message: 'ID_NEED_TO_BE_STRING' })
  company_role_id: mongoose.Schema.Types.ObjectId

  @IsString({ message: 'ID_NEED_TO_BE_STRING' })
  authority_id: mongoose.Schema.Types.ObjectId
}
