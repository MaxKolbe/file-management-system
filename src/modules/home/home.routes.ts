import { Router } from 'express';
import { verifyStaff } from '../../middleware/authenticate.js';
import {
  getHome,
  downloadFile,
  searchFiles,
  readFiles,
} from '../../controllers/homeController.js';

const homeRouter = Router();

//HOME PAGE
homeRouter.get('/home', verifyStaff, getHome);
homeRouter.get('/downloadFile', verifyStaff, downloadFile);
homeRouter.post('/search', verifyStaff, searchFiles);
homeRouter.get('/readFile', verifyStaff, readFiles);

export default homeRouter;
