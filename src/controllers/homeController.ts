// import fs from 'fs'
// import path from 'path'
// import fileModel from "../models/fileModel.js"
// import templateModel from '../models/customModel.js'
// import userModel from "../models/userModel.js"
// import { convertDocxToHtml } from '../utils/convertDocxToHtml.js'
// import jwt from "jsonwebtoken"
// import dotenv from 'dotenv'
// dotenv.config() 

// //Render Home View
// export const getHome = async (req, res) => {
//     // Get the relative path from the request (root if undefined)
//     const relativePath = req.query.path ? req.query.path : ''
//     const basePath = path.join(process.env.PARENTDIR, relativePath)
//     const query = " "

//     const token = req.cookies.staff
//     const decoded = jwt.verify(token, process.env.SECRET) 
//     const userId = decoded.id
//     const user = await userModel.findById(userId)
//     const lawyer = user.email

//     try {
//         // Read the directory contents
//         const files = fs.readdirSync(basePath, { withFileTypes: true })

//         // Separate folders and files
//         const folderContents = files.map(file => ({
//             name: file.name,
//             isFolder: file.isDirectory(),
//             path: path.join(relativePath, file.name)
//         }))

//         // Render the EJS template with the folderContents
//         res.render('home', {req, folderContents, relativePath, lawyer, query})
//     } catch (err) {
//         console.error('Error reading directory:', err)
//         res.status(500).send('Error reading directory')
//     }
// }

// //Download Files
// export const downloadFile = (req, res) => {
//     const filePath = req.query.path // Get the file path from the query
//     let fullPath
//     if(filePath.includes(process.env.PARENTDIR)){
//         fullPath = filePath // Resolve full path
//     }else{
//         fullPath = path.join(process.env.PARENTDIR, filePath) // Resolve full path
//     }

//     res.download(fullPath, (err) => {
//         if (err) {
//             console.error('Error downloading file:', err)
//             res.status(404).redirect('/home/?error=Error+downloading+file')  
//         }
//     })
// }

// //Search For Files
// export const searchFiles = async (req, res) => {
//     try { 
//         const {longquery} = req.body
//         const query = longquery.trim() //Trim the search query

//         //Check if query is empty
//         if (!query) {
//             return res.redirect('/home')
//         }
    
//         //Search across fields using $or and $regex for partial matches
//         const fileSearchResults = await fileModel.find({
//             $or: [ 
//                 { fileName: { $regex: query, $options: 'i' } },
//                 { typeOfCase: { $regex: query, $options: 'i' } },
//                 { year: { $regex: query, $options: 'i' } },
//                 { court: { $regex: query, $options: 'i' } },
//                 { suitNumber: { $regex: query, $options: 'i' } },
//                 { tags: { $regex: query, $options: 'i' } }
//             ]
//         }) 
        
//         const templateSearchResults = await templateModel.find({
//             $or: [ 
//                 { fileName: { $regex: query, $options: 'i' } },
//                 { folderName: { $regex: query, $options: 'i' } },
//                 { fileFolderName: { $regex: query, $options: 'i' } }
//             ]
//         })

//         const searchResults =  [...fileSearchResults, ...templateSearchResults]//concatenates two arrays
 
//         // console.log("Database SR:", searchResults)

//         res.render("searchResults", {req, folderContents: searchResults})
//     } catch (err) {
//         console.error(err)
//         res.status(500).redirect(`/home?error=error+during+search`)
//     }
// }

// export const readFiles = async (req, res) => {
//     const filePath = req.query.path // File path passed as a query parameter
//     const absolutePath = path.resolve(process.env.PARENTDIR, filePath)

//     // Check if the file exists
//     if (!fs.existsSync(absolutePath)) {
//         return res.status(404).send('File not found')
//     }

//     // Determine file extension
//     const fileExt = path.extname(absolutePath).toLowerCase()

//     if (fileExt === '.pdf') {
//         // Serve the PDF directly
//         res.setHeader('Content-Type', 'application/pdf')
//         res.sendFile(absolutePath)
//     } else if (fileExt === '.docx') {
//         // Convert DOCX to HTML for browser display
//         convertDocxToHtml(absolutePath)
//             .then((htmlContent) => {
//                 res.setHeader('Content-Type', 'text/html')
//                 res.send(htmlContent)
//             })
//             .catch((error) => {
//                 console.error(error)
//                 res.status(500).send('Error reading the DOCX file')
//             })
//     } else {
//         res.status(400).send('Unsupported file type')
//     }
// }

