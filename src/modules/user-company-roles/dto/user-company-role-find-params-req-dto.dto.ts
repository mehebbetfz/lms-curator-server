import { PartialType } from '@nestjs/mapped-types'
import mongoose from 'mongoose'
import { CreateUserCompanyRoleDto } from './create-user-company-role.dto'

export class UserCompanyRoleFindParamsReqDto extends PartialType(CreateUserCompanyRoleDto) {
    status: string
    user_id: mongoose.Schema.Types.ObjectId
    page: number
    limit: number
}
