import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleStatus } from '../../../core/enums/role-status.enum';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ type: String, unique: true, required: true })
  name: string;
  
  @Prop({ type: String, required: true })
  description: string;
  
  @Prop({ type: Number, required: true})
  priority: number;
  
  @Prop({ enum: RoleStatus, default: RoleStatus.ACTIVE })
  status: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
