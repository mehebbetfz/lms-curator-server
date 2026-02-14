import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class CompanyRoleAuthority extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CompanyRole' })
  company_role_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Authority' })
  authority_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' })
  branch_id: mongoose.Schema.Types.ObjectId
}

export const CompanyRoleAuthoritySchema = SchemaFactory.createForClass(CompanyRoleAuthority)

// Составной уникальный индекс для предотвращения дублирования на всех уровнях
CompanyRoleAuthoritySchema.index(
  { company_role_id: 1, authority_id: 1, course_id: 1, branch_id: 1 },
  {
    unique: true,
    name: 'unique_role_authority_context',
  }
)

// Индексы для производительности
CompanyRoleAuthoritySchema.index({ company_role_id: 1 })
CompanyRoleAuthoritySchema.index({ authority_id: 1 })
CompanyRoleAuthoritySchema.index({ course_id: 1 })
CompanyRoleAuthoritySchema.index({ branch_id: 1 })