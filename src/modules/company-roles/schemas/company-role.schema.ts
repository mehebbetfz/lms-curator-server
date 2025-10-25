import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { RoleStatus } from '../../../core/enums/role-status.enum';

@Schema({ timestamps: true })
export class CompanyRole extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: String, unique: true, required: true })
  name: string;
  
  @Prop({ type: String, required: true })
  description: string;
  
  @Prop({ type: Number, required: true})
  priority: number;
  
  @Prop({ enum: RoleStatus, default: RoleStatus.ACTIVE })
  status: string;
}

export const CompanyRoleSchema = SchemaFactory.createForClass(CompanyRole);

CompanyRoleSchema.index({ company_id: 1 });
