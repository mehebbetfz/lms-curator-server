// auth-token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuthToken extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
  
  @Prop({ required: true })
  refreshToken: string;
  
  @Prop({ required: true })
  expiresAt: Date;
  
  @Prop({ default: false })
  revoked: boolean;
  
  @Prop()
  userAgent?: string;
  
  @Prop()
  ipAddress?: string;
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);

// Индексы для быстрого поиска
AuthTokenSchema.index({ userId: 1 });
AuthTokenSchema.index({ refreshToken: 1 });
AuthTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
