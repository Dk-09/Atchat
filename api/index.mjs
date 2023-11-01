import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import userModel from "./models/user.mjs"
import jwt from "jsonwebtoken"
import cors from "cors"

const mongoURL = process.env.MONGO_URL
const jwtSecret = process.env.JWT_SECRET

const app = express()
mongoose.connect(mongoURL)
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}))

app.post("/register", async (req,res) => {
    const {username, password} = req.body  
    try{
        const userCreated = await userModel.create({username, password})
        jwt.sign({userId:userCreated._id}, jwtSecret, {}, (err, token) => {
            res.cookie('token', token).status(201).json("ok")
        })
    }
    catch(err){ 
        if (err) throw err
    }
        
    
})

app.listen(4000)

