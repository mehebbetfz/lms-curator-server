import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
  @Prop({ type: String, default: '' })
  created_by: string;

  @Prop({ type: String, default: '' })
  updated_by: string;

  @Prop({ type: Date, default: () => new Date() })
  created_at: Date;

  @Prop({ type: Date, default: () => new Date() })
  updated_at: Date;
}
