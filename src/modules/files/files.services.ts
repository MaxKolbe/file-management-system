import { Request } from 'express';
import filesModel from './files.model.js';
import path from 'path';
import fs from 'fs';

export const postUploadForm = async (
  req: Request,
  lawyer: string,
  typeOfCase: string,
  year: string,
  court: string,
  suitNumber: string,
  tags?: string,
) => {
  const filePath = req.file!.path;
  const fileSize = req.file!.size; // Bytes
  const fileName = req.file!.filename;
  const fileType = path.extname(req.file!.originalname);

  const fileData = new filesModel({
    fileName,
    filePath,
    fileSize,
    fileType,
    typeOfCase,
    year,
    court,
    suitNumber,
    tags: tags ? tags.split(',') : [],
    uploadedBy: lawyer,
  });

  await fileData.save();

  return {
    code: 200,
    message: 'success',
  };
};

export const getUpdateForm = async (id: string) => {
  const document = await filesModel.findById(id);

  return {
    code: 200,
    message: 'success',
    data: document,
  };
};

export const updateForm = async (
  id: string,
  file: any,
  typeOfCase: string,
  year: string,
  court: string,
  suitNumber: string,
) => {
  const document = await filesModel.findById(id);
  if (!document) {
    return {
      code: 404,
      message: 'Document+not+found',
    }; 
  } 

  // Set file name based on the uploaded file or use the existing file name
  const fileName = file ? file.originalname : path.basename(document.filePath);

  // Construct the new file path, using current values if not updated
  const newFilePath = path.join(
    process.env.PARENTDIR as string,
    typeOfCase || document.typeOfCase,
    year || document.year,
    court || document.court,
    suitNumber || document.suitNumber,
    fileName,
  );

  // Ensure the old file exists before moving or replacing it
  if (!fs.existsSync(document.filePath)) {
    return {
      code: 404,
      message: `Original+file+not+found`,
    };
  }
  // Handle file movement or replacement if a new file is provided or path changes
  if (file) {
    // If a new file is uploaded, remove the old file and move the new one
    fs.renameSync(file.path, newFilePath);
    fs.unlinkSync(document.filePath); // Remove old file
  } else if (document.filePath !== newFilePath) {
    // If only the path has changed, move the existing file to the new path
    fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
    fs.renameSync(document.filePath, newFilePath);
  }

  // Update the document information in the database
  await filesModel.findByIdAndUpdate(id, {
    fileName,
    filePath: newFilePath,
    typeOfCase: typeOfCase || document.typeOfCase,
    year: year || document.year,
    court: court || document.court,
    suitNumber: suitNumber || document.suitNumber,
  });

  return {
    code: 200,
    message: 'update+success',
  };
};

export const deleteForm = async (id: string) => {
  const document = await filesModel.findById(id);

  if (!document) {
    return {
      code: 404,
      message: 'Document+not+found',
    };
  }

  const filePath = document.filePath;

  fs.unlink(filePath, async (err) => {
    if (err) {
      console.error('Failed to delete file:', err);
      return {
        code: 500,
        message: 'Error+deleting+document',
      };
    }

    await filesModel.findByIdAndDelete(id);
  });

  return {
    code: 200,
    message: 'success',
  };
};

export const getFormHistory = async (skip: number, limit: number) => {
  const documents = await filesModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

  const totalDocuments = await filesModel.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    code: 200,
    data: {
      documents,
      totalPages,
    },
  };
};

export const getFile = async (id: string) => {
  const document = await filesModel.findById(id);

  if (!document) {
    return {
      code: 400,
      message: 'Document not found',
    };
  }

  return {
    code: 200,
    data: document,
  };
};
