import { Router } from 'express';
import { verifyStaff, verifyStaffAdminAndSuperAdmin } from './users.middleware.js';
import {
  getSignupPageController,
  signupController,
  getLoginPageController,
  loginController,
  getUpdateUserToAdminPage,
  updateUserToAdminController,
  updateUserToSuperAdminController,
  logoutController,
} from './users.controllers.js';

const userRouter = Router();

//USERS
userRouter.get('/', getSignupPageController);
userRouter.post('/signup', signupController);
userRouter.get('/login', getLoginPageController);
userRouter.post('/login', loginController);
userRouter.get('/updateUserAdminGet', verifyStaffAdminAndSuperAdmin, getUpdateUserToAdminPage);
userRouter.put('/updateUserAdminPut', verifyStaffAdminAndSuperAdmin, updateUserToAdminController);
userRouter.put('/updateUserSuperAdminPut', verifyStaffAdminAndSuperAdmin, updateUserToSuperAdminController);
userRouter.get('/logout', verifyStaff, logoutController);

export default userRouter;
