import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  otp: string;
  expiresIn: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter an email'],
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: ' ',
    },
    expiresIn: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('users', userSchema);
