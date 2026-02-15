import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as mongoose from 'mongoose'
import { RoleStatus } from '../../../core/enums/role-status.enum'

@Schema({ timestamps: true })
export class UserCompanyRole extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CompanyRole' })
  company_role_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' })
  branch_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: mongoose.Schema.Types.ObjectId

  @Prop({ enum: RoleStatus, default: RoleStatus.ACTIVE })
  status: string
}

export const UserCompanyRoleSchema = SchemaFactory.createForClass(UserCompanyRole)

UserCompanyRoleSchema.index({ user_id: 1 })
UserCompanyRoleSchema.index({ company_role_id: 1 })
