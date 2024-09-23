import express from 'express'
import {loginGet, loginPost, signupGet, signupPost} from '../controllers/usersController.js'
import {getUploadForm, getFormHistory, postUploadForm, deleteForm} from '../controllers/formControlller.js'
import verifyStaff from '../middleware/authenticate.js'

const router = express.Router()
  
router.get("/login", loginGet)
router.post("/login", loginPost) 
router.get("/", signupGet)
router.post("/signup", signupPost) 


router.get("/uploadForm", verifyStaff, getUploadForm)
router.post("/uploadForm", verifyStaff, postUploadForm)
router.get("/uploadForm/history", verifyStaff, getFormHistory)
router.delete("/uploadForm/:id", verifyStaff, deleteForm)

export default router   