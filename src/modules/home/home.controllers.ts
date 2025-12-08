import { Request, Response } from 'express';
import { getUser } from '../../utils/getUser.js';
import { getHome, downloadFile, searchFiles, readFiles } from './home.services.js';
import path from 'path';

//Render Home View
export const getHomeController = async (req: Request, res: Response) => {
  const relativePath: string = (req.query.path as any) ? (req.query.path as any) : '';
  const basePath: string = path.join(process.env.PARENTDIR as string, relativePath);
  const query = ' ';

  const lawyer = await getUser(req, res);

  if (lawyer.code === 400) {
    res.status(lawyer.code).redirect('/login');
  }

  try {
    const response = await getHome(basePath, relativePath);
    res.render('home', { req, folderContents: response.data, relativePath, lawyer, query });
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).send('Error reading directory');
  }
};
export const downloadFileController = (req: Request, res: Response) => {};
export const searchFilesController = (req: Request, res: Response) => {};
export const readFilesController = (req: Request, res: Response) => {};
