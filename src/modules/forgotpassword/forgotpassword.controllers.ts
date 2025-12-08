import { Request, Response } from 'express';
import { postForgotForm, getResetForm, postResetForm } from './forgotpassword.services.js';

export const getForgotFormController = async (req: Request, res: Response) => {
  res.render('forgotForm', { req });
};
export const postForgotFormController = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const response = await postForgotForm(email, req, res);

    if (response.code === 400) {
      console.log(`User does not exist`);
      res.status(response.code).redirect(`/forgotPassword/?error=${response.message}`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+reset');
  }
};
export const getResetFormController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await getResetForm(id!);

    if (response.code === 400) {
      console.log(`User does not exist`);
      res.status(response.code).redirect(`/forgotPassword/?error=${response.message}`);
    }

    res.render('resetForm', { req, token: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+preset');
  }
};
export const postResetFormController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const response = await postResetForm(id!, password);

    if (response.code === 400) {
      res.status(response.code).redirect(`/forgotPassword/?error=${response.message}`);
    }

    res.redirect(`/login/?message=${response.message}`);
  } catch (err) {
    console.log(err);
      res.status(500).json({ message: "Internal server error" })
  }
};
