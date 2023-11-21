import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import userModel from "./models/user.mjs"
import jwt from "jsonwebtoken"
import cors from "cors"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt"

const mongoURL = process.env.MONGO_URL
const jwtSecret = process.env.JWT_SECRET

const app = express()
mongoose.connect(mongoURL).then(() => { console.log("[+] Connected to Atlas DB")}, (err) => {console.log("[-] Error connecting to Atlas DB")})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}))
const salt = bcrypt.genSaltSync(10)

app.get("/profile", (req, res) => {
    const token  = req.cookies.token
    if (token){
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err
            res.json(userData)
        })
    }
    else{
        res.status(401).json('no token')
    }    
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body
    const foundUser = await userModel.findOne({username})
    if((foundUser) && (bcrypt.compareSync(password, foundUser.password))){ // checking if the user does exists and if it does then check the password
        jwt.sign({userId: foundUser._id, username}, jwtSecret, {}, (err, token) => {
            res.cookie('token', token).status(201).json({
                id: foundUser._id
            })
        })
    }
    else{
        return res.status(406).json("INVALID")
    }
})

app.post("/register", async (req,res) => {
    const {username, password} = req.body 
    const hashedPassword = bcrypt.hashSync(password, salt)
    try{
        const userCreated = await userModel.create({
            username, 
            password: hashedPassword
        })
        jwt.sign({userId:userCreated._id, username}, jwtSecret, {}, (err, token) => {
            res.cookie('token', token).status(201).json({
                id: userCreated._id
            })
        })        
    }
    catch(err){
        return res.status(406).json("DUP USR")
    }
        
    
})

app.listen(4000)

