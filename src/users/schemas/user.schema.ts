import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop()
    middleName: string;

    @Prop()
    phone: string;

    @Prop({ type: Date })
    dateOfBirth?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);