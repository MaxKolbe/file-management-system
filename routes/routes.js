import express from 'express'
import { getHome, downloadFile } from '../controllers/homeController.js'
import {loginGet, loginPost, signupGet, signupPost, updateUserAdminGet, updateUserAdminPut, logout} from '../controllers/usersController.js'
import {getUploadForm, getFormHistory, getUpdateForm, postUploadForm, updateForm, deleteForm, storage} from '../controllers/formControlller.js'
import {getResetForm, postResetForm, getForgotForm, postForgotForm} from '../controllers/forgotPasswordController.js'
import {verifyStaff, verifyStaffAndAdmin, verifyStaffAdminAndDev} from '../middleware/authenticate.js'
import multer from "multer";
// import path from "path";
// import fs from "fs"

const router = express.Router() 

//HOME PAGE 
router.get("/home", verifyStaff, getHome)
router.get("/downloadFile", verifyStaff, downloadFile)
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
const upload = multer({ storage: storage });
//FILES
router.get("/uploadForm", verifyStaffAndAdmin, getUploadForm)
router.post("/uploadForm", verifyStaffAndAdmin, upload.single('file'), postUploadForm)
router.get("/uploadForm/history", verifyStaffAndAdmin, getFormHistory)
router.get("/updateForm/:id", verifyStaffAndAdmin, getUpdateForm)
router.put("/updateForm/:id", verifyStaffAndAdmin, updateForm)
router.delete("/uploadForm/:id", verifyStaffAndAdmin, deleteForm)

export default router   