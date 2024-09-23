import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please enter an email']
    },
    password:{
        type: String,
        requird: [true, 'Please enter a password']
    }, 
    isAdmin:{
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export default mongoose.model("users", userSchema)