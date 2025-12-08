import { Request, Response } from 'express';
import sendEmail from '../../utils/sendMail.js';
import usersModel from '../users/users.model.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const postForgotForm = async (email: string, req: Request, res: Response) => {
  const token = crypto.randomBytes(16).toString('hex');
  const user = await usersModel.findOne({ email });

  if (!user) {
    return {
      code: 400,
      message: 'User+not+found',
    };
  }

  user.otp = token;
  const expDate: number = Date.now() + 3600000; // 1 hour
  user.expiresIn = expDate as unknown as Date;
  await user.save();

  const username = email.split('@')[0] as string;

  sendEmail(email, token, username, req, res);

  return {
    code: 200,
    message: 'success',
  };
};

export const getResetForm = async (id: string) => {
  const user = await usersModel.findOne({
    otp: id,
    expiresIn: { $gt: Date.now() },
  });

  if (!user) {
    console.log(`User does not exist`);
    return {
      code: 400,
      message: 'User+not+found',
    };
  }

  const token = user.otp;

  return {
    code: 200,
    message: 'success',
    data: token,
  };
};

export const postResetForm = async (id: string, password: string) => {
  const user = await usersModel.findOne({
    otp: id,
    expiresIn: { $gt: Date.now() },
  });

  if (!user) {
    console.log(`User does not exist`);
    return {
      code: 400,
      message: 'User+not+found',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await usersModel.updateOne(
    {
      otp: id,
      expiresIn: { $gt: Date.now() },
    },
    { $set: { password: hashedPassword } },
  );

  user.otp = '';
  user.expiresIn = undefined as any;

  user.save();

  return {
    code: 200,
    message: 'password+reset+successful',
  };
};
