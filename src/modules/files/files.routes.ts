import express from 'express';
import multer from 'multer';
import { verifyStaff, verifyStaffAndAdmin, verifyStaffAdminAndSuperAdmin } from '../../middleware/authenticate.js';
import {
  getUploadFormController,
  getFormHistoryController,
  getUpdateFormController,
  postUploadFormController,
  updateFormController,
  deleteFormController,
  storage,
} from './files.controllers.js';

const fileRouter = express.Router();

//MULTER INIT
const upload = multer({ storage: storage });
// Configure multer for file updates if needed
const update = multer({ storage: storage });
//FILES
fileRouter.get('/uploadForm', verifyStaffAndAdmin, getUploadFormController);
fileRouter.post('/uploadForm', verifyStaffAndAdmin, upload.single('file'), postUploadFormController);
fileRouter.get('/uploadForm/history', verifyStaffAndAdmin, getFormHistoryController);
fileRouter.get('/updateForm/:id', verifyStaffAndAdmin, getUpdateFormController);
fileRouter.put('/updateForm/:id', verifyStaffAndAdmin, update.single('file'), updateFormController);
fileRouter.delete('/uploadForm/:id', verifyStaffAndAdmin, deleteFormController);

export default fileRouter;
