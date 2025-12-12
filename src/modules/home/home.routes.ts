import { Router } from 'express';
import { verifyStaff } from '../users/users.middleware.js';
import { getHomeController, downloadFileController, searchFilesController, readFilesController } from './home.controllers.js';

const homeRouter = Router();

//HOME PAGE
homeRouter.get('/home', verifyStaff, getHomeController);
homeRouter.get('/downloadFile', verifyStaff, downloadFileController);
homeRouter.post('/search', verifyStaff, searchFilesController);
homeRouter.get('/readFile', verifyStaff, readFilesController);

export default homeRouter;
