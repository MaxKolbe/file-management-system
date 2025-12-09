import mongoose, { Document, Schema } from 'mongoose';

interface ICustom extends Document {
  fileName: string;
  filePath: string;
  fileSize: string;
  fileType: string;
  folderName: string;
  fileFolderName: string;
}

const customSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, 'Please provide a file name'],
    },
    filePath: {
      type: String,
      required: [true, 'Please provide file path'],
    },
    fileSize: {
      type: String,
      required: [true, 'Please provide file size'],
    },
    fileType: {
      type: String,
      required: [true, 'Please provide file type'],
    },
    folderName: {
      type: String,
      required: [true, 'Please enter a folder name'],
    },
    fileFolderName: {
      type: String,
      required: [true, 'Please enter a file folder name'],
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICustom>('customs', customSchema);
