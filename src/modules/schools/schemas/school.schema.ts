import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class School extends Document {
  @Prop({ required: true })
  name: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  company_id: mongoose.Schema.Types.ObjectId;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
