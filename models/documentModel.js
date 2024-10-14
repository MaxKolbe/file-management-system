import mongoose from "mongoose"

const documentSchema = mongoose.Schema({
    documentName: {
        type: String,
        required: [true, 'Please enter a document name']
    }, 
    suitNumber: {
        type: String,
        required: [true, 'Please enter a caseTitle']
    }, 
    year: {
        type: String,
        required: [true, 'Please enter a year']
    }, 
    typeOfCase: {
        type: String,
        required: [true, 'Please enter a typeOfCase']
    }, 
    court: {
        type: String,
        required: [true, 'Please enter a court']
    }, 
    fileType: {
        type: String,
        required: [true, 'Please enter a fileType']
    },
    url: {
        type: String,
        required: [true, 'Please enter a url']
    }
}, {timestamps: true})

export default mongoose.model("documents", documentSchema)