import express from 'express'
import {getHome, downloadFile, searchFiles} from '../controllers/homeController.js'
import {loginGet, loginPost, signupGet, signupPost, updateUserAdminGet, updateUserAdminPut, updateUserSuperAdminPut, logout} from '../controllers/usersController.js'
import {getUploadForm, getFormHistory, getUpdateForm, postUploadForm, updateForm, deleteForm, storage} from '../controllers/formControlller.js'
import {getResetForm, postResetForm, getForgotForm, postForgotForm} from '../controllers/forgotPasswordController.js'
import { getcustomForm, postcustomForm, customStorage} from '../controllers/customController.js'
import {verifyStaff, verifyStaffAndAdmin, verifyStaffAdminAndSuperAdmin} from '../middleware/authenticate.js'
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
router.get("/updateUserAdminGet", verifyStaffAdminAndSuperAdmin, updateUserAdminGet)
router.put("/updateUserAdminPut", verifyStaffAdminAndSuperAdmin, updateUserAdminPut)
router.put("/updateUserSuperAdminPut", verifyStaffAdminAndSuperAdmin, updateUserSuperAdminPut)
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
//MULTER INIT CUSTOM
const upCustom = multer({ storage: customStorage})
//CUSTOM
router.get("/custom", verifyStaffAndAdmin, getcustomForm)
router.post("/custom", verifyStaffAndAdmin, upCustom.single('file'), postcustomForm)

export default router   