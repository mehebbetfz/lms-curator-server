import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from './base.model';

export type CarDocument = Car & Document;

@Schema()
export class Car extends BaseEntity {
  @Prop({ type: String, default: '', required: true, unique: true })
  name: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);

CarSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});
