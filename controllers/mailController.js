import crypto from "crypto"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import sendEmail from "../utils/sendMail.js"
dotenv.config()

export const getForgotForm = (req, res) => {
    res.render("forgotForm", {req})
} 

export const postForgotForm = async (req, res) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if(err){ 
            console.log(err)
            res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+crypto')
        }
        const token = buffer.toString("hex")
        try{
            const {email} = req.body 

            if(!email){
                console.log(`There was no email`)
                res.status(400).redirect('/forgotPassword/?error=Email+not+found')
            }

            const user = await userModel.findOne({email})

            if(!user){
                console.log(`User does not exist`)
                res.status(400).redirect('/forgotPassword/?error=User+not+found')
            }else{
                user.otp = token
                user.expiresIn = Date.now() + 3600000 // 1 hour
                await user.save()
     
                const username = email.split('@')[0]
    
                sendEmail(email, token, username, req, res)
            }

        }catch(err){
            console.log(err) 
            res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+reset')
        }
    })
} 

export const getResetForm = async (req, res) => {
    try{
        const user = await userModel.findOne({
            otp: req.params.id,
            expiresIn: {$gt: Date.now()}
          })
     
        if (!user) { 
            console.log(`User does not exist`)
            res.status(400).redirect('/forgotPassword/?error=User+not+found')
        }else{
            const token =  user.otp 
             res.render("resetForm", {req, token})
        }
    }catch(err){
        console.log(err) 
        res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+preset')
    }
} 
export const postResetForm = async (req, res) => {
    try {
        const user = await userModel.findOne({
            otp: req.params.id,
            expiresIn: {$gt: Date.now()}
          })

        if (!user) {
            console.log(`User does not exist`)
            res.status(400).redirect('/forgotPassword/?error=User+not+found')
        }else{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await userModel.updateOne({ 
                otp: req.params.id, 
                expiresIn: {$gt: Date.now()} }, 
                { $set: { password: hashedPassword }
            });
    
            user.otp = undefined;
            user.expiresIn = undefined;
    
            user.save()
            res.redirect("/login/?message=password+reset+successful");
        }
    } catch (err) {
        console.log(`There was an error: ${err}`);
        res.status(500).json({ message: "Internal server error" });
    }
}