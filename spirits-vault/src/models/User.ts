import { Types } from 'mongoose';
import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface for User data
 */
export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  bio: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  collection: Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Interface for User methods
 */
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Mongoose model type for User
 */
type UserModel = Model<IUser, {}, IUserMethods>;

/**
 * Schema definition for User model
 */
const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  collection: [{
    type: Schema.Types.ObjectId,
    ref: 'Spirit'
  }]
});

/**
 * Hash the password before saving
 */
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Method to compare passwords
 */
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Helper for email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * User model for MongoDB
 */
export const User = model<IUser, UserModel>('User', UserSchema); 