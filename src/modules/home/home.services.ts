import filesModel from '../files/files.model';
import customModel from '../custom/custom.model';
import usersModel from '../users/users.model';
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

export const downloadFile = () => {};

export const searchFiles = () => {};

export const readFiles = () => {};
