import app from './app.js'
import dotenv from 'dotenv'
dotenv.config() 

const port = (process.env.PORT as string)
  
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})   