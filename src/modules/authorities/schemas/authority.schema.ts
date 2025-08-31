import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Authority extends Document {
  @Prop({ type: String, unique: true, lowercase: true })
  name: string;
  
  @Prop({ type: String })
  description: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AuthorityCategory' })
  authority_category_id: mongoose.Schema.Types.ObjectId;
}

export const AuthoritySchema = SchemaFactory.createForClass(Authority);
