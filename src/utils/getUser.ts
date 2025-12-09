import usersModel from '../modules/users/users.model.js';
import { StaffPayload } from '../types/jwttype.js';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const getUser = async (req: Request, res: Response) => {
  const token = req.cookies.staff;
  const decoded = jwt.verify(token, process.env.SECRET as string) as StaffPayload;

  const userId = decoded.id;
  const user = await usersModel.findById(userId);

  if (!user) {
    return {
      code: 400,
      message: 'User not found',
    };
  }

  return {
    code: 200,
    message: 'User found',
    data: user.email,
  };
};
