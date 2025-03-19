import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

//initialize Express
const app=express()

//connect to DB
await connectDB()

//Middlewares
app.use(cors())

//Routes
app.get('/', (req,res)=>res.send("API Working"))
app.post('/clerk',express.json(),clerkWebhooks)

//Port
const PORT = process.env.PORT || 5000

//Listen to the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)  //Logs the server is running on the specified port
})