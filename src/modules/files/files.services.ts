import express from 'express'
import multer from "multer";
import {verifyStaff, verifyStaffAndAdmin, verifyStaffAdminAndSuperAdmin} from '../../middleware/authenticate.js'
import {getUploadForm, getFormHistory, getUpdateForm, postUploadForm, updateForm, deleteForm, storage} from '../../controllers/formControlller.js'

const fileRouter = express.Router() 

//MULTER INIT
const upload = multer({ storage: storage })
// Configure multer for file updates if needed
const update = multer({ storage: storage })  
//FILES
fileRouter.get("/uploadForm", verifyStaffAndAdmin, getUploadForm)
fileRouter.post("/uploadForm", verifyStaffAndAdmin, upload.single('file'), postUploadForm)
fileRouter.get("/uploadForm/history", verifyStaffAndAdmin, getFormHistory)
fileRouter.get("/updateForm/:id", verifyStaffAndAdmin, getUpdateForm)
fileRouter.put("/updateForm/:id", verifyStaffAndAdmin, update.single('file'), updateForm)
fileRouter.delete("/uploadForm/:id", verifyStaffAndAdmin, deleteForm)

export default fileRouter   