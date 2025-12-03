import { Router } from 'express';
import {
  getResetForm,
  postResetForm,
  getForgotForm,
  postForgotForm,
} from '../../controllers/forgotPasswordController.js';

const forgotpasswordRouter = Router();

//FORGOT-PASSWORD
forgotpasswordRouter.get('/forgotPassword', getForgotForm);
forgotpasswordRouter.post('/forgotPassword', postForgotForm);
forgotpasswordRouter.get('/resetPassword/:id', getResetForm);
forgotpasswordRouter.post('/resetPassword/:id', postResetForm);

export default forgotpasswordRouter;
