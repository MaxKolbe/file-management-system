import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const verifyStaff = (req, res, next)=>{
    const token = req.cookies.staff
    if(token){
      jwt.verify(token, process.env.secret, (err, user)=>{
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

export default verifyStaff