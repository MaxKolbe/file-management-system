import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please enter an email']
    },
    password:{
        type: String
    }, 
    isAdmin:{
        type: Boolean,
        default: false
    },
    isSuperAdmin:{
        type: Boolean,
        default: false
    },
    otp:{  
        type: String,
        default: " "
    },
    expiresIn:{
        type: Date
    }
}, { timestamps: true })

export default mongoose.model("users", userSchema)