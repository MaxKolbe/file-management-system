import { Router } from 'express';
import {
  getResetForm,
  postResetForm,
  getForgotForm,
  postForgotForm,
} from '../../controllers/forgotPasswordController.js';

const forgotp = Router();

//FORGOT-PASSWORD
forgotp.get('/forgotPassword', getForgotForm);
forgotp.post('/forgotPassword', postForgotForm);
forgotp.get('/resetPassword/:id', getResetForm);
forgotp.post('/resetPassword/:id', postResetForm);

export default forgotp;
