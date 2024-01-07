import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import userModel from "./models/user.mjs"
import jwt from "jsonwebtoken"
import cors from "cors"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt"
import { WebSocketServer } from "ws"
import messageModel from "./models/Message.mjs"

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

app.get("/messages/:userId", (req, res) => {
    const {userId} = req.params
    if (userId){
        const token  = req.cookies.token
        if (token){
            jwt.verify(token, jwtSecret, {}, async (err, userData) => {
                if (err) throw err
                const ourUserID = userData.userId
                const result = await messageModel.find({
                    from: {$in:[userId, ourUserID]},
                    to: {$in:[userId, ourUserID]},
                }).sort({createdAt: 1})
                res.json(result)
            })
        }
        else{
            res.status(401).json('no token')
        }    
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

app.get('/people', async(req, res)=>{
    const users = await userModel.find({},{'_id':1,username:1})
    res.json(users)
})

const server = app.listen(4000)

const wss = new WebSocketServer({server})
wss.on('connection',(connection, req) => {
    const cookie = req.headers.cookie
    if (cookie){
        const tokenCookieString = cookie.split(";").find(str => str.startsWith('token=')).slice(6,)
        if (tokenCookieString) {
            jwt.verify(tokenCookieString, jwtSecret, {}, (err, userData) => {
                if (err) throw err
                const {userId, username} = userData
                connection.userId = userId
                connection.username = username
            })
        }        
    }

    connection.on("message", async (message) => {
        const {text,to} = JSON.parse((message))
        if (text && to){
            const messageDoc = await messageModel.create({
                from: connection.userId,
                to: to,
                text
            });
            [...wss.clients]
            .filter(c => c.userId === to)
            .forEach(c => c.send(JSON.stringify({
                from:c.from,
                to: to,
                text,
                id: messageDoc._id
            })))
        }
    });

    [...wss.clients].forEach(clients => {
        clients.send(JSON.stringify(
            {online:[...wss.clients].map(c => ({userId: c.userId, username: c.username}))}
        ))
    })
})
