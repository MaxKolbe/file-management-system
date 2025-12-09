import mongoose, { Document, Schema } from 'mongoose';

interface IFile extends Document {
  fileName: string;
  filePath: string;
  fileSize: string;
  fileType: string;
  typeOfCase: string;
  year: string;
  court: string;
  suitNumber: string;
  tags: string[];
  uploadedBy: string;
}
const fileSchema = new Schema(
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
    typeOfCase: {
      type: String,
      required: [true, 'Please enter a typeOfCase'],
    },
    year: {
      type: String,
      required: [true, 'Please enter a year'],
    },
    court: {
      type: String,
      required: [true, 'Please enter a court'],
    },
    suitNumber: {
      type: String,
      required: [true, 'Please enter a Suit Number'],
    },
    tags: {
      type: Array,
    },
    uploadedBy: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IFile>('documents', fileSchema);
