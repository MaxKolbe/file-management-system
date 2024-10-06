import express from 'express'
import {loginGet, loginPost, signupGet, signupPost} from '../controllers/usersController.js'
import {getUploadForm, getFormHistory, getUpdateForm, postUploadForm, updateForm, deleteForm} from '../controllers/formControlller.js'
import {getResetForm, postResetForm, getForgotForm, postForgotForm} from '../controllers/forgotPasswordController.js'
import {verifyStaff, verifyStaffAndAdmin} from '../middleware/authenticate.js'

const router = express.Router()

//USERS
router.get("/", signupGet)
router.post("/signup", signupPost) 
router.get("/login", loginGet)
router.post("/login", loginPost) 
//DOCUMENTS
router.get("/uploadForm", verifyStaffAndAdmin, getUploadForm)
router.post("/uploadForm", verifyStaffAndAdmin, postUploadForm)
router.get("/uploadForm/history", verifyStaffAndAdmin, getFormHistory)
router.get("/updateForm/:id", verifyStaffAndAdmin, getUpdateForm)
router.put("/updateForm/:id", verifyStaffAndAdmin, updateForm)
router.delete("/uploadForm/:id", verifyStaffAndAdmin, deleteForm)
//FORGOT-PASSWORD
router.get("/forgotPassword", getForgotForm)
router.post("/forgotPassword", postForgotForm)
router.get("/resetPassword/:id", getResetForm)
router.post("/resetPassword/:id", postResetForm)

export default router   