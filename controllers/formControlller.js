import multer from "multer"
import path from "path"
import fs from "fs"
import fileModel from "../models/fileModel.js"
import dotenv from 'dotenv'
dotenv.config() 

//STORAGE DESINATION & FILENAME SETUP
export const storage = multer.diskStorage({
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

export const getUploadForm = (req, res) => { 
    res.status(200).render('uploadForm',  {req})
    // res.status(200).render('uploadForm',  { req, message: null })
} 

//res.redirect() will return a status code of 302 regardless of what you specify
export const postUploadForm = async (req, res) => {
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
            tags: tags ? tags.split(',') : [] // Split tags by comma if sent as a string
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

        // Find the existing document
        const document = await fileModel.findById(id)
        if (!document) {
            return res.status(404).send('Document not found')
        }

        const oldFilePath = path.join( document.filePath) // Current file location
        const fileName = file ? file.originalname : path.basename(oldFilePath) // Use new file name if uploaded else use old name
        const newFilePath = path.join(
            process.env.PARENTDIR,
            typeOfCase || document.typeOfCase,
            year || document.year,
            court || document.court,   
            suitNumber || document.suitNumber,
            file ? file.originalname : path.basename(oldFilePath) // Use new file name if uploaded, else old one
        )
 
        // Ensure the old file exists
        if (!fs.existsSync(oldFilePath)) {
            return res.status(404).send('Original file not found')
        }
        
        // Move the file if the path has changed
        if (oldFilePath !== newFilePath) {
            // Ensure the new directory structure exists
            fs.mkdirSync(path.dirname(newFilePath), { recursive: true })
            
            // Move file to the new path if a new file is uploaded
            if (file) {
                fs.renameSync(file.path, newFilePath) // Move uploaded file to new location
                fs.unlinkSync(oldFilePath) // Delete old file
            } else {
                fs.renameSync(oldFilePath, newFilePath) // Move old file if path changed
            }
        }

        // Update database 
        await fileModel.findByIdAndUpdate(id, {
            filePath: newFilePath,
            typeOfCase,
            year,
            court,
            suitNumber, 
            fileName
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

// export const updateForm = async (req, res) => {
//     const id = req.params.id 
//     const updateFields = {}

//     if (req.body.typeOfCase) {updateFields.typeOfCase = req.body.typeOfCase}
//     if (req.body.year) {updateFields.year = req.body.year}
//     if (req.body.court) {updateFields.court = req.body.court}
//     if (req.body.suitNumber) {updateFields.suitNumber = req.body.suitNumber}
//     if (req.body.tags) {updateFields.tags = req.body.tags}

//     try{
//         await fileModel.findByIdAndUpdate(id,{ $set: updateFields })
//         res.status(201).redirect('/uploadForm?message=Update+success')
//     }catch(err){
//         console.error(err);
//         res.status(500).redirect(`/updateForm/${id}?error=An+error+occurred+during+update`)
//     }
// }  

// export const updateForm = async (req, res) => {
//     try {
//          const { id } = req.params
//          const { typeOfCase, year, court, suitNumber } = req.body
//          const file = req.file
 
//          // Find the existing document
//          const document = await fileModel.findById(id)
//          if (!document) {
//              return res.status(404).send('Document not found')
//          }
 
//          const oldFilePath = path.join( document.filePath) // Current file location
//          const fileName = file ? file.originalname : path.basename(oldFilePath) // Use new file name if uploaded
//          const newFilePath = path.join(
//              process.env.PARENTDIR,
//              typeOfCase,
//              year,
//              court,  
//              suitNumber,
//              file ? file.originalname : path.basename(oldFilePath) // Use new file name if uploaded, else old one
//          )
 
//          // Ensure the old file exists
//          if (!fs.existsSync(oldFilePath)) {
//              return res.status(404).send('Original file not found')
//          }
         
//          // Move the file if the path has changed
//          if (oldFilePath !== newFilePath) {
//              // Ensure the new directory structure exists
//              fs.mkdirSync(path.dirname(newFilePath), { recursive: true })
             
//              // Move file to the new path if a new file is uploaded
//              if (file) {
//                  console.log("there is file")
//                  fs.renameSync(file.path, newFilePath) // Move uploaded file to new location
//                  fs.unlinkSync(oldFilePath) // Delete old file
//              } else {
//                  fs.renameSync(oldFilePath, newFilePath) // Move old file if path changed
//                  console.log("there is no file")
//              }
//          }
 
//          // Update database 
//          await fileModel.findByIdAndUpdate(id, {
//              fileName,
//              suitNumber, 
//              court,
//              year,
//              typeOfCase,
//              filePath: newFilePath
//          })
 
//          res.status(200).redirect('/uploadForm/history?message=update+success')
//      } catch (error) {
//          console.error(error)
//          res.status(500).redirect(`/uploadForm/history?error=An+error+occurred+during+update`)
//      }
//  }   
 