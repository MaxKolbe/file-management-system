import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routes from './routes/routes.js' 
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'


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

app.use(express.json()) //requiring JSON middleware
app.use(express.static('public')); //access to public folder
app.use(express.urlencoded({extended: true})) //Accessing forms in the req variable
app.use(methodOverride("_method")) //Overide form to enable DELETE
app.use(cookieParser())
app.set("view engine", "ejs") // setting view engine
app.set('views', 'views'); // setting views folder
   
app.use('/', routes)
 
//Error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: 'Internal Server Error', error: err});
})
 
//Server listener
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
