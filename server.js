import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routes from './routes/routes.js' 
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import passport from "passport"
import session from "express-session"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
 
dotenv.config()
 
const app = express()  

const port = process.env.PORT
  
// Database connection
mongoose.connect(process.env.DATABASEURL)
.then(()=>{
    console.log(`Connected to the mongo database successfully`)
}).catch((err)=>{
    console.log(`Database connection error: ${err}`)
})

app.use(express.json()) // requiring JSON middleware
app.use(express.static('public')) // access to public folder
app.use(express.urlencoded({extended: true})) // Accessing forms in the req variable
app.use(methodOverride("_method")) // Overide form to enable DELETE
app.use(cookieParser())
app.set("view engine", "ejs") // setting view engine
app.set('views', 'views') // setting views folder
   
app.use(session({
    secret: "blablabla", // key for encrypting session
    resave: false, // deprecated - tho still used in some cases to only resave session if it was modified
    saveUninitialized: true, // save session even if it was not modified
}))

//Passport Config
app.use(passport.initialize()) // Initialize Passport
app.use(passport.session()) // Integrates with Express session

/* Oauth Credentials */
/* Work on office code/google implementation */
/* export this bloc to a util and import it i.e import './utils/googleAuthenticate.js' */
import userModel from "./models/userModel.js"
import signJwt from "./utils/createJwt.js"
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback", // URL to redirect to after authentication
}, async (accessToken, refreshToken, profile, done) => {
    // This function is called after successful authentication
    // Here you can save the user profile to your database or session
    const email = profile._json.email

    const existingUser = await userModel.findOne({ email }) 
    if(existingUser){
        return done(null, profile) // Pass the user profile to the next middleware
    }
       
    const user = await userModel.create({email}) 
  
    // console.log("User authenticated:", user) CHANGE ID TO MONGO ID
    return done(null, profile) // Pass the user profile to the next middleware
}))

passport.serializeUser((user, done)=>{
    done(null, user) // Save user profile to session
})
passport.deserializeUser((user, done)=>{
    done(null, user) // Retrieve user profile from session 
})

app.use('/', routes)

// Start Google authentication
app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]})) 
   
// Callback URL after Google authentication
app.get("/auth/google/callback", passport.authenticate("google", {failureMessage: "/"}), async (req, res)=>{
    const email = req.user._json.email
    const existingUser = await userModel.findOne({email})
    
    const token = signJwt(existingUser.id)
    res.cookie("staff", token, {httpOnly: true})//save the jwt as a cookie 
    
    res.redirect("/home")
})

// Google Logout
// app.get("/logout", (req, res) => {
//     req.logout(()=>{
//         res.redirect("/")
//     })
// })

//Error handler
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({message: 'Internal Server Error', error: err})
})
 
//Server listener
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})   