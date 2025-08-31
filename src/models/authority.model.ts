import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseEntity } from './base.model';

export type AuthorityDocument = Authority & Document;

@Schema()
export class Authority extends BaseEntity {
  @Prop({ type: String, default: '', required: true, unique: true })
  name: string;

  @Prop({ type: String, default: 0, required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'AuthorityCategory' })
  category_id: mongoose.Schema.Types.ObjectId;
}

export const AuthoritySchema = SchemaFactory.createForClass(Authority);

AuthoritySchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
