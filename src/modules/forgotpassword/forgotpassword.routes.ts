import { Router } from 'express';
import {
  getResetFormController,
  postResetFormController,
  getForgotFormController,
  postForgotFormController,
} from './forgotpassword.controllers.js';

const forgotp = Router();

//FORGOT-PASSWORD
forgotp.get('/forgotPassword', getForgotFormController);
forgotp.post('/forgotPassword', postForgotFormController);
forgotp.get('/resetPassword/:id', getResetFormController);
forgotp.post('/resetPassword/:id', postResetFormController);

export default forgotp;
