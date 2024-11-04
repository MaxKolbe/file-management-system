import multer from "multer"
import path from "path"
import fs from "fs"
import templateModel from "../models/templateModel.js"
import dotenv from 'dotenv'
dotenv.config() 

export const templateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Extract metadata from the request body
        const {templateFolder} = req.body
    
        // Construct the directory path using metadata
        const dir = path.join(process.env.PARENTDIR, "Templates", templateFolder)
    
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

export const getTemplateForm = (req, res) => {
    res.status(200).render('templateForm',  {req})
}

export const postTemplateForm = async (req, res) => {
    try {
        const { templateFolder } = req.body 

        if(!templateFolder){ 
            res.status(400).redirect('/template?error=Fill+all+form+fields!')
        }
        
        // Extract file information
        const filePath = req.file.path // Local Path
        const fileSize = req.file.size // Bytes
        const fileName = req.file.filename 
        const fileType = path.extname(req.file.originalname) 

        const fileData = new templateModel({
            fileName,
            filePath,
            fileSize,
            fileType,
            templateFolder
        })

        await fileData.save()

        res.status(201).redirect('/template?message=success') 
    } catch (err) {
        console.error(err)
        res.status(500).redirect('/template?error=An+error+occurred+during+upload')
    }
}