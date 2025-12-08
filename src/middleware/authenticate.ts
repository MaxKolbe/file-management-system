import { Request, Response, NextFunction } from 'express';
import { StaffPayload } from '../types/jwttype.js';
import userModel from '../modules/users/users.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyStaff = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.staff;

  if (!token) {
    res.status(500).redirect('/');
  }

  try {
    const user = jwt.verify(token, process.env.SECRET as string) as StaffPayload;
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).redirect('/?error=Error+in+verifying+staff');
  }
};

export const verifyStaffAndAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.staff;

  if (!token) {
    return res.status(401).redirect('/home/?error=Error+in+verifying+admin');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as StaffPayload;
    // req.user = decoded;?? TEST!
    const userId = decoded.id;
    const guy = await userModel.findById(userId);

    if (!guy) {
      return res.status(404).redirect('/home/?error=User+not+found');
    }
    if (guy.isAdmin === true) {
      req.user = guy;
      next();
    } else {
      return res.status(403).redirect('/home/?error=Not+a+Admin');
    }
  } catch (err) {
    console.log(err);
    return res.status(401).redirect('/?error=Error+in+verifying+token');
  }
};

export const verifyStaffAdminAndSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.staff;

  if (!token) {
    return res.status(401).redirect('/home/?error=Error+in+verifying+admin');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string) as StaffPayload;
    // req.user = decoded;?? TEST!
    const userId = decoded.id;
    const guy = await userModel.findById(userId);
    const me = 12;

    if (!guy) {
      return res.status(404).redirect('/home/?error=User+not+found');
    }
    if (guy.isSuperAdmin === true) {
      req.user = guy;
      next();
    } else {
      return res.status(500).redirect('/home/?error=Not+a+SuperAdmin');
    }
  } catch (err) {
    console.log(err);
    return res.status(401).redirect('/?error=Error+in+verifying+token');
  }
};
