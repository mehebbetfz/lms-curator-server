import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Branch extends Document {
  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true })
  description: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company_id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course_id: mongoose.Schema.Types.ObjectId;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
