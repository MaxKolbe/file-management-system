import fs from 'fs'
import path from 'path'

export const getHome = async (req, res) => {
    // Get the relative path from the request (root if undefined)
    const relativePath = req.query.path ? req.query.path : ''; 
    const basePath = path.join(process.env.PARENTDIR, relativePath);

    try {
        // Read the directory contents
        const files = fs.readdirSync(basePath, { withFileTypes: true });

        // Separate folders and files
        const folderContents = files.map(file => ({
            name: file.name,
            isFolder: file.isDirectory(),
            path: path.join(relativePath, file.name)
        }));

        // Render the EJS template with the folderContents
        res.render('home', {req, folderContents, relativePath });
    } catch (err) {
        console.error('Error reading directory:', err); 
        res.status(500).send('Error reading directory');
    }
}