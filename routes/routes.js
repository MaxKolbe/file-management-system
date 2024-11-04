import express from 'express'
import {getHome, downloadFile, searchFiles} from '../controllers/homeController.js'
import {loginGet, loginPost, signupGet, signupPost, updateUserAdminGet, updateUserAdminPut, logout} from '../controllers/usersController.js'
import {getUploadForm, getFormHistory, getUpdateForm, postUploadForm, updateForm, deleteForm, storage} from '../controllers/formControlller.js'
import {getResetForm, postResetForm, getForgotForm, postForgotForm} from '../controllers/forgotPasswordController.js'
import { getTemplateForm, postTemplateForm, templateStorage} from '../controllers/templateController.js'
import {verifyStaff, verifyStaffAndAdmin, verifyStaffAdminAndDev} from '../middleware/authenticate.js'
import multer from "multer";
 
const router = express.Router() 

//HOME PAGE 
router.get("/home", verifyStaff, getHome)
router.get("/downloadFile", verifyStaff, downloadFile)
router.post("/search", verifyStaff, searchFiles)
//USERS
router.get("/", signupGet)
router.post("/signup", signupPost) 
router.get("/login", loginGet)
router.post("/login", loginPost) 
router.get("/updateUserAdminGet", verifyStaffAdminAndDev, updateUserAdminGet)
router.put("/updateUserAdminPut", verifyStaffAdminAndDev, updateUserAdminPut)
router.get("/logout", verifyStaff, logout)
//FORGOT-PASSWORD
router.get("/forgotPassword", getForgotForm)
router.post("/forgotPassword", postForgotForm)
router.get("/resetPassword/:id", getResetForm)
router.post("/resetPassword/:id", postResetForm)
//MULTER INIT
const upload = multer({ storage: storage })
// Configure multer for file updates if needed
const update = multer({ storage: storage })  
//FILES
router.get("/uploadForm", verifyStaffAndAdmin, getUploadForm)
router.post("/uploadForm", verifyStaffAndAdmin, upload.single('file'), postUploadForm)
router.get("/uploadForm/history", verifyStaffAndAdmin, getFormHistory)
router.get("/updateForm/:id", verifyStaffAndAdmin, getUpdateForm)
router.put("/updateForm/:id", verifyStaffAndAdmin, update.single('file'), updateForm)
router.delete("/uploadForm/:id", verifyStaffAndAdmin, deleteForm)
//MULTER INIT TEMPLATE
const upTemp = multer({ storage: templateStorage})
//TEMPLATES
router.get("/template", verifyStaffAndAdmin, getTemplateForm)
router.post("/template", verifyStaffAndAdmin, upTemp.single('file'), postTemplateForm)

export default router   