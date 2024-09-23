import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const signJwt = (id) => {
    return jwt.sign({id}, process.env.SECRET, {expiresIn: 60*60*24}) //1 day
}

export default signJwt