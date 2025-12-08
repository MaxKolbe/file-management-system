import filesModel from '../files/files.model';
import customModel from '../custom/custom.model';
import fs from 'fs';
import path from 'path';

export const getHome = (basePath: string, relativePath: string) => {
  // Read the directory contents
  const files = fs.readdirSync(basePath, { withFileTypes: true });

  // Separate folders and files
  const folderContents = files.map((file) => ({
    name: file.name,
    isFolder: file.isDirectory(),
    path: path.join(relativePath, file.name),
  }));

  return {
    code: 200,
    message: 'success',
    data: folderContents,
  };
};

export const searchFiles = async (query: string) => {
  const fileSearchResults = await filesModel.find({
    $or: [
      { fileName: { $regex: query, $options: 'i' } },
      { typeOfCase: { $regex: query, $options: 'i' } },
      { year: { $regex: query, $options: 'i' } },
      { court: { $regex: query, $options: 'i' } },
      { suitNumber: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
    ],
  });

  const templateSearchResults = await customModel.find({
    $or: [
      { fileName: { $regex: query, $options: 'i' } },
      { folderName: { $regex: query, $options: 'i' } },
      { fileFolderName: { $regex: query, $options: 'i' } },
    ],
  });

  const searchResults = [...fileSearchResults, ...templateSearchResults]; //concatenates two arrays

  return {
    code: 200,
    data: searchResults,
  };
};

export const readFiles = (absolutePath: string) => {
  // Check if the file exists
  if (!fs.existsSync(absolutePath)) {
    return {
      code: 404,
      message: 'File not found',
    };
  }

  // Determine file extension
  const fileExt: string = path.extname(absolutePath).toLowerCase();

  return {
    code: 200,
    data: fileExt,
  };
};
