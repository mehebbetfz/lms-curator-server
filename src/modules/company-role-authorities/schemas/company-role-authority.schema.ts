import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class CompanyRoleAuthority extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CompanyRole' })
  company_role_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Authority' })
  authority_id: mongoose.Schema.Types.ObjectId;
}

export const CompanyRoleAuthoritySchema = SchemaFactory.createForClass(CompanyRoleAuthority);

// Добавляем составной уникальный индекс
CompanyRoleAuthoritySchema.index(
  { company_role_id: 1, authority_id: 1 },
  { unique: true, name: 'company_role_authority_unique' }
);
