import fs from 'fs'
import path from 'path'
import fileModel from "../models/fileModel.js"

//Render Home View
export const getHome = async (req, res) => {
    // Get the relative path from the request (root if undefined)
    const relativePath = req.query.path ? req.query.path : ''
    const basePath = path.join(process.env.PARENTDIR, relativePath)
    const query = " "

    try {
        // Read the directory contents
        const files = fs.readdirSync(basePath, { withFileTypes: true })

        // Separate folders and files
        const folderContents = files.map(file => ({
            name: file.name,
            isFolder: file.isDirectory(),
            path: path.join(relativePath, file.name)
        }))

        // Render the EJS template with the folderContents
        res.render('home', {req, folderContents, relativePath, query})
    } catch (err) {
        console.error('Error reading directory:', err)
        res.status(500).send('Error reading directory')
    }
}

//Download Files
export const downloadFile = (req, res) => {
    const filePath = req.query.path // Get the file path from the query
    const fullPath = path.join(process.env.PARENTDIR, filePath) // Resolve full path

    res.download(fullPath, (err) => {
        if (err) {
            console.error('Error downloading file:', err)
            res.status(404).redirect('/home/?error=Error+downloading+file')  
        }
    })
}

//Search For Files
export const searchFiles = async (req, res) => {
    try { 
        const {longquery} = req.body
        const query = longquery.trim() //Trim the search query

        //Check if query is empty
        if (!query) {
            return res.redirect('/home')
        }
    
        //Search across fields using $or and $regex for partial matches
        const searchResults = await fileModel.find({
            $or: [ 
                { fileName: { $regex: query, $options: 'i' } },
                { typeOfCase: { $regex: query, $options: 'i' } },
                { year: { $regex: query, $options: 'i' } },
                { court: { $regex: query, $options: 'i' } },
                { suitNumber: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        })
 
        // console.log("Database SR:", searchResults)

        res.render("searchResults", {req, folderContents: searchResults})
    } catch (err) {
        console.error(err)
        res.status(500).redirect(`/home?error=error+during+search`)
    }
}