import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const signJwt = (id: string) => {
    return jwt.sign({id}, (process.env.SECRET as string), {expiresIn: 60*60*24}) //1 day
}

export default signJwt