import multer from 'multer';
import { Router } from 'express';
import { verifyStaffAndAdmin } from '../../middleware/authenticate.js';
import {
  getcustomForm,
  postcustomForm,
  customStorage,
} from '../../controllers/customController.js';

const customRouter = Router();

//MULTER INIT CUSTOM
const upCustom = multer({ storage: customStorage });
//CUSTOM
customRouter.get('/custom', verifyStaffAndAdmin, getcustomForm);
customRouter.post(
  '/custom',
  verifyStaffAndAdmin,
  upCustom.single('file'),
  postcustomForm,
);

export default customRouter;
