import multer from "multer";
import path from "path";
import fs from "fs"
import fileModel from "../models/fileModel.js"
import dotenv from 'dotenv'
dotenv.config() 

export const getUploadForm = (req, res) => { 
    res.status(200).render('uploadForm',  {req})
    // res.status(200).render('uploadForm',  { req, message: null })
} 

//res.redirect() will return a status code of 302 regardless of what you specify
export const postUploadForm = async (req, res) => {
    try {
        // Extract file information
        const filePath = req.file.path // Path to the file in  local system
        const fileSize = req.file.size // File size in bytes
        const fileName = req.file.filename // Stored file name
        const fileType = path.extname(req.file.originalname) // File type 

        // Any additional metadata
        const { typeOfCase, year, court, suitNumber, tags } = req.body // Example form fields for metadata

        // Store metadata in MongoDB
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
    } catch (error) {
        console.error(err)
        res.status(500).redirect('/uploadForm?error=An+error+occurred+during+upload')
    }
}

export const getUpdateForm = async (req, res) => {
    const id = req.params.id  
    const document = await fileModel.findById(id)
    res.status(201).render("updateForm", {document, req}) 
}

/*********************************************************/
export const updateForm = async (req, res) => {
    const id = req.params.id;
    const updateData = {};
    
    // Find the existing document
    const existingDocument = await fileModel.findById(id);
    if (!existingDocument) {
        return res.status(404).send('Document not found');
    }

    // Check for fields in the request body and update them
    if (req.body.fileName) updateData.fileName = req.body.fileName;
    if (req.body.suitNumber) updateData.suitNumber = req.body.suitNumber;
    if (req.body.court) updateData.court = req.body.court;
    if (req.body.year) updateData.year = req.body.year;
    if (req.body.typeOfCase) updateData.typeOfCase = req.body.typeOfCase;

    // Check if a new file is being uploaded
    if (req.file) {
        // Construct the old file path
        const oldFilePath = path.join(
            process.env.PARENTDIR,
            existingDocument.fileName,
            existingDocument.suitNumber,
            existingDocument.court,
            existingDocument.year.toString(),
            existingDocument.typeOfCase
        );

        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error('Failed to delete old file:', err);
                return res.status(500).send('Error deleting old file');
            }
        });

        // Update the updateData object with the new file info
        updateData.filePath = req.file.path; // Set new file path to the database
    }
    try {
        await fileModel.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).redirect('/uploadForm/history?message=update_successful');
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).send('Error updating document');
    }
}  
/*********************************************************/

export const deleteForm = async (req, res) => {
      const id = req.params.id;

    try{
        const document = await fileModel.findById(id)

        if (!document) {
            return res.status(404).send('Document not found')
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
                return res.status(500).send('Error deleting file')
            }

            // Delete the document from the database
            fileModel.findByIdAndDelete(id)
                .then(() => {
                    res.status(201).redirect('/uploadForm/history?message=success')
                })
                .catch((err) => {
                    console.error('Error deleting document from database:', err)
                    res.status(500).send('Error deleting document from database')
                });
        })
    } catch (error) {
        console.error('Error in deleteForm:', error)
        res.status(500).send('Internal server error')
    }
}

export const getFormHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no query parameter
    const limit = 8; // Limit the number of documents per page
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
};

// export const deleteForm = async (req, res) => {
//     const id = req.params.id
//     await fileModel.findByIdAndDelete(id)
//     res.status(201).redirect('/uploadForm/history?message=success')
// }

//res.redirect() will return a status code of 302 regardless of what you specify
// export const postUploadForm = async (req, res) => {
//     const {documentName, suitNumber, year, typeOfCase, court, fileType, url} = req.body
//     try{
//         if(!documentName || !suitNumber || !year || !typeOfCase || !court || !fileType || !url){
//            res.status(400).redirect('/uploadForm?error=Fill+all+form+fields!')
//         }else{
//             await fileModel.create({documentName, suitNumber, year, typeOfCase, court, fileType, url})
//             res.status(201).redirect('/uploadForm?message=success')
//             // res.status(201).render('uploadForm', {message: "Successful upload"})
//         }
//     }catch(err){ 
//         console.error(err);
//         res.status(500).redirect('/uploadForm?error=An+error+occurred+during+upload')
//     }
// }

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