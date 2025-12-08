import path from 'path';
import { convertDocxToHtml } from '../../utils/convertDocxToHtml.js';
import { Request, Response } from 'express';
import { getUser } from '../../utils/getUser.js';
import { getHome, searchFiles, readFiles } from './home.services.js';

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

export const downloadFileController = (req: Request, res: Response) => {
  const filePath = req.query.path as any;
  const parentdir = process.env.PARENTDIR as string;
  let fullPath;

  if (filePath.includes(parentdir)) {
    fullPath = filePath; // Resolve full path
  } else {
    fullPath = path.join(parentdir, filePath); // Resolve full path
  }

  res.download(fullPath, (err: Error) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).redirect('/home/?error=Error+downloading+file');
    }
  });
};
export const searchFilesController = async (req: Request, res: Response) => {
  const { longquery } = req.body;
  const query = longquery.trim();

  if (!query) {
    return res.redirect('/home');
  }

  const response = await searchFiles(query);

  res.render('searchResults', { req, folderContents: response.data });
};
export const readFilesController = async (req: Request, res: Response) => {
  const filePath: string = req.query.path as any;
  const absolutePath: string = path.resolve(process.env.PARENTDIR as string, filePath);
  const response = readFiles(absolutePath);

  if (response.code === 404) {
    return res.status(response.code).send(response.message);
  }

  if (response.data === '.pdf') {
    // Serve the PDF directly
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(absolutePath);
  } else if (response.data === '.docx') {
    try {
      // Convert DOCX to HTML for browser display
      const htmlContent = await convertDocxToHtml(absolutePath);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error reading the DOCX file');
    }
  } else {
    res.status(400).send('Unsupported file type');
  }
};
