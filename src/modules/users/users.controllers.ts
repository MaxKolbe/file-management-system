import { Request, Response } from 'express';
import {
    signup,
    login,
    updateUseradmin,
    updateUsersuperadmin,
} from './users.services.js';

export const getSignupPageController = (req: Request, res: Response) => {
    res.status(200).render('signup', { req });
};

export const signupController = async (req: Request, res: Response) => {
    try {
        const { email, password, officeCode } = req.body;
        const response = await signup(email, password, officeCode);

        if (response.status === 404) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        if (response.status === 400) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        res.cookie('staff', response.data, { httpOnly: true });
        res.status(200).redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/?error=An+error+occurred+during+login');
    }
};

export const getLoginPageController = (req: Request, res: Response) => {
    res.status(200).render('login', { req });
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const response = await login(email, password);

        if (response.status === 404) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        if (response.status === 400) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        res.cookie('staff', response.data, { httpOnly: true });
        res.status(200).redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/?error=An+error+occurred+during+login');
    }
};

export const getUpdateUserToAdminPage = (req: Request, res: Response) => {
    res.status(200).render('updateUserToAdmin', { req });
};

export const updateUserToAdminController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { email } = req.body;
        const response = await updateUseradmin(email);

        if (response.status === 404) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        if (response.status === 400) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        res.status(response.status).redirect(
            `/home/?error=${response.message}`,
        );
    } catch (err) {
        res.status(500).redirect('/home/?error=Could+not+update+user');
    }
};

export const updateUserToSuperAdminController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { email } = req.body;
        const response = await updateUsersuperadmin(email);

        if (response.status === 404) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        if (response.status === 400) {
            res.status(response.status).redirect(`/?error=${response.message}`);
        }

        res.status(response.status).redirect(
            `/home/?error=${response.message}`,
        );
    } catch (err) {
        res.status(500).redirect('/home/?error=Could+not+update+user');
    }
};

export const logoutController = (req: Request, res: Response) => {
    res.clearCookie('staff');
    res.status(200).redirect('/login?message=Logged+out+successfully');
};
