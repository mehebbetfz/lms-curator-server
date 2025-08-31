import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuthorityCategory extends Document {
  @Prop({ type: String, unique: true, lowercase: true })
  name: string;
}

export const AuthorityCategorySchema = SchemaFactory.createForClass(AuthorityCategory);
