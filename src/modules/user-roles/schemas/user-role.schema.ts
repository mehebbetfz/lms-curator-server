import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserStatus } from '../../../core/enums/user-status.enum';
import { UserRoleEnum } from '../../../core/enums/user-role.enum';
import { UserRoleStatus } from '../../../core/enums/user-role-status.enum';

@Schema({ timestamps: true })
export class UserRole extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' })
  branch_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: mongoose.Schema.Types.ObjectId;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
