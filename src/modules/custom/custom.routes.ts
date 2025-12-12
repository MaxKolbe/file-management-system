import multer from 'multer';
import { Router } from 'express';
import { verifyStaffAndAdmin } from '../users/users.middleware.js';
import { getcustomFormController, postcustomFormController, customStorage } from './custom.controllers.js';

const customRouter = Router();

//MULTER INIT CUSTOM
const upCustom = multer({ storage: customStorage });
//CUSTOM
customRouter.get('/custom', verifyStaffAndAdmin, getcustomFormController);
customRouter.post('/custom', verifyStaffAndAdmin, upCustom.single('file'), postcustomFormController);

export default customRouter;
