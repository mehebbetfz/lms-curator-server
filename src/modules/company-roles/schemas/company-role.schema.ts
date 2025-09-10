import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class CompanyRole extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role_id: mongoose.Schema.Types.ObjectId;
}

export const CompanyRoleSchema = SchemaFactory.createForClass(CompanyRole);
