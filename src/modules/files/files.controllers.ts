import { Request, Response } from 'express';
import { getUser } from '../../utils/getUser.js';
import { getFormHistory, getUpdateForm, postUploadForm, updateForm, deleteForm, getFile } from './files.services.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

//STORAGE DESINATION & FILENAME SETUP
export const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { id } = req.params;
      let { suitNumber, court, year, typeOfCase } = req.body;

      let trimedsuitNumber = suitNumber.trim();
      let trimedcourt = court
      let trimedyear = year
      let trimedtypeOfCase = typeOfCase

      // If metadata is missing, retrieve the existing document's metadata from the database
      if (!suitNumber || !court || !year || !typeOfCase) {
        const response = await getFile(id!);
        if (response.code === 400) {
          return cb(new Error(`${response.message}`), null as unknown as string);
        }
        const document = response.data!;

        // Use existing document metadata as fallback
        trimedsuitNumber = trimedsuitNumber || document.suitNumber;
        trimedcourt = trimedcourt || document.court;
        trimedyear = trimedyear || document.year;
        trimedtypeOfCase = trimedtypeOfCase || document.typeOfCase;
      }

      // Construct the directory path using the provided or retrieved metadata
      const dir = path.join(
        process.env.PARENTDIR as string,
        trimedtypeOfCase,
        trimedyear,
        trimedcourt,
        trimedsuitNumber,
      );

      // Create the directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Callback with the constructed directory path
      cb(null, dir);
    } catch (error) {
      cb(error as Error, null as unknown as string);
    }
  },
  filename: (req, file, cb) => {
    // Use the original file name when saving
    const originalName = file.originalname;
    cb(null, originalName);
  },
});

export const getUploadFormController = async (req: Request, res: Response) => {
  res.status(200).render('uploadForm', { req });
};

export const postUploadFormController = async (req: Request, res: Response) => {
  const lawyer = (await getUser(req, res)).data;
  const { typeOfCase, year, court, suitNumber, tags } = req.body;

  if (!typeOfCase || !year || !court || !suitNumber) {
    return res.status(400).redirect('/uploadForm?error=Fill+all+form+fields!');
  }

  try {
    const response = await postUploadForm(req, lawyer!, typeOfCase, year, court, suitNumber, tags);

    res.status(response.code).redirect(`/uploadForm?message=${response.message}`);
  } catch (err) {
    console.error(err);
    res.status(500).redirect('/uploadForm?error=An+error+occurred+during+upload');
  }
};

export const getUpdateFormController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await getUpdateForm(id!);
  res.status(response.code).render('updateForm', { req, document: response.data });
};

export const updateFormController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { typeOfCase, year, court, suitNumber } = req.body;
  const file = req.file;

  try {
    const response = await updateForm(id!, file, typeOfCase, year, court, suitNumber);

    if (response.code === 404) {
      return res.status(response.code).redirect(`/uploadForm/history?error=${response.message}`);
    }

    res.status(response.code).redirect(`/uploadForm/history?message=${response.message}`);
  } catch (err) {
    console.error(err);
    res.status(500).redirect(`/uploadForm/history?error=An+error+occurred+during+update`);
  }
};

export const deleteFormController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await deleteForm(id!);

    if (response.code === 404) {
      return res.status(response.code).redirect(`/uploadForm/history?error=${response.message}`);
    }

    if (response.code === 500) {
      return res.status(response.code).redirect(`/uploadForm/history?error=${response.message}`);
    }

    res.status(response.code).redirect(`/uploadForm/history?message=${response.message}`);
  } catch (err) {
    console.error('Error in deleteForm:', err);
    res.status(500).redirect('/uploadForm/history?error=Error+deleting+document');
  }
};

export const getFormHistoryController = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as any) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;

  try {
    const response = await getFormHistory(skip, limit);

    res.render('documentHistory', {
      documents: response.data.documents,
      req,
      currentPage: page,
      totalPages: response.data.totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching documents');
  }
};
