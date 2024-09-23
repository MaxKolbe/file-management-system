import documentModel from "../models/documentModel.js"
  
export const getUploadForm = (req, res) => { 
    res.status(200).render('uploadForm',  {req})
    // res.status(200).render('uploadForm',  { req, message: null })
} 

export const getFormHistory = async (req, res) => { 
    const documents = await documentModel.find().sort({ createdAt: -1 });
    res.render("documentHistory", {documents: documents, req})
} 

//res.redirect() will return a status code of 302 regardless of what you specify
export const postUploadForm = async (req, res) => {
    const {documentName, caseTitle, year, typeOfCase, court, fileType, url} = req.body
    try{
        if(!documentName || !caseTitle || !year || !typeOfCase || !court || !fileType || !url){
           res.status(400).redirect('/uploadForm?error=Fill+all+form+fields!')
        }else{
            await documentModel.create({documentName, caseTitle, year, typeOfCase, court, fileType, url})
            res.status(201).redirect('/uploadForm?message=success')
            // res.status(201).render('uploadForm', {message: "Successful upload"})
        }
    }catch(err){ 
        console.error(err);
        res.status(500).redirect('/uploadForm?error=An+error+occurred+during+upload')
    }
}

export const deleteForm = async (req, res) => {
    const id = req.params.id
    await documentModel.findByIdAndDelete(id)
    res.status(201).redirect('/uploadForm/history?message=success')
}