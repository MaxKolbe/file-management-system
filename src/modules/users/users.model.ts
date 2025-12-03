import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: string;
  isSuperAdmin: string;
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
