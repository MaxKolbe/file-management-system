import mongoose from "mongoose"

const customSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: [true, 'Please provide a file name']
    }, 
    filePath: {
        type: String,
        required: [true, 'Please provide file path']
    }, 
    fileSize: {
        type: String,
        required: [true, 'Please provide file size']
    }, 
    fileType: {
        type: String,
        required: [true, 'Please provide file type']
    }, 
    folderName: { 
        type: String,
        required: [true, 'Please enter a folder name']
    }, 
    fileFolderName: {
        type: String,
        required: [true, 'Please enter a file folder name']
    }
}, {timestamps: true})

export default mongoose.model("customs", customSchema)