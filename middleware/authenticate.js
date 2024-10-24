import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import userModel from "../models/userModel.js"
dotenv.config()

export const verifyStaff = (req, res, next)=>{
  const token = req.cookies.staff
  if(token){
    jwt.verify(token, process.env.SECRET, (err, user)=>{
      if(err){
          res.status(500).redirect('/?error=Error+in+verifying+staff')
      }else{
        req.user = user
        next()
      }  
    })
  }else{ 
    res.status(500).redirect('/')//no token
  }
} 

export const verifyStaffAndAdmin = async (req, res, next) => {
  const token = req.cookies.staff
  if(token){
    jwt.verify(token, process.env.SECRET, async (err, user)=>{
      if(err){
        res.status(500).redirect('/?error=Error+in+verifying+token')
      }else{
      req.user = user
      const guy = await userModel.findById(user.id)
      if(guy.isAdmin === true){
        next()
      }else{
        res.status(500).redirect('/home/?error=Error+in+verifying+admin')
      }}
    })
  }else{ 
    res.status(500).redirect('/home/?error=Error+in+verifying+admin')
  }
}



