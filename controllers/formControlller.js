import documentModel from "../models/documentModel.js"
  
export const getUploadForm = (req, res) => { 
    res.status(200).render('uploadForm',  {req})
    // res.status(200).render('uploadForm',  { req, message: null })
} 

// export const getFormHistory = async (req, res) => { 
//     const documents = await documentModel.find().sort({ createdAt: -1 })
//     res.render("documentHistory", {documents: documents, req})
// } 
export const getFormHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no query parameter
    const limit = 8; // Limit the number of documents per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    try {
        // Find documents with pagination
        const documents = await documentModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total number of documents for pagination controls
        const totalDocuments = await documentModel.countDocuments();

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

 
//res.redirect() will return a status code of 302 regardless of what you specify
export const postUploadForm = async (req, res) => {
    const {documentName, suitNumber, year, typeOfCase, court, fileType, url} = req.body
    try{
        if(!documentName || !suitNumber || !year || !typeOfCase || !court || !fileType || !url){
           res.status(400).redirect('/uploadForm?error=Fill+all+form+fields!')
        }else{
            await documentModel.create({documentName, suitNumber, year, typeOfCase, court, fileType, url})
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