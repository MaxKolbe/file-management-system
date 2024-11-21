import userModel from "../models/userModel.js"
import signJwt from "../utils/createJwt.js"
import bcrypt from "bcrypt"
import dotenv from 'dotenv'
dotenv.config() 

export const signupGet = (req, res) => {
    res.status(200).render('signup', { req })
} 

export const loginGet = (req, res) => {
    res.status(200).render('login', { req })
} 

export const signupPost = async (req, res) => {
    const {email, password, officeCode} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    try{ 
        const preUser = await userModel.findOne({email})
        if(preUser !== null){ 
            res.status(404).redirect('/?error=User+already+exists')
        }else{
            if(officeCode !== process.env.OFFICECODE){
                res.status(404).redirect('/?error=Invalid+office+code')
            }else{
                const user = await userModel.create({email, password: hashedPassword}) 
                const token = signJwt(user.id)
                res.cookie("staff", token, {httpOnly: true})//save the jwt as a cookie 
                res.status(200).redirect('/login')
            } 
        }
    }catch(err){
        console.error(err);
        res.status(500).redirect('/?error=An+error+occurred+during+login')
    }  
} 

export const loginPost = async (req, res) => {
    const {email, password} = req.body
    try{ 
        const user = await userModel.findOne({email})
        if(user){
            if(await bcrypt.compare(password, user.password)){
                const token = signJwt(user.id)
                res.cookie("staff", token, {httpOnly: true})//save the jwt as a cookie 
                res.status(200).redirect('/home')
            }else{
                res.status(404).redirect('/login/?error=Incorrect+password')   
            }  
        }else{
            res.status(404).redirect('/login/?error=No+user+found')  
        }
    }catch(err){
        console.error(err);
        res.status(500).redirect('/login/?error=An+error+occurred+during+login')
    }  
} 

export const updateUserAdminGet = (req, res) =>{
    res.status(200).render('updateUserToAdmin', { req })
}

export const updateUserAdminPut = async (req, res) =>{
    const {email} = req.body
    const user = await userModel.findOne({email})
    try{
        if(user){
            if(user.isAdmin === true){
                res.status(404).redirect('/home/?error=user+already+admin')  
            }else{
                user.isAdmin = true
                await user.save()
                res.status(200).redirect('/home?message=success')
            }
        }else{
            res.status(404).redirect('/home/?error=No+user+found')  
        }
    }catch(err){
        res.status(500).redirect('/home/?error=Could+not+update+user')
    }
}

export const updateUserSuperAdminPut = async (req, res) =>{
    const {email} = req.body
    const user = await userModel.findOne({email})
    try{
        if(user){
            if(user.isSuperAdmin === true){
                res.status(404).redirect('/home/?error=user+already+superadmin')  
            }else{
                user.isSuperAdmin = true
                await user.save()
                res.status(200).redirect('/home?message=success+superadmin')
            }
        }else{
            res.status(404).redirect('/home/?error=No+user+found')  
        }
    }catch(err){
        res.status(500).redirect('/home/?error=Could+not+update+user')
    }
}

export const logout = (req, res) => {
    res.clearCookie("staff")
    res.status(200).redirect('/login?message=Logged+out+successfully')
}

// alternatively
// const aFunction = (req, res) => {
//     res.status(200)
// }
// export default aFunction