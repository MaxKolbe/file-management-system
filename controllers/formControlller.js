import multer from "multer"
import path from "path"
import fs from "fs"
import fileModel from "../models/fileModel.js"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config() 
 
//STORAGE DESINATION & FILENAME SETUP
export const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        // Retrieve metadata from req.body
        const { id } = req.params
        let { suitNumber, court, year, typeOfCase } = req.body

        // Remove spaces 
        let trimedsuitNumber = suitNumber.trim()
        let trimedcourt = court.trim()
        let trimedyear = year.trim()
        let trimedtypeOfCase = typeOfCase.trim()
  
        // If metadata is missing, retrieve the existing document's metadata from the database
        if (!suitNumber || !court || !year || !typeOfCase) {
          const document = await fileModel.findById(id)
          if (!document) { 
            return cb(new Error("Document not found"), null)
          }
  
          // Use existing document metadata as fallback
          trimedsuitNumber = trimedsuitNumber || document.suitNumber
          trimedcourt = trimedcourt || document.court
          trimedyear = trimedyear || document.year
          trimedtypeOfCase = trimedtypeOfCase || document.typeOfCase
        }
  
        // Construct the directory path using the provided or retrieved metadata
        const dir = path.join(process.env.PARENTDIR, trimedtypeOfCase, trimedyear, trimedcourt, trimedsuitNumber)
  
        // Create the directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
  
        // Callback with the constructed directory path
        cb(null, dir)
      } catch (error) {
        cb(error, null)
      }
    },
    filename: (req, file, cb) => {
      // Use the original file name when saving
      const originalName = file.originalname
      cb(null, originalName)
    }
})

export const getUploadForm = (req, res) => { 
    res.status(200).render('uploadForm',  {req})
    // res.status(200).render('uploadForm',  { req, message: null })
} 

//res.redirect() will return a status code of 302 regardless of what you specify
export const postUploadForm = async (req, res) => {
    const token = req.cookies.staff
    const decoded = jwt.verify(token, process.env.SECRET) 
    const userId = decoded.id
    const user = await userModel.findById(userId)
    const lawyer = user.email

    try {
        const { typeOfCase, year, court, suitNumber, tags } = req.body 

        if(!typeOfCase || !year || !court || !suitNumber){ 
            res.status(400).redirect('/uploadForm?error=Fill+all+form+fields!')
        }
        
        // Extract file information
        const filePath = req.file.path // Local Path
        const fileSize = req.file.size // Bytes
        const fileName = req.file.filename 
        const fileType = path.extname(req.file.originalname) 

        const fileData = new fileModel({
            fileName,
            filePath,
            fileSize,
            fileType,
            typeOfCase,
            year,
            court,
            suitNumber,
            tags: tags ? tags.split(',') : [], // Split tags by comma if sent as a string
            uploadedBy: lawyer
        })

        await fileData.save()

        res.status(201).redirect('/uploadForm?message=success') 
    } catch (err) {
        console.error(err)
        res.status(500).redirect('/uploadForm?error=An+error+occurred+during+upload')
    }
}  

export const getUpdateForm = async (req, res) => {
    const id = req.params.id  
    const document = await fileModel.findById(id)
    res.status(201).render("updateForm", {document, req}) 
}

export const updateForm = async (req, res) => {
    try {
        const { id } = req.params
        const { typeOfCase, year, court, suitNumber } = req.body
        const file = req.file

        // Find the existing document in the database
        const document = await fileModel.findById(id)
        if (!document) {  
            return res.status(404).redirect(`/uploadForm/history?error=Document+not+found`)
        }

        // Set file name based on the uploaded file or use the existing file name
        const fileName = file ? file.originalname : path.basename(document.filePath)

        // Construct the new file path, using current values if not updated
        const newFilePath = path.join(
            process.env.PARENTDIR,
            typeOfCase || document.typeOfCase,
            year || document.year,
            court || document.court,   
            suitNumber || document.suitNumber,
            fileName
        );

        // Ensure the old file exists before moving or replacing it
        if (!fs.existsSync(document.filePath)) {
            return res.status(404).redirect(`/uploadForm/history?error=Original+file+not+found`)
        }

        // Handle file movement or replacement if a new file is provided or path changes
        if (file) {
            // If a new file is uploaded, remove the old file and move the new one
            fs.renameSync(file.path, newFilePath)
            fs.unlinkSync(document.filePath) // Remove old file
        } else if (document.filePath !== newFilePath) {
            // If only the path has changed, move the existing file to the new path
            fs.mkdirSync(path.dirname(newFilePath), { recursive: true })
            fs.renameSync(document.filePath, newFilePath)
        }

        // Update the document information in the database
        await fileModel.findByIdAndUpdate(id, {
            fileName,
            filePath: newFilePath,
            typeOfCase: typeOfCase || document.typeOfCase,
            year: year || document.year,
            court: court || document.court,
            suitNumber: suitNumber || document.suitNumber,
        })

        res.status(200).redirect('/uploadForm/history?message=update+success')
    } catch (err) {
        console.error(err)
        res.status(500).redirect(`/uploadForm/history?error=An+error+occurred+during+update`)
    }
}

export const deleteForm = async (req, res) => {
      const id = req.params.id;

    try{
        const document = await fileModel.findById(id)

        if (!document) {
            res.status(404).redirect('/uploadForm/history?error=Document+not+found')
        }

        const { fileName, suitNumber, court, year, typeOfCase } = document
        const filePath = path.join(
            process.env.PARENTDIR,
            typeOfCase,
            year,
            court,
            suitNumber,
            fileName
        )

        // Delete the file from the filesystem
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Failed to delete file:', err)
                res.status(500).redirect('/uploadForm/history?error=Error+deleting+document')
            }

            // Delete the document from the database
            fileModel.findByIdAndDelete(id)
                .then(() => {
                    res.status(201).redirect('/uploadForm/history?message=success')
                })
                .catch((err) => {
                    console.error('Error deleting document from database:', err)
                    res.status(500).redirect('/uploadForm/history?error=Error+deleting+document')
                });
        })
    } catch(err) {
        console.error('Error in deleteForm:', err)
        res.status(500).redirect('/uploadForm/history?error=Internal+server+error')
    }
}
 
export const getFormHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no query parameter
    const limit = 7; // Limit the number of documents per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    try {
        // Find documents with pagination
        const documents = await fileModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total number of documents for pagination controls
        const totalDocuments = await fileModel.countDocuments();

        res.render("documentHistory", {
            documents: documents,
            req,
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching documents");
    }
}
