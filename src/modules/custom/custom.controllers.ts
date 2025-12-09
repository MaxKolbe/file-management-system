import { Request, Response } from 'express';
import { postcustomForm } from './custom.services.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Extract metadata from the request body
    const { folderName, fileFolderName } = req.body;
    const trimedfolderName = folderName.trim();
    const trimedfileFolderName = fileFolderName.trim();

    // Construct the directory path using metadata
    const dir = path.join(process.env.PARENTDIR as string, trimedfolderName, trimedfileFolderName);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create nested directories
    }

    // Callback with the constructed directory path
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Use the original file name when saving
    const originalName = file.originalname;
    cb(null, originalName);
  },
});

export const getcustomFormController = async (req: Request, res: Response) => {
  res.status(200).render('customForm', { req });
};

export const postcustomFormController = async (req: Request, res: Response) => {
  const { folderName, fileFolderName } = req.body;

  if (!folderName || !fileFolderName) {
    return res.status(400).redirect('/custom?error=Fill+all+form+fields!');
  }

  try {
    const response = await postcustomForm(req, folderName, fileFolderName);

    res.status(response.code).redirect(`/custom?message=${response.message}`);
  } catch (err) {
    console.error(err);
    res.status(500).redirect('/custom?error=An+error+occurred+during+upload');
  }
};
