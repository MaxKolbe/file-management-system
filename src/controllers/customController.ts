// import multer from "multer"
// import path from "path"
// import fs from "fs"
// import customModel from "../modules/custom/custom.model.js"
// import dotenv from 'dotenv'
// dotenv.config() 

// export const customStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Extract metadata from the request body
//         const {folderName, fileFolderName} = req.body
//         const trimedfolderName = folderName.trim()
//         const trimedfileFolderName = fileFolderName.trim()
    
//         // Construct the directory path using metadata
//         const dir = path.join(process.env.PARENTDIR, trimedfolderName, trimedfileFolderName)
    
//         // Create the directory if it doesn't exist
//         if (!fs.existsSync(dir)) { 
//             fs.mkdirSync(dir, { recursive: true }) // Create nested directories
//         }
    
//         // Callback with the constructed directory path 
//         cb(null, dir)
//       },
//       filename: (req, file, cb) => {
//         // Use the original file name when saving
//         const originalName = file.originalname
//         cb(null, originalName)
//     } 
// })

// export const getcustomForm = (req, res) => {
//     res.status(200).render('customForm',  {req})
// }

// export const postcustomForm = async (req, res) => {
//     try {
//         const { folderName, fileFolderName } = req.body 
 
//         if(!folderName || !fileFolderName){ 
//             res.status(400).redirect('/custom?error=Fill+all+form+fields!')
//         }
        
//         // Extract file information
//         const filePath = req.file.path // Local Path
//         const fileSize = req.file.size // Bytes
//         const fileName = req.file.filename 
//         const fileType = path.extname(req.file.originalname) 

//         const fileData = new customModel({
//             fileName,
//             filePath,
//             fileSize,
//             fileType,
//             folderName, 
//             fileFolderName 
//         }) 

//         await fileData.save()

//         res.status(201).redirect('/custom?message=success') 
//     } catch (err) {
//         console.error(err)
//         res.status(500).redirect('/custom?error=An+error+occurred+during+upload')
//     }
// }