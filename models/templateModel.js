import mongoose from "mongoose"

const templateSchema = mongoose.Schema({
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
    typeOfCase: {
        type: String,
        default: "Template"
    }, 
    templateFolder: {
        type: String,
        required: [true, 'Please enter a template folder']
    }
}, {timestamps: true})

export default mongoose.model("templates", templateSchema)