import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserStatus } from '../../core/enums/user-status.enum';
import { Logger } from '@nestjs/common';
import { generateUsernameCandidate } from '../../core/utils/username-generator.util';

export interface UserModel extends Model<User> {
  generateUniqueUsername(): Promise<string>;
  isUsernameAvailable(username: string): Promise<boolean>;
  findByUsername(username: string): Promise<User | null>;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  encryptedPassword: string;

  @Prop({ required: true, unique: true, lowercase: true, immutable: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  middleName: string;

  @Prop()
  phone: string;

  @Prop()
  whatsappPhone: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Добавляем статические методы к схеме
UserSchema.statics.generateUniqueUsername = async function (
  this: UserModel,
): Promise<string> {
  const logger = new Logger('UsernameGenerator');
  const MAX_ATTEMPTS = 15;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const username = generateUsernameCandidate(attempts);

    try {
      const isAvailable = await this.isUsernameAvailable(username);
      if (isAvailable) {
        logger.debug(
          `Generated unique username: ${username} (attempt ${attempts + 1})`,
        );
        return username;
      }
    } catch (error) {
      logger.warn(
        `Failed to check username availability: ${(error as Error).message}`,
      );
    }

    attempts++;
  }

  const fallbackUsername = `user_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
  logger.warn(`Using fallback username: ${fallbackUsername}`);
  return fallbackUsername.substring(0, 20);
};

UserSchema.statics.isUsernameAvailable = async function (
  this: UserModel,
  username: string,
): Promise<boolean> {
  const existingUser = await this.findOne({ username })
    .select('_id')
    .lean()
    .exec();
  return !existingUser;
};

UserSchema.statics.findByUsername = function (
  this: UserModel,
  username: string,
): Promise<User | null> {
  return this.findOne({ username: username.toLowerCase() }).exec();
};

UserSchema.pre('save', async function (next) {
  if (this.isNew && !this.username) {
    try {
      const userModel = this.constructor as UserModel;
      this.username = await userModel.generateUniqueUsername();
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});
