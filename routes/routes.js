import express from 'express'
import { getHome } from '../controllers/homeController.js'
import {loginGet, loginPost, signupGet, signupPost} from '../controllers/usersController.js'
import {getUploadForm, getFormHistory, getUpdateForm, postUploadForm, updateForm, deleteForm} from '../controllers/formControlller.js'
import {getResetForm, postResetForm, getForgotForm, postForgotForm} from '../controllers/forgotPasswordController.js'
import {verifyStaff, verifyStaffAndAdmin} from '../middleware/authenticate.js'
import multer from "multer";
import path from "path";
import fs from "fs"

const router = express.Router()

//HOME PAGE
router.get("/home", verifyStaff, getHome)
//USERS
router.get("/", signupGet)
router.post("/signup", signupPost) 
router.get("/login", loginGet)
router.post("/login", loginPost) 
//FORGOT-PASSWORD
router.get("/forgotPassword", getForgotForm)
router.post("/forgotPassword", postForgotForm)
router.get("/resetPassword/:id", getResetForm)
router.post("/resetPassword/:id", postResetForm)

//STORAGE DESINATION & FILENAME SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Extract metadata from the request body
    const {suitNumber, court, year, typeOfCase } = req.body

    // Construct the directory path using metadata
    const dir = path.join(process.env.PARENTDIR, typeOfCase, year, court, suitNumber)

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }) // Create nested directories
    }

    // Callback with the constructed directory path
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // Use the original file name when saving
    const originalName = file.originalname
    cb(null, originalName)
  }
})
  
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