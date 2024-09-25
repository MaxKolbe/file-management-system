import bcrypt from "bcrypt"
import dotenv from 'dotenv'
import userModel from "../models/userModel.js"
import sendEmail from "../utils/sendMail.js"
dotenv.config()

export const getForgotForm = (req, res) => {
    res.render("forgotForm", {req})
} 

export const postForgotForm = async (req, res) => {
   const {email} = req.body 
   try{
    if(!email){
        res.status(404).redirect('/forgotPassword/?error=Email+not+found')   
    }else{
        const user = await userModel.findOne({email})
        if(!user){
            res.status(404).redirect('/forgotPassword/?error=No+such+user')   
        }else{
            const otp =  Math.floor(1000 + Math.random() * 9000)
            const secureotp = await bcrypt.hash(otp.toString(), 10)  
            
            user.expiresIn = Date.now() + 3600000; // 1 hour
            user.otp = secureotp

            const username = email.split('@')[0];
          
            await user.save();
            sendEmail(email, username, secureotp, req, res)
        }
    }
   }catch(err){
       console.log(err) 
       res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+preset')
   }
} 

export const getResetForm = async (req, res) => {
    const user = await userModel.findOne({
        otp: req.params.id,
        expiresIn: {$gt: Date.now()},
    })
    const otp = user.otp 
    try{
        if (!user) {
            res.status(404).redirect('/forgotPassword/?error=No+such+user') 
        }else{
            res.render("resetForm", {req, otp})
        }
    }catch(err){
        console.log(`There was an error ${err}`) 
        res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+reset')
    }
} 

export const postResetForm = async (req, res) => {
    const user = await userModel.findOne({
        otp: req.params.id,
        expiresIn: {$gt: Date.now()},
    })
    try {
        if (!user) {
            res.status(404).redirect('/forgotPassword/?error=No+such+user') 
        }
        //Password Update 
        user.setPassword(req.body.password, (err) => {
            if (err) {
                console.log(`There was an error: ${err}`);
                res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+reset')
            }

            user.otp = "";
            user.expiresIn = undefined;

            user.save()
            res.redirect("/login/?message=password+reset+successful");
        });
    } catch (err) {
        console.log(`There was an error: ${err}`);
        res.status(500).redirect('/forgotPassword/?error=An+error+occurred+during+reset')
    }
} 