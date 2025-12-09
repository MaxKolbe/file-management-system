import { Request } from 'express';
import customModel from './custom.model';
import path from 'path';

export const postcustomForm = async (req: Request, folderName: string, fileFolderName: string) => {
  // Extract file information
  const filePath = req.file!.path; // Local Path
  const fileSize = req.file!.size; // Bytes
  const fileName = req.file!.filename;
  const fileType = path.extname(req.file!.originalname);

  const fileData = new customModel({
    fileName,
    filePath,
    fileSize,
    fileType,
    folderName,
    fileFolderName,
  });

  await fileData.save();

  return{
    code: 201,
    message: "success"
  }
};
